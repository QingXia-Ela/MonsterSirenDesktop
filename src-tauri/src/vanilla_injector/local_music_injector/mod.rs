use crate::global_struct::{
    music_injector::{MusicInject, MusicInjector},
    siren::{Album, BriefAlbum, BriefSong, Song},
};
use async_trait::async_trait;

struct LocalMusicInjector {}

impl LocalMusicInjector {
    pub fn new() -> Self {
        Self {}
    }
}

#[async_trait]
impl MusicInject for LocalMusicInjector {
    /// This get albums will return select scan music folders, or nothing, it control by user config.
    async fn get_albums(&self) -> Vec<BriefAlbum> {
        todo!()
    }

    // This get songs will return select scan music files.
    async fn get_songs(&self) -> Vec<BriefSong> {
        todo!()
    }

    async fn get_song(&self, cid: String) -> Result<Song, reqwest::Error> {
        todo!()
    }

    async fn get_album(&self, cid: String) -> Result<Album, reqwest::Error> {
        todo!()
    }
}

pub fn get_injector() -> MusicInjector {
    MusicInjector {
        namespace: "local".to_string(),
        cn_namespace: String::from("本地音乐"),
        color: String::from("gray"),
        request_interceptor: Box::new(LocalMusicInjector::new()),
    }
}
