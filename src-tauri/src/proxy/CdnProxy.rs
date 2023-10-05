use std::net::SocketAddrV4;

use futures::executor::block_on;
use reqwest::{
    header::{HeaderMap, HeaderValue, ACCESS_CONTROL_ALLOW_ORIGIN, CONTENT_LENGTH, HOST},
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
    ///   let _ = CdnProxy::new(19198);
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
    headers: HeaderMap,
    port: u16,
) -> Result<impl warp::Reply, warp::Rejection> {
    let client = Client::new();
    let target_url = format!("https://web.hycdn.cn{}", path.as_str());
    let mut request_builder = client.get(&target_url);

    request_builder = request_builder.header("referer", SIREN_WEBSITE);
    // .header("host", SIREN_WEBSITE);

    let response_file = request_builder.send().await.unwrap();
    let mut response = warp::reply::Response::new("".into());

    let mut content_length: u64 = 0;

    // basic js css change
    if target_url.contains(".js") || target_url.contains(".css") {
        let res_str = change_body(response_file.text().await.unwrap(), port);
        content_length = res_str.len() as u64;
        response = warp::reply::Response::new(res_str.into());
    } else {
        content_length = response_file.content_length().unwrap();
        response = warp::reply::Response::new(response_file.bytes().await.unwrap().into());
    }

    let res_header_map = response.headers_mut();
    res_header_map.insert(ACCESS_CONTROL_ALLOW_ORIGIN, "*".parse().unwrap());
    res_header_map.insert(
        CONTENT_LENGTH,
        format!("{}", content_length).parse().unwrap(),
    );

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
        .replace("this.store=e,", "this.store=e,window.siren_store=e,")
}
