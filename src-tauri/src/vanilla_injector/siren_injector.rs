use crate::{
    constants::SIREN_WEBSITE,
    global_struct::{
        music_injector::{MusicInject, MusicInjector},
        siren::{SirenAlbum, SirenBriefAlbum, SirenBriefSong, SirenSong},
    },
    utils::decode_brotli,
};
use async_trait::async_trait;
use reqwest::{
    header::{HeaderMap, CONTENT_ENCODING},
    Client,
};
use warp::reply::Response;
type FilterType = Vec<[&'static str; 2]>;

const ALBUMS_URL: &str = "https://monster-siren.com/api/albums";
const SONGS_URL: &str = "https://monster-siren.com/api/songs";

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

struct SirenInjector {
    client: Client,
}

impl SirenInjector {
    fn new() -> Self {
        Self {
            client: Client::new(),
        }
    }

    fn add_default_header(request_builder: reqwest::RequestBuilder) -> reqwest::RequestBuilder {
        request_builder.header("referer", SIREN_WEBSITE)
    }

    fn get_request_builder(
        &self,
        url: &String,
        add_default_header: bool,
    ) -> reqwest::RequestBuilder {
        let mut r = self.client.get(url);
        if add_default_header {
            r = SirenInjector::add_default_header(r);
        }
        r
    }

    async fn request_and_get_response(&self, url: &String) -> Result<String, ()> {
        let mut request_builder = self.client.get(url);
        request_builder = request_builder.header("referer", SIREN_WEBSITE);

        let response_json = request_builder.send().await.unwrap();
        let response = Response::new("".into());

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
        // todo!: sync cdn / api port with custom config
        res_str = change_body(res_str, vec![], 11452, 11451);

        Ok(res_str)
    }
}

#[async_trait]
impl MusicInject for SirenInjector {
    async fn get_albums(&self) -> Vec<SirenBriefAlbum> {
        vec![]
    }

    async fn get_songs(&self) -> Vec<SirenBriefSong> {
        vec![]
    }

    async fn get_song(&self, cid: String) -> Result<SirenSong, ()> {
        Err(())
    }

    async fn get_album(&self, cid: String) -> Result<SirenAlbum, ()> {
        Err(())
    }
}

pub fn get_injector() -> MusicInjector {
    MusicInjector::new("".to_string(), Box::new(SirenInjector::new()))
}
