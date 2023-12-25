use crate::global_struct::{
    music_injector::{MusicInject, MusicInjector},
    siren::{Album, BriefAlbum, BriefSong, Song},
};
use crate::global_utils::get_main_window;
use async_trait::async_trait;
use futures::lock::Mutex;
use indexmap::IndexMap;
use inject_event::InjectEvent::*;
use std::{fs, sync::Arc};
use tokio::fs as tokio_fs;

mod inject_event;

type IndexDataType = Arc<Mutex<IndexMap<String, Vec<String>>>>;

#[derive(Debug, Clone, serde::Serialize, serde::Deserialize)]
struct SingleFolderDataType {
    path: String,
    songs: Vec<String>,
}

/// This manager is use to modify data only.
struct LocalMusicManager {
    /// Index need to sync with Injector
    index: IndexDataType,
    folder_record_path: String,
}

impl LocalMusicManager {
    pub fn new(index: IndexDataType, path: String) -> Self {
        // init index
        let final_content = match fs::read_to_string(&path) {
            Ok(content) => content,
            Err(_) => {
                fs::write(&path, "[]").unwrap();
                String::from("[]")
            }
        };
        let i: Vec<SingleFolderDataType> = serde_json::from_str(final_content.as_str()).unwrap();

        for folder in i {
            index.try_lock().unwrap().insert(folder.path, folder.songs);
        }

        LocalMusicManager {
            index,
            folder_record_path: path,
        }
    }

    // update song and folder info to config file.
    // todo!: control it can return error
    pub async fn update(&mut self) {
        tokio_fs::write(
            &self.folder_record_path,
            serde_json::to_string(&self.get_index_vec()).unwrap(),
        )
        .await
        .unwrap();
        //     test
    }

    pub fn get_index_vec(&self) -> Vec<SingleFolderDataType> {
        self.index
            .try_lock()
            .unwrap()
            .iter()
            .map(|(k, v)| SingleFolderDataType {
                path: k.to_string(),
                songs: v.to_vec(),
            })
            .collect()
    }

    pub async fn add_folder(&mut self, mut folder: String) {
        // prevent folder path without `/` lead the each file path is wrong
        if !folder.ends_with("/") {
            folder.push_str("/");
        }
        match tokio_fs::read_dir(&folder).await {
            Ok(mut dir) => {
                let mut v = vec![];
                while let Ok(Some(entry)) = dir.next_entry().await {
                    let path = entry.path();
                    if path.is_file() {
                        v.push(
                            path.to_str()
                                .unwrap()
                                .split('/')
                                .last()
                                .unwrap()
                                .to_string(),
                        );
                    }
                }
                self.index.lock().await.insert(folder, v);
            }
            Err(_) => return,
        }
        self.update().await
    }

    pub async fn remove_folder(&mut self, mut folder: String) {
        // prevent folder path without `/` lead the each file path is wrong
        if !folder.ends_with("/") {
            folder.push_str("/");
        }
        self.index.lock().await.remove(&folder);
        self.update().await
    }

    pub async fn swap(&mut self, i1: usize, i2: usize) {
        self.index.lock().await.swap_indices(i1, i2);
        self.update().await
    }
}

#[cfg(test)]
mod manager_test {
    use super::*;
    async fn init_file() {
        tokio_fs::write("./tests/injector/local/add_folder/config.json", "[]")
            .await
            .unwrap();
    }

    #[tokio::test]
    async fn add_folder_test() {
        init_file().await;
        let mut m = LocalMusicManager::new(
            Arc::new(Mutex::new(IndexMap::new())),
            String::from("./tests/injector/local/add_folder/config_add.json"),
        );
        m.add_folder(String::from("./tests/injector/local/add_folder/"))
            .await;
        assert_eq!(m.index.lock().await.len(), 1);
    }

    #[tokio::test]
    async fn remove_folder_test() {
        init_file().await;
        let mut m = LocalMusicManager::new(
            Arc::new(Mutex::new(IndexMap::new())),
            String::from("./tests/injector/local/add_folder/config_remove.json"),
        );

        m.add_folder(String::from("./tests/injector/local/add_folder/"))
            .await;
        m.remove_folder(String::from("./tests/injector/local/add_folder/"))
            .await;

        assert_eq!(m.index.lock().await.len(), 0);
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
    pub fn new(index: IndexDataType) -> Self {
        Self { index }
    }
}

#[async_trait]
impl MusicInject for LocalMusicInjector {
    // This get albums will return select scan music folders, or nothing, it control by user config.
    async fn get_albums(&self) -> Vec<BriefAlbum> {
        // self.index.lock().await
        todo!()
    }

    // This get songs will return empty array because we don't know how many song it provide.
    // Or the songs is too many.
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

fn emit_reload(app: tauri::AppHandle) {
    let _ = get_main_window(&app).emit(
        serde_json::to_string(&Reload).unwrap().trim_matches('"'),
        (),
    );
    // .unwrap();
}

pub fn get_injector() -> MusicInjector {
    let index_data: IndexDataType = Arc::new(Mutex::new(IndexMap::new()));
    let local_inject = Box::new(LocalMusicInjector::new(Arc::clone(&index_data)));

    let mut music_inject = MusicInjector::new(
        "local".to_string(),
        String::from("本地音乐"),
        String::from("gray"),
        local_inject,
    );

    music_inject.on_init(move |app| {
        let data_path = app
            .path_resolver()
            .app_data_dir()
            .unwrap()
            .to_str()
            .unwrap()
            .to_string();
        let mut manager = LocalMusicManager::new(Arc::clone(&index_data), data_path);

        let main_window = get_main_window(&app);
    });

    music_inject
}
