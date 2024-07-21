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

struct CustomPlaylistInjector {
    manager: CustomPlaylistManager,
}

impl CustomPlaylistInjector {
    pub fn new(manager: CustomPlaylistManager) -> Self {
        Self { manager }
    }
}

#[async_trait::async_trait]
impl MusicInject for CustomPlaylistInjector {
    async fn get_albums(&self) -> Vec<BriefAlbum> {
        self.manager
            .get_all_playlists(false)
            .await
            .into_iter()
            .map(|x| x.into())
            .collect()
    }

    async fn get_songs(&self) -> Vec<BriefSong> {
        vec![]
    }

    // Custom playlist always store the song from other namespace,
    // So it doesn't have any song which is belong to itself.
    async fn get_song(&self, cid: String) -> Result<Song, PluginRequestError> {
        // 未来该方法将被启用，执行顺序：根据 cid 在播放列表查询原始 cid - 请求 api 代理获取原始数据 - 修改 albumCid 为当前播放列表的 cid并返回
        match self.manager.get_song_without_playlist_id(cid).await {
            Some(song) => Ok(song),
            None => Err(PluginRequestError::new("该歌曲不存在!".to_string())),
        }
        // Err(PluginRequestError::new("该方法不应该被调用！".to_string()))
    }

    async fn get_album(&self, mut cid: String) -> Result<Album, PluginRequestError> {
        cid = format!("custom:{}", cid);
        match self.manager.get_playlist(&cid).await {
            Some(mut playlist) => {
                // let res = playlist;
                playlist.song_map.iter_mut().for_each(move |(x, y)| {
                    // modify cid, albumCid to local
                    y.cid = format!("custom:{}", x);
                    y.album_cid = cid.clone();
                });
                Ok(playlist.into())
            }
            None => Err(PluginRequestError::new("该播放列表不存在!".to_string())),
        }
    }
}

// todo!: clean up it
pub fn get_injector(app: tauri::AppHandle) -> MusicInjector {
    let index_data: PlaylistDataType = Arc::new(Mutex::new(IndexMap::new()));

    let plugin_app = app.clone();

    let mut data_path = app
        .path_resolver()
        .app_data_dir()
        .unwrap()
        .to_str()
        .unwrap()
        .to_string();
    data_path.push_str("\\playlist");

    let music_inject = MusicInjector::new(
        app.clone(),
        "custom".to_string(),
        String::from("自定义播放列表"),
        String::from("white"),
        None,
        Box::new(CustomPlaylistInjector::new(CustomPlaylistManager::new(
            data_path.clone(),
            Arc::clone(&index_data),
            app.clone(),
        ))),
    );

    match fs::create_dir_all(&data_path) {
        Ok(_) => {
            let manager =
                CustomPlaylistManager::new(data_path, Arc::clone(&index_data), app.clone());
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
