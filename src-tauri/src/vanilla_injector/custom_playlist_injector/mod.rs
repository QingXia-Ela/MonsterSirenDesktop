mod manager;
mod pub_struct;
mod tauri_plugin;
use std::{fs, sync::Arc};

use futures::lock::Mutex;
use indexmap::IndexMap;
use manager::CustomPlaylistManager;
use pub_struct::SinglePlaylistInfo;

use crate::{
    global_event::frontend_notify::notify_warning,
    global_struct::{
        music_injector::{MusicInject, MusicInjector},
        siren::{Album, BriefAlbum, BriefSong, Song},
    },
    plugin_error::PluginRequestError,
};

pub type PlaylistDataType = Arc<Mutex<IndexMap<String, SinglePlaylistInfo>>>;

struct CustomPlaylistInjector {}

impl CustomPlaylistInjector {
    pub fn new() -> Self {
        Self {}
    }
}

#[async_trait::async_trait]
impl MusicInject for CustomPlaylistInjector {
    async fn get_albums(&self) -> Vec<BriefAlbum> {
        vec![]
    }

    async fn get_songs(&self) -> Vec<BriefSong> {
        vec![]
    }

    async fn get_song(&self, cid: String) -> Result<Song, PluginRequestError> {
        todo!()
    }

    async fn get_album(&self, cid: String) -> Result<Album, PluginRequestError> {
        todo!()
    }
}

pub fn get_injector(app: tauri::AppHandle) -> MusicInjector {
    let index_data: PlaylistDataType = Arc::new(Mutex::new(IndexMap::new()));

    let inject_app = app.clone();
    let manager_app = app.clone();
    let plugin_app = app.clone();
    let music_inject = MusicInjector::new(
        inject_app,
        "local".to_string(),
        String::from("自定义播放列表"),
        String::from("white"),
        None,
        Box::new(CustomPlaylistInjector::new()),
    );

    let mut data_path = plugin_app
        .path_resolver()
        .app_data_dir()
        .unwrap()
        .to_str()
        .unwrap()
        .to_string();
    data_path.push_str("\\playlist");
    match fs::create_dir_all(&data_path) {
        Ok(_) => {
            let manager =
                CustomPlaylistManager::new(data_path, Arc::clone(&index_data), manager_app);
            let _ = plugin_app.plugin(tauri_plugin::init(manager));
        }
        Err(_) => {
            notify_warning(
                &app,
                "自定义播放列表数据存储目录创建失败，该功能已暂时禁用！".to_string(),
            );
        }
    }

    music_inject
}
