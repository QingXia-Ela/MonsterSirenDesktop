use brotlic::{
    decode::{DecodeError, DecodeResult},
    BrotliDecoder,
};
use futures::executor::block_on;
use reqwest::{
    header::{
        HeaderMap, ACCESS_CONTROL_ALLOW_ORIGIN, CONTENT_ENCODING, CONTENT_LENGTH, CONTENT_TYPE,
    },
    Client,
};
use std::{borrow::BorrowMut, net::SocketAddrV4, thread};
use std::{collections::HashSet, thread::JoinHandle};
use warp::{path::FullPath, reply::Response, Filter};

use crate::global_struct::{self, music_injector::MusicInject, siren::ToResponseJson};

const SIREN_WEBSITE: &str = "https://monster-siren.hypergryph.com";
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
        let proxy = warp::path::full()
            .and(warp::header::headers_cloned())
            .and_then(move |p, r| handle_request(port, cdn_port, p, r, filter_rules.clone()));
        block_on(async {
            let addr: SocketAddrV4 = format!("127.0.0.1:{}", port).parse().unwrap();
            warp::serve(proxy).run(addr).await;
        });
        ApiProxy {}
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
    // test only
    // if path.as_str() == "/song/self:114514" {
    //     let m = global_struct::music_injector::MusicInjector::new("self".to_string());
    //     let sh = m
    //         .get_song("self:114514".to_string())
    //         .await
    //         .unwrap()
    //         .to_reponse_json();
    //     let mut res = Response::new(
    //         format!(
    //             r#"{{
    //             "code": 0,
    //             "msg": "",
    //             "data": {}
    //         }}"#,
    //             sh
    //         )
    //         .into(),
    //     );
    //     let header = res.headers_mut();
    //     header.insert(CONTENT_TYPE, "application/json".parse().unwrap());
    //     header.insert(ACCESS_CONTROL_ALLOW_ORIGIN, "*".parse().unwrap());
    //     return Ok(res);
    // } else if path.as_str() == "/song/self:114515" {
    //     let mut res = Response::new(
    //         r#"{
    //         "code": 0,
    //         "msg": "",
    //         "data": {
    //             "cid": "self:114515",
    //             "name": "僕らのLIVE 君とのLIFE",
    //             "albumCid": "self:1919810",
    //             "sourceUrl": "http://127.0.0.1:8080/μ's - 僕らのLIVE 君とのLIFE.flac",
    //             "artists": ["μ's", "LoveLive School Idol Project!"],
    //             "lyricUrl": null
    //         }
    //     }"#
    //         .into(),
    //     );
    //     let mut header = res.headers_mut();
    //     header.insert(CONTENT_TYPE, "application/json".parse().unwrap());
    //     header.insert(ACCESS_CONTROL_ALLOW_ORIGIN, "*".parse().unwrap());
    //     return Ok(res);
    // } else if path.as_str() == "/album/self:1919810/detail"
    //     || path.as_str() == "/album/self:1919810/data"
    // {
    //     let m = global_struct::music_injector::MusicInjector::new("self".to_string());
    //     let mut res = Response::new(
    //         format!(
    //             r#"{{
    //         "code": 0,
    //         "msg": "",
    //         "data": {}
    //     }}"#,
    //             m.get_album("self:1919810".to_string())
    //                 .await
    //                 .unwrap()
    //                 .to_reponse_json()
    //         )
    //         .into(),
    //     );
    //     let mut header = res.headers_mut();
    //     header.insert(CONTENT_TYPE, "application/json".parse().unwrap());
    //     header.insert(ACCESS_CONTROL_ALLOW_ORIGIN, "*".parse().unwrap());
    //     return Ok(res);
    // }

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
pub enum api_proxyRules {}

pub fn get_basic_filter_rules(mut settings: Vec<api_proxyRules>) -> FilterType {
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
