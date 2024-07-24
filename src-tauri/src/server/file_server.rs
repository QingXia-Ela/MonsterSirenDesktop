mod handle_request;
pub mod utils;
use futures::{executor::block_on, lock::Mutex};
use handle_request::handle_request;
use reqwest::StatusCode;
use std::{
    collections::HashMap,
    net::SocketAddrV4,
    sync::Arc,
    thread::{self, JoinHandle},
};
use warp::http::Response;
use warp::{filters::path::FullPath, Filter};

pub struct FileServer {
    pub port: u16,
    path_alias: Arc<Mutex<HashMap<String, String>>>,
}

impl FileServer {
    /// Create a file server which can read all system file.
    ///
    /// **Warning**: The server has highest permission on read file.
    ///
    /// Server is not unstable, and in future it will change to only use alias to prevent file read without limit.
    pub fn new(port: u16, init_alias: Option<HashMap<String, String>>) -> Self {
        Self {
            port,
            path_alias: match init_alias {
                Some(alias) => Arc::new(Mutex::new(alias)),
                None => Arc::new(Mutex::new(HashMap::new())),
            },
        }
    }

    #[tokio::main]
    pub async fn listen(&self) {
        let alias_clone = Arc::clone(&self.path_alias);
        // 用于处理一些只能通过url获取的资源如歌词，塞壬唱片网页中歌词是直接通过url获取，而不是内联在歌曲详细信息
        let echo = warp::get()
            .and(warp::path("echo"))
            .and(warp::query::<HashMap<String, String>>())
            // @see https://github.com/seanmonstar/warp/blob/master/examples/dyn_reply.rs
            .map(|p: HashMap<String, String>| match p.get("value") {
                Some(value) => Response::builder()
                    .header("Content-Type", "application/octet-stream")
                    .header("Access-Control-Allow-Origin", "*")
                    .body(value.replace("[", "\n[")),
                None => Response::builder()
                    .status(StatusCode::NOT_FOUND)
                    .body("".to_string()),
            });
        let file_handle = warp::path::full()
            .and(warp::query::<HashMap<String, String>>())
            .and(warp::header::optional::<String>("range"))
            // .and_then(move |p, q, r| {
            //     let alias_clone = Arc::clone(&alias_clone);
            //     handle_request(p, q, r, alias_clone)
            // });
            .and_then(
                move |p: FullPath, q: HashMap<String, String>, r: Option<String>| {
                    let alias_clone = Arc::clone(&alias_clone);
                    handle_request(p, q, r, alias_clone)
                },
            );
        let routes = warp::get().and(echo.or(file_handle));
        let addr: SocketAddrV4 = format!("127.0.0.1:{}", self.port).parse().unwrap();
        warp::serve(routes).run(addr).await;
    }
    /// Insert alias.
    ///
    /// If you want to insert multi alias once time, use `insert_multi_alias`.
    pub async fn insert_alias(&self, path: String, alias: String) -> Option<String> {
        self.path_alias.lock().await.insert(path, alias)
    }
    pub async fn insert_multi_alias(&self, alias: HashMap<String, String>) {
        self.path_alias.lock().await.extend(alias)
    }
    pub async fn remove_alias(&self, path: &String) -> Option<String> {
        self.path_alias.lock().await.remove(path)
    }
}

pub fn spawn_file_server(port: u16, init_alias: Option<HashMap<String, String>>) -> JoinHandle<()> {
    thread::spawn(move || {
        let server = FileServer::new(port, init_alias);
        server.listen()
    })
}

#[cfg(test)]
mod server_test {
    // note: this test will not end unless you stop it manually.
    use super::*;
    #[tokio::test]
    pub async fn test_insert_alias() {
        let _ = spawn_file_server(11453, None).join();
    }
}
