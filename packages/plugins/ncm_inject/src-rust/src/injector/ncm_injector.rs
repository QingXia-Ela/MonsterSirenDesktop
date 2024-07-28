use monster_siren_desktop::{
    global_struct::{music_injector::*, siren::*},
    plugin_error::PluginRequestError,
};

use async_trait::async_trait;

use super::request_handler::NcmRequestHandler;

#[repr(C)]
struct NCMInjector {
    request_handler: NcmRequestHandler,
}

impl NCMInjector {
    fn new() -> Self {
        Self {
            request_handler: NcmRequestHandler::new(),
        }
    }
}

#[async_trait]
impl MusicInject for NCMInjector {
    async fn get_albums(&self) -> Vec<BriefAlbum> {
        // 请求 user/playlist 获取用户歌单
        self.request_handler.get_all_songlist()
    }

    async fn get_songs(&self) -> Vec<BriefSong> {
        // 返回空数组
        vec![]
    }

    async fn get_song(&self, cid: String) -> Result<Song, PluginRequestError> {
        // 请求 song/url?id=cid 获取歌曲音频 url
        // 请求 song/detail?ids=cid 获取歌曲详情
        match cid.split_once("-") {
            Some((album_cid, cid)) => self
                .request_handler
                .get_song(album_cid.to_string(), cid.to_string()),
            None => Err(PluginRequestError::new("获取歌曲详情失败".to_string())),
        }
    }

    async fn get_album(&self, cid: String) -> Result<Album, PluginRequestError> {
        // 请求 playlist/detail?id=cid 获取歌单详情
        match self.request_handler.get_songlist_by_id(cid) {
            Some(res) => Ok(res),
            None => Err(PluginRequestError::new("获取歌单详情失败".to_string())),
        }
    }
}

pub fn get_ncm_injector(app: tauri::AppHandle) -> MusicInjector {
    MusicInjector::new(
        app,
        String::from("ncm"),
        String::from("网易云音乐"),
        String::from("#c20c0c"),
        None,
        Box::new(NCMInjector::new()),
    )
}
