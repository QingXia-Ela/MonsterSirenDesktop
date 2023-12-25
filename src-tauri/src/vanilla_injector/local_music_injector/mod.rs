use crate::global_struct::{
    music_injector::{MusicInject, MusicInjector},
    siren::{Album, BriefAlbum, BriefSong, Song},
};
use async_trait::async_trait;
use futures::lock::Mutex;
use std::{borrow::BorrowMut, collections::HashMap, sync::Arc};

type IndexDataType = Arc<Mutex<HashMap<String, Vec<String>>>>;

/// This manager is use to modify data only.
struct LocalMusicManager {
    /// Index need to sync with Injector
    index: IndexDataType,
}

impl LocalMusicManager {
    pub fn new(index: IndexDataType) -> Self {
        LocalMusicManager { index }
    }

    // update song and folder info
    pub fn update(&mut self) {
        //     test
        self.index
            .try_lock()
            .unwrap()
            .insert(String::from("test"), vec![]);
    }
}

/// Injector for local music.
///
/// Download is not provide and it control by frontend.
///
/// Use music file path as song's id. (Most easy way to generate id :)
struct LocalMusicInjector {
    /// Local music file index
    index: IndexDataType,
}

impl LocalMusicInjector {
    pub fn new(index: Arc<Mutex<HashMap<String, Vec<String>>>>) -> Self {
        Self { index }
    }
}

#[async_trait]
impl MusicInject for LocalMusicInjector {
    // This get albums will return select scan music folders, or nothing, it control by user config.
    async fn get_albums(&self) -> Vec<BriefAlbum> {
        todo!()
    }

    // This get songs will return empty array because we don't know how many song it provide.
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
    let index_data: IndexDataType = Arc::new(Mutex::new(HashMap::new()));
    let local_inject = Box::new(LocalMusicInjector::new(Arc::clone(&index_data)));

    let mut music_inject = MusicInjector::new(
        "local".to_string(),
        String::from("本地音乐"),
        String::from("gray"),
        local_inject,
    );

    music_inject.on_init(move |app| {
        let mut manager = LocalMusicManager::new(Arc::clone(&index_data));
        manager.update();

        // add some event listener
    });

    music_inject
}
