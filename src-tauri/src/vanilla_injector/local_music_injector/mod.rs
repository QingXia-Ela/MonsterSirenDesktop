use crate::constants::AUDIO_SUFFIX;
use crate::global_utils::{get_main_window, is_audio_suffix};
use crate::{
    error::PluginRequestError,
    global_struct::{
        music_injector::{MusicInject, MusicInjector},
        siren::{Album, BriefAlbum, BriefSong, Song},
    },
};
use async_trait::async_trait;
use futures::executor::block_on;
use futures::lock::Mutex;
use futures::FutureExt;
use indexmap::IndexMap;
use inject_event::InjectEvent::*;
use std::os::windows::fs::MetadataExt;
use std::{fs, sync::Arc};
use tokio::fs as tokio_fs;

mod inject_event;

type IndexDataType = Arc<Mutex<IndexMap<String, Vec<BriefSong>>>>;

#[derive(Debug, Clone, serde::Serialize, serde::Deserialize)]
struct SingleFolderDataType {
    path: String,
    // todo!: change it to audio file metadata
    songs: Vec<BriefSong>,
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
        // todo!("rescan and update index");
        // let res = res.;
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
        // prevent folder path without `\\` lead the each file path is wrong
        if !folder.ends_with("\\") {
            folder.push_str("\\");
        }
        match tokio_fs::read_dir(&folder).await {
            Ok(mut dir) => {
                let mut v = vec![];
                while let Ok(Some(entry)) = dir.next_entry().await {
                    let path = entry.path();
                    if path.is_file() && is_audio_suffix(path.to_str()) {
                        let metadata = path.metadata().unwrap();
                        v.push(BriefSong {
                            album_cid: folder.clone().to_string(),
                            // provide full file path for file_server read directly
                            cid: format!("{:x}", md5::compute(path.clone().to_str().unwrap())),
                            name: path.file_name().unwrap().to_str().unwrap().to_string(),
                            artists: vec![],
                            size: Some(metadata.file_size()),
                            create_time: Some(metadata.creation_time()),
                        })
                    }
                }
                self.index.lock().await.insert(folder, v);
            }
            Err(_) => return,
        }
        self.update().await
    }

    pub async fn remove_folder(&mut self, mut folder: String) {
        // prevent folder path without `\\` lead the each file path is wrong
        if !folder.ends_with("\\") {
            folder.push_str("\\");
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

fn add_namespace_for_song(mut song: BriefSong) -> BriefSong {
    song.name = remove_audio_file_suffix(song.name);
    song.cid = format!("local:{}", song.cid);
    song.album_cid = format!("local:{}", song.album_cid);
    song
}

fn remove_audio_file_suffix(mut name: String) -> String {
    AUDIO_SUFFIX.iter().for_each(|suffix| {
        if name.ends_with(suffix) {
            name = name[0..name.len() - suffix.len()].to_string();
        }
    });
    name
}

#[async_trait]
impl MusicInject for LocalMusicInjector {
    // This get albums will return select scan music folders, or nothing, it control by user config.
    async fn get_albums(&self) -> Vec<BriefAlbum> {
        let mut res = vec![];
        for path in self.index.lock().await.keys() {
            res.push(BriefAlbum {
                cid: format!("local:{}", path),
                name: path.clone(),
                // todo!: add default cover path
                cover_url: String::from("/UAlbum.jpg"),
                artistes: vec![],
            })
        }
        res
    }

    // This get songs will return empty array because we don't know how many song it provide.
    // Or the songs is too many.
    async fn get_songs(&self) -> Vec<BriefSong> {
        vec![]
    }

    // Use full path as song cid.
    // Spend O(n) time to search.
    async fn get_song(&self, cid: String) -> Result<Song, PluginRequestError> {
        for (path, folder) in self.index.lock().await.iter() {
            for song in folder {
                if cid == song.cid {
                    return Ok(Song {
                        name: remove_audio_file_suffix(song.name.clone()),
                        album_cid: format!("local:{}", path),
                        // file server read
                        // todo!: make server port can custom
                        source_url: format!(
                            "http://localhost:11453?path={}{}",
                            path,
                            song.name.clone()
                        ),
                        lyric_url: None,
                        mv_url: Some(String::new()),
                        mv_cover_url: Some(String::new()),
                        artists: vec![],
                        size: song.size,
                        create_time: song.create_time,
                        cid,
                    });
                }
            }
        }
        Err(PluginRequestError::new("Song not found".into()))
    }

    async fn get_album(&self, mut cid: String) -> Result<Album, PluginRequestError> {
        // parse path from `/` to `\\`, don't ask me why I do this, because http request path will change `\\` to `/` 🧐
        cid = cid.replace("/", "\\");
        match self.index.lock().await.get(&cid) {
            Some(v) => {
                let songs = v.clone().into_iter().map(add_namespace_for_song).collect();
                return Ok(Album {
                    cid: format!("local:{}", cid),
                    name: format!("本地音乐:{}", cid),
                    intro: format!("本地音乐: {}", cid),
                    belong: String::new(),
                    // todo!: add default cover path
                    cover_url: String::from("/UAlbum.jpg"),
                    cover_de_url: String::new(),
                    artistes: vec![],
                    songs,
                });
            }
            None => Err(PluginRequestError::new("Album not found".into())),
        }
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
        let mut manager = LocalMusicManager::new(
            Arc::clone(&index_data),
            format!("{}\\local_music_inject_list.json", data_path),
        );

        let main_window = get_main_window(&app);
    });

    music_inject
}
