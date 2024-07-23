use monster_siren_desktop::{
    global_struct::{music_injector::*, siren::*},
    plugin_error::PluginRequestError,
};

use async_trait::async_trait;

use super::{request_handler::NcmRequestHandler, OkUidReponseBody, UidResponseWrapper};

fn get_sh() -> Song {
    Song {
        cid: "ncm:114514".to_string(),
        name: "Snow Halation".to_string(),
        album_cid: "ncm:1919810".to_string(),
        source_url: "http://127.0.0.1:11453?path=E:\\Animenzzz\\μ's - Snow Halation.flac"
            .to_string(),
        artists: vec![
            "μ's".to_string(),
            "LoveLive School Idol Project!".to_string(),
        ],
        lyric_url: Some(
            "http://127.0.0.1:11453?path=E:\\Animenzzz\\μ's - Snow Halation.lrc".to_string(),
        ),
        mv_url: None,
        mv_cover_url: None,
        create_time: None,
        song_cover_url: None,
        size: None,
    }
}

fn get_bk() -> Song {
    Song {
        cid: "ncm:114515".to_string(),
        name: "僕らのLIVE 君とのLIFE".to_string(),
        album_cid: "ncm:1919810".to_string(),
        source_url: "http://127.0.0.1:11453?path=E:\\Animenzzz\\μ's - 僕らのLIVE 君とのLIFE.flac"
            .to_string(),
        artists: vec![
            "μ's".to_string(),
            "LoveLive School Idol Project!".to_string(),
        ],
        lyric_url: None,
        mv_url: None,
        mv_cover_url: None,
        create_time: None,
        song_cover_url: None,
        size: None,
    }
}

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
        // vec![BriefAlbum {
        //     cid: "ncm:1919810".to_string(),
        //     cn_namespace: "网易云音乐".to_string(),
        //     name: "Snow Halation".to_string(),
        //     cover_url: "https://p1.music.126.net/h3X24IkUDnSMCQM60L5n0g==/109951168958569548.jpg"
        //         .to_string(),
        //     artistes: vec!["μ's".to_string()],
        // }];
        // 请求 user/playlist 获取用户歌单
        self.request_handler.get_all_songlist()
    }

    async fn get_songs(&self) -> Vec<BriefSong> {
        // vec![get_sh().into(), get_bk().into()]
        // 返回空数组
        vec![]
    }

    async fn get_song(&self, cid: String) -> Result<Song, PluginRequestError> {
        // 请求 song/url?id=cid 获取歌曲音频 url
        // 请求 song/detail?ids=cid 获取歌曲详情
        self.request_handler.get_song(cid)
    }

    async fn get_album(&self, cid: String) -> Result<Album, PluginRequestError> {
        // Ok(Album {
        //     cid: "ncm:1919810".to_string(),
        //     cn_namespace: "网易云音乐".to_string(),
        //     name: "Snow Halation".to_string(),
        //     intro: "首张嵌入式专辑测试数据".to_string(),
        //     belong: "μ's".to_string(),
        //     cover_url: "https://p2.music.126.net/h3X24IkUDnSMCQM60L5n0g==/109951168958569548.jpg"
        //         .to_string(),
        //     cover_de_url:
        //         "http://localhost:11451/siren/pic/20231204/808e8e61be79018befa887c44731d5aa.jpg"
        //             .to_string(),
        //     artistes: vec![
        //         "μ's".to_string(),
        //         "LoveLive School Idol Project!".to_string(),
        //     ],
        //     songs: vec![get_sh().into(), get_bk().into()],
        // })
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
        String::from("red"),
        None,
        Box::new(NCMInjector::new()),
    )
}
