// todo!: 支持外部自定义端口
const REQUEST_BASE: &str = "http://localhost:53753";
use monster_siren_desktop::{
    global_struct::siren::{Album, BriefAlbum, Song},
    plugin_error::PluginRequestError,
};
use reqwest::Client;

use super::global_struct::{
    NeteaseLyricResponse, NeteasePlaylistDetailResponse, NeteaseSongDownloadInfo,
    NeteaseSongDownloadReponse, NeteaseSongsDetailResponse, NeteaseUserPlaylistResponse,
};
// use

pub struct NcmRequestHandler {
    pub client: Client,
}

async fn get_netease_audio_lyric(cid: &String) -> Option<String> {
    if let Ok(res) = reqwest::get(format!("{REQUEST_BASE}/lyric?id={cid}").as_str()).await {
        if let Ok(res) = res.json::<NeteaseLyricResponse>().await {
            // todo!: add multi lrc support
            return Some(res.lrc.lyric);
        }
    }
    None
}

async fn get_netease_audio_info(
    cid: &String,
) -> Result<NeteaseSongDownloadInfo, PluginRequestError> {
    let return_err = PluginRequestError::new("get_netease_audio_url".to_string());
    match reqwest::get(format!("{REQUEST_BASE}/song/download/url?id={cid}").as_str()).await {
        Ok(res) => match res.json::<NeteaseSongDownloadReponse>().await {
            Ok(res) => Ok(res.data),
            Err(e) => Err(return_err),
        },
        Err(e) => Err(return_err),
    }
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

    /// Only allow get single song.
    pub async fn get_song(&self, cid: String) -> Result<Song, PluginRequestError> {
        let res = self
            .client
            .get(format!("{REQUEST_BASE}/song/detail?ids={cid}"))
            .send()
            .await
            .unwrap();

        match res.json::<NeteaseSongsDetailResponse>().await {
            Ok(res) => match get_netease_audio_info(&cid).await {
                Ok(info) => Ok(info.into_siren_song(
                    res.songs[0].clone(),
                    cid.clone(),
                    get_netease_audio_lyric(&cid).await,
                )),
                Err(e) => Err(e),
            },
            Err(e) => Err(PluginRequestError::new("get_song".to_string())),
        }
    }

    pub async fn get_songlist_by_id(&self, cid: String) -> Option<Album> {
        let res = self
            .client
            .get(format!("{REQUEST_BASE}/playlist/detail?ids={cid}"))
            .send()
            .await
            .unwrap();

        match res.json::<NeteasePlaylistDetailResponse>().await {
            Ok(res) => Some(res.into()),
            Err(_) => None,
        }
    }

    pub async fn get_all_songlist(&self) -> Vec<BriefAlbum> {
        let res = self
            .client
            .get(format!("{REQUEST_BASE}/user/playlist"))
            .send()
            .await
            .unwrap();
        match res.json::<NeteaseUserPlaylistResponse>().await {
            Ok(res) => res.playlist.into_iter().map(|x| x.into()).collect(),
            Err(_) => vec![],
        }
    }
}
