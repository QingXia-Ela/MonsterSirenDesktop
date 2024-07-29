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
    // todo!: finish this
    if let Ok(res) = reqwest::get(format!("{REQUEST_BASE}/lyric?id={cid}").as_str()).await {
        if let Ok(res) = res.json::<NeteaseLyricResponse>().await {
            // todo!: add multi lrc support
            return Some(format!(
                "http://localhost:11453/echo?value={}",
                res.lrc.lyric
            ));
        }
    }
    None
}

async fn get_netease_audio_info(
    cid: &String,
) -> Result<NeteaseSongDownloadInfo, PluginRequestError> {
    match reqwest::get(format!("{REQUEST_BASE}/song/download/url?id={cid}").as_str()).await {
        Ok(res) => match res.json::<NeteaseSongDownloadReponse>().await {
            Ok(res) => {
                if let None = &res.data.url {
                    return Err(PluginRequestError::new(format!(
                        "Get audio url fail with code: {}",
                        &res.data.code
                    )));
                }
                Ok(res.data)
            }
            Err(_e) => Err(PluginRequestError::new(
                "get_netease_audio_url_json_parse".to_string(),
            )),
        },
        Err(e) => Err(PluginRequestError::new("get_netease_audio_url".to_string())),
    }
}

impl NcmRequestHandler {
    pub fn new() -> Self {
        Self {
            client: Client::new(),
        }
    }

    #[tokio::main]
    pub async fn ping(&self) {}

    /// Only allow get single song.
    #[tokio::main]
    pub async fn get_song(
        &self,
        album_cid: String,
        cid: String,
    ) -> Result<Song, PluginRequestError> {
        if let Ok(res) = self
            .client
            .get(format!("{REQUEST_BASE}/song/detail?ids={cid}"))
            .send()
            .await
        {
            return match res.json::<NeteaseSongsDetailResponse>().await {
                Ok(res) => match get_netease_audio_info(&cid).await {
                    Ok(info) => Ok(info.into_siren_song(
                        res.songs[0].clone(),
                        album_cid,
                        get_netease_audio_lyric(&cid).await,
                    )),
                    Err(e) => Err(e),
                },
                Err(e) => Err(PluginRequestError::new("get_song".to_string())),
            };
        }

        Err(PluginRequestError::new(format!(
            "Error to request song detail."
        )))
    }

    #[tokio::main]
    pub async fn get_songlist_by_id(&self, cid: String) -> Option<Album> {
        if let Ok(res) = self
            .client
            .get(format!("{REQUEST_BASE}/playlist/detail?id={cid}"))
            .send()
            .await
        {
            return match res.json::<NeteasePlaylistDetailResponse>().await {
                Ok(res) => Some(res.into()),
                Err(_) => None,
            };
        }
        None
    }

    #[tokio::main]
    pub async fn get_all_songlist(&self) -> Vec<BriefAlbum> {
        if let Ok(res) = self
            .client
            .get(format!("{REQUEST_BASE}/user/playlist"))
            .send()
            .await
        {
            if let Ok(res) = res.json::<NeteaseUserPlaylistResponse>().await {
                return res
                    .playlist
                    .into_iter()
                    .map(|x| Into::<BriefAlbum>::into(x))
                    .collect();
            }
        }
        vec![]
    }
}
