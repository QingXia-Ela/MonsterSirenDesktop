// todo!: album cid optimize or change it to sha256 calc value
// todo!: optimize it.
use crate::constants::AUDIO_SUFFIX;
use crate::global_utils::{get_main_window, is_audio_suffix};
use crate::{
    global_struct::{
        music_injector::{MusicInject, MusicInjector},
        siren::{Album, BriefAlbum, BriefSong, Song},
    },
    plugin_error::PluginRequestError,
};
use async_trait::async_trait;
use futures::lock::Mutex;
use indexmap::IndexMap;
use percent_encoding::{percent_decode, utf8_percent_encode, NON_ALPHANUMERIC};
use std::os::windows::fs::MetadataExt;
use std::{fs, sync::Arc};
use tokio::fs as tokio_fs;

mod inject_event;
mod tauri_plugin;

type IndexDataType = Arc<Mutex<IndexMap<String, Vec<BriefSong>>>>;

#[derive(Debug, Clone, serde::Serialize, serde::Deserialize)]
pub struct SingleFolderDataType {
    path: String,
    // todo!: change it to audio file metadata
    songs: Vec<BriefSong>,
}

/// This manager is use to modify data only.
#[derive(Default)]
pub struct LocalMusicManager {
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
    pub async fn update(&self) {
        // todo!("rescan and update index");
        // let res = res.;
        tokio_fs::write(
            &self.folder_record_path,
            serde_json::to_string(&self.get_index_vec().await).unwrap(),
        )
        .await
        .unwrap();
    }

    pub async fn get_folders(&self) -> Vec<String> {
        self.index.lock().await.keys().cloned().collect()
    }

    pub async fn get_index_vec(&self) -> Vec<SingleFolderDataType> {
        self.index
            .lock()
            .await
            .iter()
            .map(|(k, v)| SingleFolderDataType {
                path: k.to_string(),
                songs: v.to_vec(),
            })
            .collect()
    }

    // todo!: return error type.
    pub async fn add_folder(&self, folder: &String) {
        // parse path from `/` to `\\`, don't ask me why I do this, because http request path will change `\\` to `/` 🧐
        let mut folder = folder.replace("/", "\\");
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
                            cid: format!(
                                "local:{}",
                                sha256::digest(path.clone().to_str().unwrap()).to_string()
                            ),
                            name: path.file_name().unwrap().to_str().unwrap().to_string(),
                            artists: vec![],
                            size: Some(metadata.file_size()),
                            create_time: Some(metadata.creation_time()),
                        })
                    }
                }
                self.index.lock().await.insert(folder, v);
            }
            Err(e) => return,
        }
        self.update().await
    }

    pub async fn remove_folder(&self, folder: &String) {
        // parse path from `/` to `\\`, don't ask me why I do this, because http request path will change `\\` to `/` 🧐
        let mut folder = folder.replace("/", "\\");
        // prevent folder path without `\\` lead the each file path is wrong
        if !folder.ends_with("\\") {
            folder.push_str("\\");
        }
        self.index.lock().await.remove(&folder);
        self.update().await
    }

    pub async fn swap(&self, i1: usize, i2: usize) {
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

    // #[tokio::test]
    // async fn add_folder_test() {
    //     init_file().await;
    //     let m = LocalMusicManager::new(
    //         Arc::new(Mutex::new(IndexMap::new())),
    //         String::from("./tests/injector/local/add_folder/config_add.json"),
    //     );
    //     m.add_folder(&String::from("./tests/injector/local/add_folder/"))
    //         .await;
    //     assert_eq!(m.index.lock().await.len(), 1);
    // }

    #[tokio::test]
    async fn remove_folder_test() {
        init_file().await;
        let m = LocalMusicManager::new(
            Arc::new(Mutex::new(IndexMap::new())),
            String::from("./tests/injector/local/add_folder/config_remove.json"),
        );

        m.add_folder(&String::from("./tests/injector/local/add_folder/"))
            .await;
        m.remove_folder(&String::from("./tests/injector/local/add_folder/"))
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
                cid: format!("local:{}", path.replace('\\', ":")),
                name: path.clone(),
                cn_namespace: String::from("本地音乐"),
                // todo!: add default cover path
                cover_url: String::from("/siren.png"),
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
    // Spend O(n) time to search. n is the number of song.
    // todo!: optimize it. this method is often to use.
    async fn get_song(&self, mut cid: String) -> Result<Song, PluginRequestError> {
        cid = format!("local:{}", cid);
        for (path, folder) in self.index.lock().await.iter() {
            for song in folder {
                if cid == song.cid {
                    let lrc_path = format!(
                        "{}{}.lrc",
                        path,
                        remove_audio_file_suffix(song.name.clone())
                    );
                    let lrc = tokio_fs::metadata(lrc_path.clone()).await;
                    // todo!:  decrease format time.
                    return Ok(Song {
                        name: remove_audio_file_suffix(song.name.clone()),
                        album_cid: format!("local:{}", path),
                        // file server read
                        // todo!: make server port can custom;
                        source_url: format!(
                            "http://localhost:11453?path={}",
                            utf8_percent_encode(
                                format!("{}{}", path, song.name.clone()).as_str(),
                                NON_ALPHANUMERIC
                            )
                        ),
                        // todo!: make server port can custom;
                        lyric_url: match lrc {
                            Ok(lrc) => {
                                if lrc.is_file() {
                                    Some(format!(
                                        "http://localhost:11453?path={}",
                                        utf8_percent_encode(lrc_path.as_str(), NON_ALPHANUMERIC)
                                    ))
                                } else {
                                    None
                                }
                            }
                            Err(_) => None,
                        },
                        mv_url: Some(String::new()),
                        mv_cover_url: Some(String::new()),
                        artists: vec![],
                        size: song.size,
                        create_time: song.create_time,
                        // todo!: finish it in future. Now local injector still cannot read img from audio metadata.
                        song_cover_url: None,
                        cid,
                    });
                }
            }
        }
        Err(PluginRequestError::new("Song not found".into()))
    }

    async fn get_album(&self, mut cid: String) -> Result<Album, PluginRequestError> {
        // parse path from `/` to `\\`, don't ask me why I do this, because http request path will change `\\` to `/` 🧐
        cid = percent_decode(cid.replace("/", "\\").as_bytes())
            .decode_utf8()
            .unwrap()
            .to_string()
            .replace(':', "\\")
            .replace("\\\\", ":\\");
        match self.index.lock().await.get(&cid) {
            Some(v) => {
                let songs = v.clone();
                return Ok(Album {
                    // cid shouldn't include `\\`, which will lead music page error when switch album and show album img
                    cid: format!("local:{}", cid.replace("\\", ":")),
                    cn_namespace: String::from("本地音乐"),
                    name: format!("本地音乐:{}", cid),
                    intro: format!("本地音乐: {}", cid),
                    belong: String::from("local"),
                    // todo!: add default cover path
                    cover_url: String::from("/siren.png"),
                    cover_de_url: String::from("/siren.png"),
                    artistes: vec![],
                    songs,
                });
            }
            None => Err(PluginRequestError::new("Album not found".into())),
        }
    }
}

pub fn get_injector(app: tauri::AppHandle) -> MusicInjector {
    let index_data: IndexDataType = Arc::new(Mutex::new(IndexMap::new()));
    let local_inject = Box::new(LocalMusicInjector::new(Arc::clone(&index_data)));

    let mut music_inject = MusicInjector::new(
        app,
        "local".to_string(),
        String::from("本地音乐"),
        String::from("gray"),
        None,
        local_inject,
    );

    music_inject.on_init(move |app| {
        // app.plu
        let data_path = app
            .path_resolver()
            .app_data_dir()
            .unwrap()
            .to_str()
            .unwrap()
            .to_string();
        let manager = LocalMusicManager::new(
            Arc::clone(&index_data),
            format!("{}\\local_music_inject_list.json", data_path),
        );

        let _ = app.plugin(tauri_plugin::init(manager));
    });

    music_inject
}
