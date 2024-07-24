use std::{collections::HashMap, time::SystemTime};

use crate::{
    global_struct::siren::{response_msg::ResponseMsg, BriefSong, Song},
    Logger::{debug, error},
};
use lazy_static::lazy_static;
use tokio::{fs, sync::Mutex};
use uuid::Uuid;

use super::{pub_struct::SinglePlaylistInfo, PlaylistDataType};

lazy_static! {
    static ref GLOBAL_DISK_UPDATE_TIME: Mutex<SystemTime> = Mutex::new(SystemTime::UNIX_EPOCH);
}

const API_PROXY_PORT: u16 = 11452;

fn create_empty_playlist(id: &String, name: &String) -> SinglePlaylistInfo {
    SinglePlaylistInfo {
        id: format!("custom:{}", id),
        name: name.clone(),
        songs: vec![],
        description: "".to_string(),
        cover_url: "".to_string(),
        song_map: HashMap::new(),
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

async fn get_all_playlists_from_disk(basepath: &String) -> Vec<SinglePlaylistInfo> {
    // todo!: add error handling instead of ignore
    match fs::read_dir(basepath).await {
        Ok(mut entries) => {
            let mut res: Vec<SinglePlaylistInfo> = vec![];
            loop {
                let entry = entries.next_entry().await;
                if let Ok(entry) = entry {
                    if let Some(entry) = entry {
                        let file_name = entry.file_name();
                        let file_name = file_name.to_str();
                        if let Some(file_name) = file_name {
                            if file_name.ends_with(".json") {
                                let content =
                                    fs::read_to_string(format!("{}\\{}", basepath, file_name))
                                        .await;
                                if let Ok(content) = content {
                                    if let Ok(playlist) =
                                        serde_json::from_str::<SinglePlaylistInfo>(&content)
                                    {
                                        res.push(playlist);
                                    }
                                }
                            }
                        }
                    } else {
                        return res;
                    }
                } else {
                    return res;
                }
            }
        }
        Err(_) => vec![],
    }
}

async fn create_playlist_to_disk(
    basepath: &String,
    playlist_id: &String,
    name: &String,
) -> std::io::Result<()> {
    // todo!: add error handling
    fs::write(
        format!("{}\\{}.json", basepath, playlist_id),
        serde_json::to_string(&create_empty_playlist(playlist_id, name)).unwrap(),
    )
    .await
}

async fn update_playlist_to_disk(basepath: &String, playlist: &SinglePlaylistInfo) {
    // todo!: add error handling
    let _ = fs::write(
        format!(
            "{}\\{}.json",
            basepath,
            playlist.id.clone().replace("custom:", "")
        ),
        serde_json::to_string(playlist).unwrap(),
    )
    .await;
}

async fn remove_playlist_from_disk(basepath: &String, playlist_id: &String) {
    // todo!: add error handling
    let _ = fs::remove_file(format!(
        "{}\\{}.json",
        basepath,
        playlist_id.replace("custom:", "")
    ))
    .await;
}

pub struct CustomPlaylistManager {
    base_url: String,
    /// Key 包含 `custom:` 作为开头
    data: PlaylistDataType,
    app: tauri::AppHandle,
}

// todo!: optimize performance, decrease disk writes
impl CustomPlaylistManager {
    pub fn new(base_url: String, data: PlaylistDataType, app: tauri::AppHandle) -> Self {
        Self {
            base_url,
            data,
            app,
        }
    }

    /// 传入的 id 不应该包含 namespace
    // todo!: 处理从一个自定义列表添加到另一个自定义列表的特殊情况
    pub async fn add_song(&self, playlist_id: String, song: BriefSong) {
        let custom_id = Uuid::new_v4().to_string();
        match self.data.lock().await.get_mut(&playlist_id) {
            Some(playlist) => {
                let exist = playlist.song_map.values().any(|x| x.cid.eq(&song.cid));
                if !exist {
                    playlist.song_map.insert(custom_id.clone(), song);
                    playlist.songs.push(custom_id);
                }
                let _ = update_playlist_to_disk(&self.base_url, playlist).await;
            }
            None => (),
        }
    }

    pub async fn remove_song(&self, playlist_id: String, cid: String) {
        self.remove_songs(playlist_id, vec![cid]).await;
    }

    pub async fn remove_songs(&self, playlist_id: String, cids: Vec<String>) {
        match self.data.lock().await.get_mut(&playlist_id) {
            Some(playlist) => {
                playlist.songs.retain(|x| !cids.contains(&x));
                cids.iter().for_each(|x| {
                    playlist.song_map.remove(x);
                });
                let _ = update_playlist_to_disk(&self.base_url, playlist).await;
            }
            None => (),
        }
    }

    /// Old song id 是 custom 命名空间下的id
    pub async fn update_song(&self, playlist_id: String, old_song_id: String, new_song: BriefSong) {
        match self.data.lock().await.get_mut(&playlist_id) {
            Some(playlist) => {
                match playlist.songs.iter_mut().find(|x| old_song_id.eq(*x)) {
                    Some(x) => {
                        // new song info inherits old song info
                        playlist.song_map.insert(old_song_id.clone(), new_song);
                        *x = old_song_id;
                        let _ = update_playlist_to_disk(&self.base_url, playlist).await;
                    }
                    None => (),
                }
            }
            None => (),
        }
    }

    /// Use new songs replace old songs.
    #[deprecated = "This methods doesn't work correctly now and wait for fix. You can use update_songs instead."]
    #[allow(dead_code)]
    pub async fn update_songs(&self, playlist_id: String, new_songs: Vec<BriefSong>) {
        match self.data.lock().await.get_mut(&playlist_id) {
            Some(playlist) => {
                playlist.songs = new_songs.iter().map(|x| x.cid.clone()).collect();
                // playlist.song_map
                let mut new_song_map = HashMap::new();
                for song in new_songs {
                    new_song_map.insert(song.cid.clone(), song);
                }
                playlist.song_map = new_song_map;
                let _ = update_playlist_to_disk(&self.base_url, playlist).await;
            }
            None => (),
        }
    }

    pub async fn get_song(&self, mut playlist_id: String, cid: String) -> Option<Song> {
        if !playlist_id.starts_with("custom:") {
            playlist_id = format!("custom:{}", playlist_id);
        }
        match self.data.lock().await.get(&playlist_id) {
            Some(playlist) => match playlist.song_map.get(&cid) {
                Some(song) => {
                    let song = song.clone();
                    // todo!: maybe here can add a fetch cache
                    let res = reqwest::get(format!(
                        "http://localhost:{}/song/{}",
                        API_PROXY_PORT, &song.cid
                    ))
                    .await;
                    if let Ok(res) = res {
                        match res.json::<ResponseMsg<Song>>().await {
                            Ok(song) => {
                                let mut song = song.data;
                                // modify cid and albumCid to local
                                song.cid = format!("custom:{}", cid);
                                song.album_cid = playlist_id;
                                return Some(song);
                            }
                            Err(e) => {
                                error(
                                    format!(
                                        "JSON parse error: {}, playlist_id: {}, cid: {}",
                                        e, playlist_id, cid
                                    )
                                    .as_str(),
                                );
                                return None;
                            }
                        }
                    } else {
                        println!("Error: {:?}", res);
                        return None;
                    }
                }
                None => None,
            },
            None => None,
        }
    }

    /// This method return modified data (`cid` and `album_cid`). The time complexity is **O(n)** (`n` is the number of playlist)
    pub async fn get_song_without_playlist_id(&self, cid: String) -> Option<Song> {
        let playlist_ids = {
            self.data
                .lock()
                .await
                .keys()
                .cloned()
                .collect::<Vec<String>>()
        };

        for playlist_id in playlist_ids {
            if let Some(song) = self.get_song(playlist_id, cid.clone()).await {
                return Some(song);
            }
        }
        None
    }

    pub async fn add_playlist(&self, name: String) -> std::io::Result<SinglePlaylistInfo> {
        let id = Uuid::new_v4().to_string();
        let playlist = SinglePlaylistInfo {
            id: format!("custom:{}", id.clone()),
            name,
            songs: vec![],
            description: "".to_string(),
            cover_url: "/siren.png".to_string(),
            song_map: HashMap::new(),
        };
        create_playlist_to_disk(&self.base_url, &id, &playlist.name).await?;
        self.data
            .lock()
            .await
            .insert(format!("custom:{}", id.clone()), playlist.clone());
        Ok(playlist)
        // update_playlist_to_disk(self.app.path_resolver().app_dir().display().to_string(), playlist)
    }

    pub async fn remove_playlist(&self, playlist_id: String) {
        self.data.lock().await.swap_remove(&playlist_id);
        remove_playlist_from_disk(&self.base_url, &playlist_id).await;
        let _ = self.get_all_playlists(true).await;
    }

    /// Use new info to replace old info
    /// The songs, song_map property will be ignore
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
                new_playlist.song_map = playlist.song_map.clone();
                // todo!: optimize
                let _ = update_playlist_to_disk(&self.base_url, &new_playlist).await;
                map.insert(playlist_id, new_playlist);
            }
            None => (),
        }
    }

    /// playlist_id should include namespace
    // todo!: 过滤掉命名空间不存在的歌曲
    pub async fn get_playlist(&self, playlist_id: &String) -> Option<SinglePlaylistInfo> {
        // todo!: add fetch from disk
        self.data.lock().await.get(playlist_id).map(|x| x.clone())
    }

    // This method is call in high frequency, need to optimize
    // todo!: 过滤掉命名空间不存在的歌曲
    pub async fn get_all_playlists(&self, force_refresh: bool) -> Vec<SinglePlaylistInfo> {
        // todo!: add fetch from disk
        let mut time_lock = GLOBAL_DISK_UPDATE_TIME.lock().await;
        // 1 minute
        if force_refresh || time_lock.elapsed().unwrap().as_secs() > 60 {
            let disk_data = get_all_playlists_from_disk(&self.base_url).await;
            let return_data = disk_data.clone();
            {
                let mut data = self.data.lock().await;
                data.clear();
                for playlist in disk_data {
                    let id = playlist.id.clone();
                    data.insert(id, playlist);
                }
            }
            *time_lock = SystemTime::now();
            debug("Refresh disk data now.");
            return return_data;
        } else {
            return self.data.lock().await.values().cloned().collect();
        }
    }
}
