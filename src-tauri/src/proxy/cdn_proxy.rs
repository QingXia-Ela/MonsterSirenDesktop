use include_dir::{include_dir, DirEntry};
use monster_siren_desktop::logger::debug;
use std::{
    borrow::BorrowMut,
    collections::{HashMap, HashSet},
    net::SocketAddrV4,
    sync::Arc,
    thread::{self, JoinHandle},
};

use futures::executor::block_on;
use lazy_static::lazy_static;
use reqwest::{
    header::{HeaderMap, ACCESS_CONTROL_ALLOW_ORIGIN, CONTENT_LENGTH},
    Client,
};
use tokio::sync::Mutex;
use warp::{path::FullPath, Filter};

const SIREN_WEBSITE: &str = "https://monster-siren.hypergryph.com";
const CDN_WEBSITE: &str = "https://web.hycdn.cn";

type FilterType = Vec<[&'static str; 2]>;

struct CacheItem(HeaderMap, Box<bytes::Bytes>);

lazy_static! {
    static ref REQUEST_CACHE: Arc<Mutex<HashMap<String, CacheItem>>> =
        Arc::new(Mutex::new(HashMap::new()));
}

fn parse_dir_2_kv(dir: &DirEntry, map: &mut HashMap<String, Vec<u8>>) {
    let path = dir.path();
    if let Some(f) = dir.as_file() {
        let buf = f.contents().to_vec();
        map.insert(path.to_str().unwrap().to_string(), buf);
    } else {
        for entry in dir.children() {
            parse_dir_2_kv(entry, map);
        }
    }
}

#[derive(Debug)]
pub struct CdnProxy {}

impl CdnProxy {
    /// Create a new cdn proxy server
    /// # Example
    /// ```
    /// thread::spawn(move || {
    ///   let _ = cdn_proxy::new(11451, 11452, vec![["content will be replace", "content will use"]]);
    /// })
    /// ```
    #[tokio::main]
    pub async fn new(
        port: u16,
        api_port: u16,
        filter_rules: FilterType,
        cdn_cache: Option<HashMap<String, Vec<u8>>>,
    ) -> Self {
        let proxy = warp::path::full()
            .and(warp::header::headers_cloned())
            .and_then(move |p, h| handle_request(p, h, port, api_port, filter_rules.clone()));

        let mut static_assets_header = HeaderMap::new();
        static_assets_header.insert(ACCESS_CONTROL_ALLOW_ORIGIN, "*".parse().unwrap());

        if let Some(mut cdn_cache) = cdn_cache {
            let mut cache = REQUEST_CACHE.lock().await;

            // web sdk return empty js, just only trigger umi load successful event so that website can be loaded
            cdn_cache.insert(String::from("hg_web_sdk/lib/sdk.entry.js"), vec![]);

            for (k, v) in cdn_cache.into_iter() {
                let b = bytes::Bytes::from(v);

                cache.insert(
                    format!("/{}", k),
                    CacheItem(static_assets_header.clone(), Box::new(b)),
                );
            }

            #[cfg(debug_assertions)]
            debug(format!("Siren static assets count: {:?}", cache.keys().len()).as_str());
        }

        block_on(async {
            let addr: SocketAddrV4 = format!("127.0.0.1:{}", port).parse().unwrap();
            warp::serve(proxy).run(addr).await;
        });
        CdnProxy {}
    }
}

async fn handle_request(
    path: FullPath,
    _headers: HeaderMap,
    port: u16,
    api_port: u16,
    filter_rules: FilterType,
) -> Result<impl warp::Reply, warp::Rejection> {
    // cache
    let path_without_params = path.as_str().to_string();
    let target_url = if let Some((p1, _)) = path_without_params.split_once("?") {
        p1
    } else {
        path.as_str()
    };
    if let Some(v) = REQUEST_CACHE.lock().await.get(target_url) {
        #[cfg(debug_assertions)]
        debug(format!("Cache hit: {}", path.as_str()).as_str());
        let mut final_bytes = *v.1.clone();

        if path.as_str().contains(".js") || path.as_str().contains(".css") {
            let res_str = change_body(
                String::from_utf8(final_bytes.to_vec()).unwrap(),
                port,
                api_port,
                filter_rules,
            );
            final_bytes = res_str.into();
        }

        let cache_header = &v.0;
        let mut response = warp::reply::Response::new(final_bytes.into());

        let res_header = response.headers_mut();

        for (k, v) in cache_header.iter() {
            res_header.insert(k, v.clone());
        }

        return Ok(response);
    }

    let client = Client::new();
    let target_url = format!("{}{}", CDN_WEBSITE, path.as_str());

    let mut request_builder = client.get(&target_url);
    request_builder = request_builder.header("referer", SIREN_WEBSITE);

    let response_file = request_builder.send().await;

    let response_file = match response_file {
        Ok(r) => r,
        Err(_) => {
            return Err(warp::reject::not_found());
        }
    };

    let mut response = warp::reply::Response::new("".into());

    let mut header_map = HeaderMap::new();
    for (k, v) in response_file.headers().iter() {
        header_map.insert(k.clone(), v.clone());
    }

    let mut response_bytes = bytes::Bytes::new();
    // basic js css change
    if target_url.contains(".js") || target_url.contains(".css") {
        let res_str = change_body(
            response_file.text().await.unwrap(),
            port,
            api_port,
            filter_rules,
        );
        response_bytes = res_str.into();
    } else {
        response_bytes = response_file.bytes().await.unwrap();
    }

    response = warp::reply::Response::new(response_bytes.clone().into());
    let res_header_map = response.headers_mut();
    for (k, v) in header_map.borrow_mut().into_iter() {
        res_header_map.insert(k.clone(), v.clone());
    }
    // remove source to let warp auto generate
    res_header_map.remove(CONTENT_LENGTH);
    res_header_map.insert(ACCESS_CONTROL_ALLOW_ORIGIN, "*".parse().unwrap());

    // cache set
    REQUEST_CACHE.lock().await.insert(
        path.as_str().to_string(),
        CacheItem(res_header_map.clone(), Box::new(response_bytes)),
    );

    Ok(response)
}

fn change_body(body: String, port: u16, api_port: u16, filter_rules: FilterType) -> String {
    let mut basic = body
        // fontset api handle
        .replace("/api/fontset", "/fontset")
        // replace cdn
        .replace("web.hycdn.cn", format!("localhost:{}", port).as_str())
        .replace("https", "http")
        // change site all store request api
        .replace("/api/", format!("http://localhost:{}/", api_port).as_str());

    for [find, replace] in filter_rules.iter() {
        basic = basic.replace(find, replace);
    }
    basic
}

#[derive(Debug, Eq, PartialEq, Hash)]
pub enum CdnProxyRules {
    LogStoreChange,
    PreventAutoplay,
    ExposeStore,
    ExposeHistory,
    ExposeAudioContext,
    RemoveServiceWorker,
    RemoveSdkEntry,
}

pub fn get_basic_filter_rules(mut settings: Vec<CdnProxyRules>) -> FilterType {
    let mut rules = vec![];
    // default expose store
    settings.extend(vec![
        CdnProxyRules::ExposeStore,
        CdnProxyRules::ExposeHistory,
        CdnProxyRules::ExposeAudioContext,
        CdnProxyRules::LogStoreChange,
        CdnProxyRules::RemoveServiceWorker,
        CdnProxyRules::RemoveSdkEntry,
    ]);
    let settings = settings
        .into_iter()
        .collect::<HashSet<_>>()
        .into_iter()
        .collect::<Vec<_>>();

    for v in settings {
        match v {
            CdnProxyRules::ExposeStore => {
                rules.push(["this.store=e,", "this.store=e,window.siren_store=e,"])
            }
            CdnProxyRules::LogStoreChange => rules.push([
                "return function(n){if",
                "return function(n){if(window.siren_config?.logStore)console.log(n);if",
            ]),
            CdnProxyRules::PreventAutoplay => {
                rules.push(["i.initCtx()}i.play()};", "i.initCtx()}};"])
            }
            CdnProxyRules::ExposeHistory => {
                rules.push(["};return X", "};window.siren_router=X;return X"])
            }
            CdnProxyRules::ExposeAudioContext => rules.push([
                "c.instance=void 0",
                "c.instance=void 0;window.siren_audio_instance=c.getInstance()",
            ]),
            CdnProxyRules::RemoveServiceWorker => rules.push([
                "&&navigator.serviceWorker.register(\"/service-worker.js\")",
                "",
            ]),
            CdnProxyRules::RemoveSdkEntry => rules.push([
                ",window.document.head.appendChild(s)),s.addEventListener(\"error\",u)",
                ")",
            ]),
        }
    }

    // todo!: 增加移除 google analysis 和 hg sdk 的跟踪

    rules
}

pub fn spawn_cdn_proxy(app: tauri::AppHandle, config: &crate::config::Config) -> JoinHandle<()> {
    let mut rules = vec![];

    if config.basic.closeAutoPlay {
        rules.push(CdnProxyRules::PreventAutoplay)
    }

    let mut cdn_cache = HashMap::new();

    // insert siren assets
    // if inline code is write in tokio codeblock will cause inline twice time when bundle
    let dirmap = include_dir!("$CARGO_MANIFEST_DIR/ignored-assets/web.hycdn.cn");

    for entry in dirmap.entries() {
        parse_dir_2_kv(entry, &mut cdn_cache);
    }

    thread::spawn(|| {
        CdnProxy::new(11451, 11452, get_basic_filter_rules(rules), Some(cdn_cache));
    })
}

mod open_download {
    #[cfg(feature = "open_download")]
    fn start_cdn() {}
}
