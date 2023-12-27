mod download_server;
pub mod file_server;

use std::{
    collections::HashMap,
    fs,
    io::{Error, Read},
    net::SocketAddrV4,
    thread::{self, JoinHandle},
};

use futures::executor::block_on;
use reqwest::{
    header::{
        HeaderValue, ACCESS_CONTROL_ALLOW_ORIGIN, CONTENT_LENGTH, CONTENT_RANGE, CONTENT_TYPE,
    },
    StatusCode,
};
use warp::{filters::path::FullPath, Filter};

use crate::{constants::AUDIO_SUFFIX, Logger};

pub struct FileServer;

impl FileServer {
    /// spawn local file proxy server
    #[tokio::main]
    pub async fn new(port: u16) -> Self {
        let proxy = warp::path::full()
            .and(warp::query::<HashMap<String, String>>())
            .and(warp::header::optional::<String>("range"))
            .and_then(move |p, q, r| handle_request(p, q, r));
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

// todo!: limit file open scope. Add cache.
fn read_file(path: &String) -> Result<Vec<u8>, Error> {
    Logger::debug(format!("request file path: {}", path).as_str());
    let mut buf = vec![];
    fs::File::open(path)?.read_to_end(&mut buf)?;
    Ok(buf)
}

// todo!: optimize this shit
async fn handle_request(
    _: FullPath,
    query: HashMap<String, String>,
    range_value: Option<String>,
) -> Result<impl warp::Reply, warp::Rejection> {
    let mut response = warp::reply::Response::new("".into());
    response.headers_mut().insert(
        CONTENT_TYPE,
        HeaderValue::from_str("application/json").unwrap(),
    );
    response.headers_mut().insert(
        ACCESS_CONTROL_ALLOW_ORIGIN,
        HeaderValue::from_str("*").unwrap(),
    );

    if let Some(p) = query.get("path") {
        match read_file(p) {
            // todo!: support file range send
            Ok(v) => {
                let file_size = v.len() as u64;
                let mime = mime_guess::from_path(p).first_or_octet_stream();
                let suf = format!("{}", mime);
                let suf = suf.split('/').last().unwrap();

                println!("suf: {}", suf);

                for s in AUDIO_SUFFIX.iter() {
                    if s.ends_with(suf) || p.ends_with(s) {
                        if let Some(range_value) = range_value {
                            *response.status_mut() = StatusCode::PARTIAL_CONTENT;
                            let parts: Vec<&str> =
                                range_value["bytes=".len()..].split('-').collect();
                            let start: u64 = parts[0].parse().unwrap();
                            let end: u64 = parts
                                .get(1)
                                .unwrap_or(&(file_size - 1).to_string().as_str())
                                .parse()
                                .unwrap_or(file_size - 1);
                            let content_range = format!("bytes {}-{}/{}", start, end, file_size);

                            let body = v.as_slice()[start as usize..=end as usize].to_vec();
                            // return warp::reply::Response::new;
                            *response.body_mut() = body.clone().into();
                            for (header_name, value) in vec![
                                (ACCESS_CONTROL_ALLOW_ORIGIN, "*"),
                                (CONTENT_TYPE, mime.essence_str()),
                                (CONTENT_RANGE, content_range.as_str()),
                                (CONTENT_LENGTH, body.len().to_string().as_str()),
                            ]
                            .into_iter()
                            {
                                response
                                    .headers_mut()
                                    .insert(header_name, HeaderValue::from_str(value).unwrap());
                            }
                            return Ok(response);
                        }
                    }
                }

                // normal
                *response.body_mut() = v.into();
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
