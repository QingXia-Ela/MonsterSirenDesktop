use brotlic::{
    decode::{DecodeError, DecodeResult},
    BrotliDecoder,
};
use futures::executor::block_on;
use lazy_static::lazy_static;
use regex::Regex;
use reqwest::{
    header::{
        HeaderMap, ACCESS_CONTROL_ALLOW_ORIGIN, CONTENT_ENCODING, CONTENT_LENGTH, CONTENT_TYPE,
    },
    Client,
};
use serde::{Deserialize, Serialize};
use std::{borrow::BorrowMut, collections::HashMap, fmt::Debug, net::SocketAddrV4, thread};
use std::{collections::HashSet, thread::JoinHandle};
use warp::{
    path::FullPath,
    reply::{Reply, Response},
    Filter,
};

use crate::{
    error::PluginRequestError,
    global_struct::{
        music_injector::MusicInjector,
        siren::{response_msg::ResponseMsg, Song},
    },
    vanilla_injector::siren_injector::{self},
};

const SIREN_WEBSITE: &str = "https://monster-siren.hypergryph.com";
lazy_static! {
    /// capture path like `/song/{{namespace}:}{id}`
    /// vanilla path doesn't have namespace like: `/song/{id}`
    static ref SONG_REGEX: Regex = Regex::new(r"/song/(?P<namespace>\w+):(?P<id>\d+)").unwrap();
    /// capture path like `/song/{{namespace}:}{id}/detail` or `/song/{{namespace}:}{id}/data`
    /// two path will call method `get_album`
    static ref ALBUM_REGEX: Regex = Regex::new(r"/album/(?P<namespace>\w+):(?P<id>\d+)").unwrap();
}
type FilterType = Vec<[&'static str; 2]>;

pub struct ApiProxy;

impl ApiProxy {
    /// Create a new api proxy server
    ///
    /// **Warning**: This is a low level api.
    ///
    /// [siren api docs](https://github.com/QingXia-Ela/MonsterSirenApi/blob/main/docs/dev/%E6%8E%A5%E5%8F%A3%E4%B8%80%E8%A7%88.md)
    ///
    /// # Example
    /// ```
    /// thread::spawn(move || {
    ///   let _ = api_proxy::new(11452, 11451, vec![["content will be replace", "content will use"]]);
    /// })
    /// `
    #[tokio::main]
    pub async fn new(port: u16, cdn_port: u16, filter_rules: FilterType) -> Self {
        let s = vec![siren_injector::get_injector()];
        let mut injector_map: HashMap<String, MusicInjector> = HashMap::new();
        // run only once
        for m in s.into_iter() {
            injector_map.insert(m.namespace.clone(), m);
        }
        let proxy = warp::path::full()
            .and(warp::header::headers_cloned())
            // todo!: move to handle with plugin
            .and_then(move |p, r| handle_request(port, cdn_port, p, r, filter_rules.clone()));
        block_on(async {
            let addr: SocketAddrV4 = format!("127.0.0.1:{}", port).parse().unwrap();
            warp::serve(proxy).run(addr).await;
        });
        ApiProxy {}
    }
}

fn parse_plugin_request_error_2_warp_rejection(err: PluginRequestError) -> warp::Rejection {
    warp::reject::custom(err)
}

fn get_response_from_string(s: String) -> Response {
    Response::new("".into())
    // Re
}

/// Handle api request and use plugin to modify response.
///
/// If no path match, request will be handled by vanilla api:
///
/// `https://monster-siren.hypergryph.com/api/{your_path}`
async fn handle_request_with_plugin(
    port: u16,
    cdn_port: u16,
    path: FullPath,
    headers: HeaderMap,
    filter_rules: FilterType,
    injector: &MusicInjector,
) -> Result<impl warp::Reply, warp::Rejection> {
    let p = path.as_str();
    // song
    if let Some(caps) = SONG_REGEX.captures(p) {
        let namesp = &caps["namespace"];
        let id = &caps["id"];
        let res = injector.request_interceptor.get_song(id.to_string()).await;
        match res {
            Ok(r) => {
                let res = ResponseMsg::<Song> {
                    code: 0,
                    msg: "".to_string(),
                    data: r,
                };
                return Ok(get_response_from_string(
                    serde_json::to_string(&res).unwrap(),
                ));
            }
            Err(e) => {
                return Err(parse_plugin_request_error_2_warp_rejection(e.into()));
            }
        };
    }
    // album
    else if let Some(caps) = ALBUM_REGEX.captures(p) {
        let namesp = &caps["namespace"];
        let id = &caps["id"];
        let res = injector.request_interceptor.get_album(id.to_string()).await;
    }
    // api without namespace
    match p {
        "/songs" => {
            todo!()
        }
        "/albums" => {
            todo!()
        }
        _ => {
            let res = handle_request(port, cdn_port, path, headers, filter_rules).await;
            match res {
                Ok(r) => Ok(r.into_response()),
                Err(e) => Err(e),
            }
        }
    }
}

async fn handle_request(
    port: u16,
    cdn_port: u16,
    path: FullPath,
    _headers: HeaderMap,
    filter_rules: FilterType,
) -> Result<impl warp::Reply, warp::Rejection> {
    let client = Client::new();
    let target_url = String::from(format!(
        "https://monster-siren.hypergryph.com/api{}",
        path.as_str()
    ));

    let mut request_builder = client.get(&target_url);
    request_builder = request_builder.header("referer", SIREN_WEBSITE);

    let response_json = request_builder.send().await.unwrap();
    let mut response = Response::new("".into());

    let mut header_map = HeaderMap::new();
    for (k, v) in response_json.headers().iter() {
        header_map.insert(k.clone(), v.clone());
    }
    let mut res_str = String::new();

    match response.headers().get(CONTENT_ENCODING) {
        Some(v) => match v.to_str() {
            Ok("br") => {
                let decoded =
                    decode_brotli(&response_json.bytes().await.unwrap().to_vec().as_slice())
                        .unwrap();
                res_str = String::from_utf8(decoded).unwrap();
            }
            _ => res_str = response_json.text().await.unwrap(),
        },
        _ => res_str = response_json.text().await.unwrap(),
    };

    res_str = change_body(res_str, filter_rules, port, cdn_port);
    response = Response::new(res_str.clone().into());

    let res_header_map = response.headers_mut();
    for (k, v) in header_map.borrow_mut().into_iter() {
        res_header_map.insert(k.clone(), v.clone());
    }
    res_header_map.remove(CONTENT_ENCODING);

    // avoid content-length are not actual length
    res_header_map.insert(CONTENT_LENGTH, res_str.len().into());
    res_header_map.insert(ACCESS_CONTROL_ALLOW_ORIGIN, "*".parse().unwrap());

    Ok(response)
}

fn decode_brotli(body: &[u8]) -> Result<Vec<u8>, DecodeError> {
    // let mut decompressor = DecompressorReader::new([u8; 1024]);
    let mut decoder = BrotliDecoder::new();
    let mut res = [0; 114514];
    let res: Result<DecodeResult, brotlic::decode::DecodeError> =
        decoder.decompress(body, &mut res);
    match res {
        Ok(_) => Ok(unsafe { decoder.take_output() }.unwrap().to_vec()),
        Err(dec_err) => Err(dec_err),
    }
}

fn change_body(body: String, filter_rules: FilterType, port: u16, cdn_port: u16) -> String {
    let mut basic = body
        // replace cdn
        .replace("web.hycdn.cn", format!("localhost:{}", cdn_port).as_str())
        .replace(
            format!("{}/api", SIREN_WEBSITE).as_str(),
            format!("localhost:{}", port).as_str(),
        )
        .replace("https", "http");

    for [find, replace] in filter_rules.iter() {
        basic = basic.replace(find, replace);
    }
    basic
}

#[derive(Debug, Eq, PartialEq, Hash)]
pub enum ApiProxyRules {}

pub fn get_basic_filter_rules(mut settings: Vec<ApiProxyRules>) -> FilterType {
    let mut rules = vec![];
    let settings = settings
        .into_iter()
        .collect::<HashSet<_>>()
        .into_iter()
        .collect::<Vec<_>>();

    for v in settings {
        match v {
            _ => (),
        }
    }

    rules
}

pub fn spawn_api_proxy() -> JoinHandle<()> {
    thread::spawn(|| {
        ApiProxy::new(11452, 11451, vec![]);
    })
}
