
use crate::{
    constants::SIREN_WEBSITE,
    global_event::frontend_notify::notify_error,
    global_struct::{
        music_injector::{MusicInject, MusicInjector},
        siren::{
            response_msg::ResponseMsg, Album, BriefAlbum, BriefSong, SirenAlbumDetail,
            SirenBriefAlbum, Song,
        },
    },
    global_utils::decode_brotli,
    plugin_error::PluginRequestError,
};
use async_trait::async_trait;
use reqwest::{
    header::{HeaderMap, *},
    Client,
};
use serde::{Deserialize, Serialize};
use warp::{reply::Response};
type FilterType = Vec<[&'static str; 2]>;

const ALBUMS_URL: &str = "https://monster-siren.hypergryph.com/api/albums";
const SONGS_URL: &str = "https://monster-siren.hypergryph.com/api/songs";

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

#[derive(Serialize, Deserialize)]
struct SongsReponse<T> {
    list: Vec<T>,
    /// 自动播放的目标，如果为空则选取播放列表第一首歌
    autoplay: Option<String>,
}

struct SirenInjector {
    client: Client,
    app: tauri::AppHandle,
}

impl SirenInjector {
    fn new(app: tauri::AppHandle) -> Self {
        Self {
            app,
            client: Client::new(),
        }
    }

    fn add_default_request_header(
        request_builder: reqwest::RequestBuilder,
    ) -> reqwest::RequestBuilder {
        request_builder.header("referer", SIREN_WEBSITE)
    }

    fn add_default_response_header(response: Response) -> Response {
        todo!();
    }

    fn get_request_builder(
        &self,
        url: &String,
        add_default_header: bool,
    ) -> reqwest::RequestBuilder {
        let mut r = self.client.get(url);
        if add_default_header {
            r = SirenInjector::add_default_request_header(r);
        }
        r
    }

    fn get_response(body: String) -> Response {
        todo!();
    }

    async fn request_and_get_response(&self, url: &String) -> Result<String, reqwest::Error> {
        let request_builder = self.get_request_builder(url, true);

        let response_json = request_builder.send().await?;
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
                        decode_brotli(&response_json.bytes().await?.to_vec().as_slice()).unwrap();
                    res_str = String::from_utf8(decoded).unwrap();
                }
                _ => res_str = response_json.text().await?,
            },
            _ => res_str = response_json.text().await?,
        };
        // todo!: sync cdn / api port with custom config
        res_str = change_body(res_str, vec![], 11452, 11451);

        Ok(res_str)
    }
}

#[async_trait]
impl MusicInject for SirenInjector {
    /// Get albums, if it has error, it will return empty arr
    // todo!: throw err instead return empty arr
    async fn get_albums(&self) -> Vec<BriefAlbum> {
        let res = self.request_and_get_response(&ALBUMS_URL.to_string()).await;
        if let Ok(res) = res {
            // let albums_json = res.body();
            // let res = hyper::body::to_bytes(*albums_json);
            let res: ResponseMsg<Vec<SirenBriefAlbum>> =
                serde_json::from_str(&res.as_str()).unwrap();
            return res.data.into_iter().map(|a| a.into()).collect();
        }
        vec![]
    }

    async fn get_songs(&self) -> Vec<BriefSong> {
        let res = self.request_and_get_response(&SONGS_URL.to_string()).await;
        if let Ok(res) = res {
            let res: Result<ResponseMsg<SongsReponse<BriefSong>>, serde_json::Error> =
                serde_json::from_str(&res.as_str());

            match res {
                Ok(res) => return res.data.list,
                Err(err) => {
                    notify_error(&self.app, format!("获取歌曲列表失败，错误信息：{:?}", err));
                    return vec![];
                }
            }
        }
        vec![]
    }

    async fn get_song(&self, cid: String) -> Result<Song, PluginRequestError> {
        let res = self
            .request_and_get_response(&format!("{}/api/song/{}", SIREN_WEBSITE, cid))
            .await?;

        let mut res: ResponseMsg<Song> = serde_json::from_str(&res.as_str()).unwrap();
        res.data.cid = String::from("siren:all");
        res.data.album_cid = String::from("siren:all");
        Ok(res.data)
    }

    async fn get_album(&self, cid: String) -> Result<Album, PluginRequestError> {
        if cid == "all" {
            return Ok(Album {
                artistes: vec!["塞壬唱片-MSR".to_string()],
                cid: String::from("siren:all"),
                cn_namespace: String::from("塞壬唱片音乐集"),
                name: String::from("塞壬唱片音乐集"),
                intro: String::from("该播放列表包含所有的塞壬唱片音乐"),
                belong: String::from("siren"),
                cover_url: String::from("/siren.png"),
                cover_de_url: String::from("/siren.png"),
                songs: self
                    .get_songs()
                    .await
                    .into_iter()
                    .map(|mut s| {
                        // todo!: add cid prefix `siren:` to lead frontend request to this injector, so that can modify response and redirect to `siren:all` playlist
                        s.album_cid = String::from("siren:all");
                        s.cid = format!("siren:{}", s.cid);
                        s
                    })
                    .collect(),
            });
        }

        let res = self
            .request_and_get_response(&format!("{}/api/album/{}/detail", SIREN_WEBSITE, cid))
            .await?;
        let res: ResponseMsg<SirenAlbumDetail> = serde_json::from_str(&res.as_str()).unwrap();
        let res = res.data;
        Ok(Album {
            artistes: vec!["塞壬唱片-MSR".to_string()],
            cid: res.cid,
            cn_namespace: String::from("塞壬唱片音乐集"),
            name: res.name,
            intro: res.intro,
            belong: res.belong,
            cover_url: res.cover_url,
            cover_de_url: res.cover_de_url,
            songs: res.songs.into_iter().map(|s| s.into()).collect(),
        })
    }
}

pub fn get_injector(app: tauri::AppHandle) -> MusicInjector {
    let injector_app = app.clone();
    MusicInjector::new(
        app,
        "siren".to_string(),
        String::from("塞壬唱片"),
        String::from("#eee"),
        None,
        Box::new(SirenInjector::new(injector_app)),
    )
}
