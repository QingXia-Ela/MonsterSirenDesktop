use crate::global_struct::siren::{Album, BriefAlbum, BriefSong};

#[derive(Debug, Clone, serde::Serialize, serde::Deserialize)]
pub struct SinglePlaylistInfo {
    pub name: String,
    pub id: String,
    pub description: String,
    pub cover_url: String,
    pub songs: Vec<BriefSong>,
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
            songs: value.songs,
        }
    }
}
