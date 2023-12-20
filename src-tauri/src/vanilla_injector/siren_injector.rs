use crate::global_struct::{
    music_injector::{MusicInject, MusicInjector},
    siren::{SirenAlbum, SirenBriefAlbum, SirenBriefSong, SirenSong},
};
use async_trait::async_trait;

struct SirenInjector;

impl SirenInjector {
    fn new() -> Self {
        Self {}
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
