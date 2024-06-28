// todo!: 支持外部自定义端口
const REQUEST_BASE: &str = "https://localhost:53753";
use reqwest::Client;
// use

pub struct NcmRequestHandler {
    pub client: Client,
}

impl NcmRequestHandler {
    pub fn new() -> Self {
        Self {
            client: Client::new(),
        }
    }

    pub async fn ping(&self) {
        let res = self
            .client
            .get(format!("{REQUEST_BASE}/pong"))
            .send()
            .await
            .unwrap();

        // if res.status()
    }

    pub async fn get_song(&self, cid: String) {
        let res = self
            .client
            .get(format!("{REQUEST_BASE}/song/detail?ids={cid}"))
            .send()
            .await
            .unwrap();
    }

    pub async fn get_songlist_by_id(&self, cid: String) {
        let res = self
            .client
            .get(format!("{REQUEST_BASE}/playlist/detail?ids={cid}"))
            .send()
            .await
            .unwrap();
    }

    pub async fn get_all_songlist(&self) {
        let res = self
            .client
            .get(format!("{REQUEST_BASE}/user/playlist"))
            .send()
            .await
            .unwrap();
    }
}
