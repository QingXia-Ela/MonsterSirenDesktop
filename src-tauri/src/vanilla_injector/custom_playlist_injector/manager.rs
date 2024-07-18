use crate::global_struct::siren::BriefSong;
use tokio::fs;
use uuid::Uuid;

use super::{pub_struct::SinglePlaylistInfo, PlaylistDataType};

pub struct CustomPlaylistManager {
    base_url: String,
    data: PlaylistDataType,
    app: tauri::AppHandle,
}

fn create_empty_playlist(id: &String) -> SinglePlaylistInfo {
    SinglePlaylistInfo {
        id: id.clone(),
        name: "".to_string(),
        songs: vec![],
        description: "".to_string(),
        cover_url: "".to_string(),
    }
}

async fn get_playlist_from_disk(
    basepath: &String,
    playlist_id: &String,
) -> Option<SinglePlaylistInfo> {
    // todo!: add error handling
    match fs::read_to_string(format!("{}\\{}", basepath, playlist_id)).await {
        Ok(playlist_str) => serde_json::from_str(&playlist_str).unwrap(),
        Err(_) => None,
    }
}

async fn create_playlist_to_disk(basepath: &String, playlist_id: &String) {
    // todo!: add error handling
    let _ = fs::write(
        format!("{}\\{}", basepath, playlist_id),
        serde_json::to_string(&create_empty_playlist(playlist_id)).unwrap(),
    )
    .await;
}

async fn update_playlist_to_disk(basepath: &String, playlist: &SinglePlaylistInfo) {
    // todo!: add error handling
    let _ = fs::write(
        format!("{}\\{}", basepath, playlist.id),
        serde_json::to_string(playlist).unwrap(),
    )
    .await;
}

async fn remove_playlist_from_disk(basepath: &String, playlist_id: &String) {
    // todo!: add error handling
    let _ = fs::remove_file(format!("{}\\{}", basepath, playlist_id)).await;
}

// todo!: optimize performance
impl CustomPlaylistManager {
    pub fn new(base_url: String, data: PlaylistDataType, app: tauri::AppHandle) -> Self {
        Self {
            base_url,
            data,
            app,
        }
    }

    pub async fn add_song(&self, playlist_id: String, song: BriefSong) {
        match self.data.lock().await.get_mut(&playlist_id) {
            Some(playlist) => {
                let exist = playlist.songs.iter().any(|x| x.cid == song.cid);
                if !exist {
                    playlist.songs.push(song);
                }
            }
            None => (),
        }
    }

    pub async fn remove_song(&self, playlist_id: String, cid: String) {
        self.remove_songs(playlist_id, vec![cid]).await
    }

    pub async fn remove_songs(&self, playlist_id: String, cids: Vec<String>) {
        match self.data.lock().await.get_mut(&playlist_id) {
            Some(playlist) => {
                playlist.songs.retain(|x| !cids.contains(&x.cid));
            }
            None => (),
        }
    }

    pub async fn update_song(&self, playlist_id: String, old_song_id: String, new_song: BriefSong) {
        match self.data.lock().await.get_mut(&playlist_id) {
            Some(playlist) => {
                playlist
                    .songs
                    .iter_mut()
                    .find(|x| x.cid == old_song_id)
                    .map(|x| *x = new_song);
            }
            None => (),
        }
    }

    /// Use new songs replace old songs.
    pub async fn update_songs(&self, playlist_id: String, new_songs: Vec<BriefSong>) {
        match self.data.lock().await.get_mut(&playlist_id) {
            Some(playlist) => {
                playlist.songs = new_songs;
            }
            None => (),
        }
    }

    pub async fn get_song(&self, playlist_id: String, cid: String) -> Option<BriefSong> {
        match self.data.lock().await.get(&playlist_id) {
            Some(playlist) => playlist
                .songs
                .iter()
                .find(|x| x.cid == cid)
                .map(|x| x.clone()),
            None => None,
        }
    }

    pub async fn add_playlist(&self, name: String) {
        let id = Uuid::new_v4().to_string();
        let playlist = SinglePlaylistInfo {
            id: id.clone(),
            name,
            songs: vec![],
            description: "".to_string(),
            cover_url: "".to_string(),
        };
        self.data.lock().await.insert(id, playlist);
        // update_playlist_to_disk(self.app.path_resolver().app_dir().display().to_string(), playlist)
    }

    pub async fn remove_playlist(&self, playlist_id: String) {
        self.data.lock().await.remove(&playlist_id);
        remove_playlist_from_disk(&self.base_url, &playlist_id).await
    }

    /// Use new info to replace old info
    /// The songs property will be ignore, and only modify the other properties
    // todo!: add error throw
    pub async fn update_playlist_metadata(
        &self,
        playlist_id: String,
        mut new_playlist: SinglePlaylistInfo,
    ) {
        let mut map = self.data.lock().await;
        match map.get(&playlist_id) {
            Some(playlist) => {
                new_playlist.songs = playlist.songs.clone();
                map.insert(playlist_id, new_playlist);
            }
            None => (),
        }
        // update_playlist_to_disk(self.app.path_resolver().app_dir().display().to_string(), new_playlist)
    }

    pub async fn get_playlist(&self, playlist_id: String) -> Option<SinglePlaylistInfo> {
        self.data.lock().await.get(&playlist_id).map(|x| x.clone())
    }

    pub async fn get_all_playlists(&self) -> Vec<SinglePlaylistInfo> {
        self.data.lock().await.values().map(|x| x.clone()).collect()
    }
}
