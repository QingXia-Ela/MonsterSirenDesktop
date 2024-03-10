use monster_siren_desktop::{
    global_struct::{music_injector::*, siren::*},
    plugin_error::PluginRequestError,
};

use async_trait::async_trait;

fn get_sh() -> Song {
    Song {
        cid: "template:114514".to_string(),
        name: "Snow Halation".to_string(),
        album_cid: "template:1919810".to_string(),
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
        cid: "template:114515".to_string(),
        name: "僕らのLIVE 君とのLIFE".to_string(),
        album_cid: "template:1919810".to_string(),
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
struct NCMInjector {}

impl NCMInjector {
    fn new() -> Self {
        Self {}
    }
}

#[async_trait]
impl MusicInject for NCMInjector {
    async fn get_albums(&self) -> Vec<BriefAlbum> {
        vec![BriefAlbum {
            cid: "template:1919810".to_string(),
            name: "Snow Halation".to_string(),
            cover_url: "https://p1.music.126.net/h3X24IkUDnSMCQM60L5n0g==/109951168958569548.jpg"
                .to_string(),
            artistes: vec!["μ's".to_string()],
        }]
    }

    async fn get_songs(&self) -> Vec<BriefSong> {
        vec![get_sh().into(), get_bk().into()]
    }

    async fn get_song(&self, cid: String) -> Result<Song, PluginRequestError> {
        Ok(match cid.as_str() {
            "114514" => get_sh(),
            _ => get_bk(),
        })
    }

    async fn get_album(&self, _cid: String) -> Result<Album, PluginRequestError> {
        Ok(Album {
            cid: "template:1919810".to_string(),
            name: "Snow Halation".to_string(),
            intro: "首张嵌入式专辑测试数据".to_string(),
            belong: "μ's".to_string(),
            cover_url: "https://p2.music.126.net/h3X24IkUDnSMCQM60L5n0g==/109951168958569548.jpg"
                .to_string(),
            cover_de_url:
                "http://localhost:11451/siren/pic/20231204/808e8e61be79018befa887c44731d5aa.jpg"
                    .to_string(),
            artistes: vec![
                "μ's".to_string(),
                "LoveLive School Idol Project!".to_string(),
            ],
            songs: vec![get_sh().into(), get_bk().into()],
        })
    }
}

pub fn get_ncm_injector() -> MusicInjector {
    MusicInjector::new(
        String::from("ncm"),
        String::from("网易云音乐"),
        String::from("red"),
        None,
        Box::new(NCMInjector::new()),
    )
}
