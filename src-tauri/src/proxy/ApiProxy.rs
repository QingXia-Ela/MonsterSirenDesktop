use brotlic::{
    decode::{DecodeError, DecodeResult, DecoderInfo},
    BrotliDecoder,
};
use futures::executor::block_on;
use reqwest::{
    header::{HeaderMap, ACCESS_CONTROL_ALLOW_ORIGIN, CONTENT_ENCODING, CONTENT_LENGTH},
    Client,
};
use std::io::{self, Read};
use std::{borrow::BorrowMut, net::SocketAddrV4};
use warp::{path::FullPath, reply::Response, Filter};

const SIREN_WEBSITE: &str = "https://monster-siren.hypergryph.com";
pub struct ApiProxy;

impl ApiProxy {
    /// Create a new api proxy server
    /// # Example
    /// ```
    /// thread::spawn(move || {
    ///   let _ = ApiProxy::new(11452);
    /// })
    /// `
    #[tokio::main]
    pub async fn new(port: u16) -> Self {
        let proxy = warp::path::full()
            .and(warp::header::headers_cloned())
            .and_then(handle_request);
        block_on(async {
            let addr: SocketAddrV4 = format!("127.0.0.1:{}", port).parse().unwrap();
            warp::serve(proxy).run(addr).await;
        });
        ApiProxy {}
    }
}

async fn handle_request(
    path: FullPath,
    _headers: HeaderMap,
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

    res_str = change_body(res_str);
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

fn change_body(body: String) -> String {
    body
        // to cdn proxy
        .replace("web.hycdn.cn", "localhost:11451")
        .replace("https", "http")
}
