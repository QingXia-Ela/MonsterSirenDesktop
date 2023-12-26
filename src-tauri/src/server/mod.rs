mod download_server;

use std::{
    collections::HashMap,
    fs,
    io::{Error, Read},
    net::SocketAddrV4,
    thread::{self, JoinHandle},
};

use futures::executor::block_on;
use reqwest::{
    header::{HeaderValue, CONTENT_TYPE},
    StatusCode,
};
use warp::{filters::path::FullPath, Filter};

pub struct FileServer;

impl FileServer {
    /// spawn local file proxy server
    #[tokio::main]
    pub async fn new(port: u16) -> Self {
        let proxy = warp::path::full()
            .and(warp::query::<HashMap<String, String>>())
            .and_then(move |p, q| handle_request(p, q));
        block_on(async {
            let addr: SocketAddrV4 = format!("127.0.0.1:{}", port).parse().unwrap();
            warp::serve(proxy).run(addr).await;
        });
        FileServer {}
    }
}

fn generate_raw_msg(code: u16, msg: &str) -> String {
    format!(r#"{{"code": "{}","msg": "{}"}}"#, code, msg)
}

fn read_file(path: &String) -> Result<Vec<u8>, Error> {
    let mut buf = vec![];
    fs::File::open(path)?.read_to_end(&mut buf)?;
    Ok(buf)
}

async fn handle_request(
    _: FullPath,
    query: HashMap<String, String>,
) -> Result<impl warp::Reply, warp::Rejection> {
    let mut response = warp::reply::Response::new("".into());
    response.headers_mut().insert(
        CONTENT_TYPE,
        HeaderValue::from_str("application/json").unwrap(),
    );

    if let Some(p) = query.get("path") {
        match read_file(p) {
            Ok(v) => {
                *response.body_mut() = v.into();
                let mime = mime_guess::from_path(p).first_or_octet_stream();
                response.headers_mut().insert(
                    CONTENT_TYPE,
                    HeaderValue::from_str(mime.essence_str()).unwrap(),
                );
            }
            Err(res) => {
                *response.status_mut() = StatusCode::INTERNAL_SERVER_ERROR;
                *response.body_mut() =
                    generate_raw_msg(500, format!("{:?}", res).replace("\"", "\\\"").as_str())
                        .into();
            }
        }
    } else {
        *response.status_mut() = StatusCode::NOT_FOUND;
        *response.body_mut() = generate_raw_msg(404, "找不到文件哦").into();
    }

    Ok(response)
}

pub fn spanw_file_server() -> JoinHandle<()> {
    thread::spawn(|| {
        FileServer::new(11453);
    })
}
