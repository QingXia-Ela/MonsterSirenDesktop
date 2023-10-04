use std::net::SocketAddr;

use reqwest::{header::HeaderMap, Client};
use warp::{path::FullPath, Filter};

pub struct Proxy {
    addr: SocketAddr,
    pub client: Client,
}

// static GLOBAL_CLIENT: reqwest::Client = Client::new();

impl Proxy {
    pub fn new(addr: SocketAddr) -> Self {
        Self {
            addr,
            client: Client::new(),
        }
    }

    pub fn get_client(&self) -> &Client {
        &self.client
    }

    #[tokio::main]
    pub async fn start(&self) {
        println!("Starting proxy at {}", self.addr);
        let client = Client::new();

        let proxy = warp::path::full()
            .and(warp::header::headers_cloned())
            .and_then(handle_request);
        // .map(
        //     |path: FullPath, headers: HeaderMap| {
        //         let client = Client::new();
        //         let target_url = format!("https://monster-siren.hypergryph.com{}", path.as_str());

        //         println!("Requesting {}", target_url);

        //         let mut request_builder = client.get(&target_url).header("Referer", "noreferrer");

        //         for (name, value) in headers.iter() {
        //             request_builder = request_builder.header(name.clone(), value.clone());
        //         }

        //         let response = block_on(async {
        //             // let response = request_builder.send().await;
        //             // response.text().await.unwrap()
        //             match request_builder.send().await {
        //                 Ok(response) => response.bytes().await.unwrap().to_vec(),
        //                 Err(e) => panic!("{}", e),
        //             }
        //         });

        //         // println!("{}", response);
        //         // response
        //         // warp::reply::with_header(response, "Content-Type", "text/html")
        //         target_url
        //     },
        // );

        warp::serve(proxy).run(self.addr).await;
    }
}

async fn handle_request(
    path: FullPath,
    headers: HeaderMap,
) -> Result<impl warp::Reply, warp::Rejection> {
    let client = Client::new();
    // let target_url = format!("https://monster-siren.hypergryph.com{}", path.as_str());
    let target_url = "https://monster-siren.hypergryph.com".to_string();
    let mut request_builder = client.get(&target_url);

    // println!(
    //     "{}",
    //     reqwest::get(&target_url)
    //         .await
    //         .unwrap()
    //         .text()
    //         .await
    //         .unwrap()
    // );

    // println!("Requesting {}", target_url);

    // for (name, value) in headers.iter() {
    //     request_builder = request_builder.header(name.clone(), value.clone());
    // }

    // let response = request_builder.send().await;
    // println!("Successfully requested {}", target_url);

    let response = reqwest::get(&target_url)
        .await
        .unwrap()
        .text()
        .await
        .unwrap();

    Ok(warp::reply::with_header(
        response,
        "Content-Type",
        "text/html",
    ))
}
