use std::collections::HashMap;

use ts_rs::TS;

use crate::global_struct::siren::{Album, BriefAlbum, BriefSong};

#[derive(Debug, Clone, serde::Serialize, serde::Deserialize, TS)]
#[ts(export)]
// todo!: add metadata struct create
pub struct SinglePlaylistInfo {
    pub name: String,
    /// song_map 下的歌曲 `albumCid` 字段必须与该部分相同，否则会导致播放列表切换到别处
    pub id: String,
    pub description: String,
    pub cover_url: String,
    /// 歌曲id，必须是以 `custom:` 开头，保存存储顺序
    pub songs: Vec<String>,
    /// KV 表，key 不包含 `custom:` 命名空间， value 存储原始 brief song 数据，未来会替换成有序哈希表
    pub song_map: HashMap<String, BriefSong>,
}

impl From<SinglePlaylistInfo> for BriefAlbum {
    fn from(single_playlist_info: SinglePlaylistInfo) -> Self {
        BriefAlbum {
            cid: single_playlist_info.id,
            cn_namespace: "自定义播放列表".to_string(),
            name: single_playlist_info.name,
            cover_url: single_playlist_info.cover_url,
            artistes: vec![],
        }
    }
}

impl From<SinglePlaylistInfo> for Album {
    fn from(value: SinglePlaylistInfo) -> Self {
        Album {
            cid: value.id,
            name: value.name,
            cn_namespace: "自定义播放列表".to_string(),
            intro: value.description,
            belong: "".to_string(),
            cover_url: value.cover_url,
            cover_de_url: "".to_string(),
            artistes: vec![],
            songs: value.song_map.values().cloned().collect(),
        }
    }
}
