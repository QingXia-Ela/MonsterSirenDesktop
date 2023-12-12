use super::siren::{SirenAlbum, SirenBriefAlbum, SirenBriefSong, SirenSong};
use async_trait::async_trait;

fn get_sh() -> SirenSong {
    SirenSong {
        cid: "self:114514".to_string(),
        name: "Snow Halation".to_string(),
        album_cid: "self:1919810".to_string(),
        source_url: "http://127.0.0.1:8080/μ's - Snow Halation.flac".to_string(),
        artists: vec![
            "μ's".to_string(),
            "LoveLive School Idol Project!".to_string(),
        ],
        lyric_url: None,
        mv_url: None,
        mv_cover_url: None,
    }
}

fn get_bk() -> SirenSong {
    SirenSong {
        cid: "self:114515".to_string(),
        name: "僕らのLIVE 君とのLIFE".to_string(),
        album_cid: "self:1919810".to_string(),
        source_url: "http://127.0.0.1:8080/μ's - 僕らのLIVE 君とのLIFE.flac".to_string(),
        artists: vec![
            "μ's".to_string(),
            "LoveLive School Idol Project!".to_string(),
        ],
        lyric_url: None,
        mv_url: None,
        mv_cover_url: None,
    }
}

/// Music Inject trait
/// Use it to create a music injector
/// impl this trait should add `#[async_trait]` annotation
#[async_trait]
pub trait MusicInject {
    async fn get_albums(&self) -> Vec<SirenBriefAlbum>;
    async fn get_songs(&self) -> Vec<SirenBriefSong>;
    async fn get_song(&self, id: String) -> Result<SirenSong, ()>;
    async fn get_album(&self, id: String) -> Result<SirenAlbum, ()>;
}

pub struct MusicInjector {
    pub namespace: String,
}

impl MusicInjector {
    pub fn new(namespace: String) -> Self {
        Self { namespace }
    }
    #[allow(dead_code)]
    pub fn get_namespace(&self) -> &String {
        &self.namespace
    }
}

#[async_trait]
impl MusicInject for MusicInjector {
    async fn get_albums(&self) -> Vec<SirenBriefAlbum> {
        vec![]
    }

    async fn get_songs(&self) -> Vec<SirenBriefSong> {
        vec![]
    }

    async fn get_song(&self, cid: String) -> Result<SirenSong, ()> {
        Ok(match cid.as_str() {
            "self:114514" => get_sh(),
            _ => get_bk(),
        })
    }

    async fn get_album(&self, cid: String) -> Result<SirenAlbum, ()> {
        Ok(SirenAlbum {
            cid: "self:1919810".to_string(),
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
