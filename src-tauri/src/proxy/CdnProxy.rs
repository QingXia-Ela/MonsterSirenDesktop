use std::{
    borrow::BorrowMut,
    collections::{HashMap, HashSet},
    net::SocketAddrV4,
    sync::Mutex,
    thread::{self, JoinHandle},
};

use futures::executor::block_on;
use once_cell::sync::Lazy;
use reqwest::{
    header::{HeaderMap, ACCESS_CONTROL_ALLOW_ORIGIN, CONTENT_LENGTH},
    Client,
};
use warp::{path::FullPath, Filter};

const SIREN_WEBSITE: &str = "https://monster-siren.hypergryph.com";

type FilterType = Vec<[&'static str; 2]>;

struct cache_item(HeaderMap, Box<bytes::Bytes>);

static mut REQUEST_CACHE: Lazy<Mutex<HashMap<String, cache_item>>> =
    Lazy::new(|| Mutex::new(HashMap::new()));

pub struct CdnProxy {}

impl CdnProxy {
    /// Create a new cdn proxy server
    /// # Example
    /// ```
    /// thread::spawn(move || {
    ///   let _ = CdnProxy::new(11451, 11452, vec![["content will be replace", "content will use"]]);
    /// })
    /// ```
    #[tokio::main]
    pub async fn new(port: u16, api_port: u16, filter_rules: FilterType) -> Self {
        let proxy = warp::path::full()
            .and(warp::header::headers_cloned())
            .and_then(move |p, h| handle_request(p, h, port, api_port, filter_rules.clone()));
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
    unsafe {
        if let Some(v) = REQUEST_CACHE
            .lock()
            .unwrap()
            .get(&path.as_str().to_string())
        {
            let final_bytes = *v.1.clone();
            let cache_header = &v.0;
            let mut response = warp::reply::Response::new(final_bytes.into());

            let res_header = response.headers_mut();

            for (k, v) in cache_header.iter() {
                res_header.insert(k, v.clone());
            }

            return Ok(response);
        }
    }

    let client = Client::new();
    let target_url = format!("https://web.hycdn.cn{}", path.as_str());

    let mut request_builder = client.get(&target_url);
    request_builder = request_builder.header("referer", SIREN_WEBSITE);

    let response_file = Box::new(request_builder.send().await.unwrap());
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
    unsafe {
        REQUEST_CACHE.lock().unwrap().insert(
            path.as_str().to_string(),
            cache_item(res_header_map.clone(), Box::new(response_bytes)),
        );
    }

    Ok(response)
}

fn change_body(body: String, port: u16, api_port: u16, filter_rules: FilterType) -> String {
    let mut basic = body
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
}

pub fn get_basic_filter_rules(mut settings: Vec<CdnProxyRules>) -> FilterType {
    let mut rules = vec![];
    // default expose store
    settings.extend(vec![
        CdnProxyRules::ExposeStore,
        CdnProxyRules::ExposeHistory,
        CdnProxyRules::LogStoreChange,
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
                "return function(n){if(window.siren_config?.log_store)console.log(n);if",
            ]),
            CdnProxyRules::PreventAutoplay => {
                rules.push(["i.initCtx()}i.play()};", "i.initCtx()}};"])
            }
            CdnProxyRules::ExposeHistory => {
                rules.push(["};return X", "};window.siren_router=X;return X"])
            }
        }
    }

    rules
}

pub fn spawn_cdn_proxy(config: &crate::config::Config) -> JoinHandle<()> {
    let mut rules = vec![];

    if config.basic.closeAutoPlay {
        rules.push(CdnProxyRules::PreventAutoplay)
    }

    thread::spawn(|| {
        CdnProxy::new(11451, 11452, get_basic_filter_rules(rules));
    })
}
