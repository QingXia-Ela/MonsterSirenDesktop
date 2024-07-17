use crate::global_struct::siren::BriefSong;

use super::{pub_struct::SinglePlaylistInfo, PlaylistDataType};

pub struct CustomPlaylistManager {
    data: PlaylistDataType,
    app: tauri::AppHandle,
}

async fn update_playlist_to_disk(basepath: String, playlist: SinglePlaylistInfo) {}

impl CustomPlaylistManager {
    pub fn new(data: PlaylistDataType, app: tauri::AppHandle) -> Self {
        Self { data, app }
    }

    pub async fn add_song(&self, playlist_id: String, song: BriefSong) {}
    pub async fn remove_song(&self, playlist_id: String, cid: String) {}
    pub async fn add_playlist(&self, name: String) {}
    pub async fn remove_playlist(&self, playlist_id: String) {}
}
