use std::collections::HashMap;
use crate::global_struct::{
    music_injector::{MusicInject, MusicInjector},
    siren::{Album, BriefAlbum, BriefSong, Song},
};
use async_trait::async_trait;

/// Injector for local music.
///
/// Download is not provide and it control by frontend.
///
/// Use music file path as song's id. (Most easy way to generate id :)
struct LocalMusicInjector {
    /// Local music file index
    index: HashMap<String, Vec<String>>
}

impl LocalMusicInjector {
    pub fn new() -> Self {
        Self {
            index: HashMap::new()
        }
    }

    // update song and folder info
    pub fn update(&mut self) {}
}

#[async_trait]
impl MusicInject for LocalMusicInjector {
    // This get albums will return select scan music folders, or nothing, it control by user config.
    async fn get_albums(&self) -> Vec<BriefAlbum> {
        todo!()
    }

    // This get songs will return empty array
    async fn get_songs(&self) -> Vec<BriefSong> {
        vec![]
    }

    async fn get_song(&self, cid: String) -> Result<Song, reqwest::Error> {
        todo!()
    }

    async fn get_album(&self, cid: String) -> Result<Album, reqwest::Error> {
        todo!()
    }
}

pub fn get_injector() -> MusicInjector {
    let mut local_inject = Box::new(LocalMusicInjector::new());
    local_inject.update();

    let music_inject = MusicInjector::new(
            "local".to_string(),
             String::from("本地音乐"),
             String::from("gray"),
             Box::new(local_inject)
    );

    music_inject
}
