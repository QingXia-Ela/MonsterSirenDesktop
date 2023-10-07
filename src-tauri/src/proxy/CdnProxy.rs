use std::{borrow::BorrowMut, net::SocketAddrV4};

use futures::executor::block_on;
use reqwest::{
    header::{HeaderMap, ACCESS_CONTROL_ALLOW_ORIGIN, CONTENT_LENGTH},
    Client,
};
use warp::{path::FullPath, Filter};

const SIREN_WEBSITE: &str = "https://monster-siren.hypergryph.com";

pub struct CdnProxy;

impl CdnProxy {
    /// Create a new cdn proxy server
    /// # Example
    /// ```
    /// thread::spawn(move || {
    ///   let _ = CdnProxy::new(11451);
    /// })
    /// ```
    #[tokio::main]
    pub async fn new(port: u16) -> Self {
        let proxy = warp::path::full()
            .and(warp::header::headers_cloned())
            .and_then(move |p, h| handle_request(p, h, port));
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
) -> Result<impl warp::Reply, warp::Rejection> {
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

    // basic js css change
    if target_url.contains(".js") || target_url.contains(".css") {
        let res_str = change_body(response_file.text().await.unwrap(), port);
        response = warp::reply::Response::new(res_str.into());
    } else {
        response = warp::reply::Response::new(response_file.bytes().await.unwrap().into());
    }

    let res_header_map = response.headers_mut();
    // for (k, v) in header_map.borrow_mut().into_iter() {
    //     res_header_map.insert(k.clone(), v.clone());
    // }
    res_header_map.insert(ACCESS_CONTROL_ALLOW_ORIGIN, "*".parse().unwrap());

    Ok(response)
}

fn change_body(body: String, port: u16) -> String {
    body
        // replace cdn
        .replace("web.hycdn.cn", format!("localhost:{}", port).as_str())
        .replace("https", "http")
        // change site all store request api
        .replace("/api/", "http://localhost:11452/")
        // expose store to window
        // log store change
        .replace(
            "return function(n){if",
            "return function(n){console.log(n);if",
        )
        // prevent autoplay
        .replace("var o=[\"mousedown\",\"touchstart\"]", "var o=[]")
        .replace("document.addEventListener(\"mousedown\",e),", "")
        .replace("this.store=e,", "this.store=e,window.siren_store=e,")
}
