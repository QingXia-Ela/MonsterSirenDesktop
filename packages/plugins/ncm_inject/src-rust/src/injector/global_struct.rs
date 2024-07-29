use monster_siren_desktop::global_struct::siren::{Album, BriefAlbum, BriefSong, Song};
use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct SingleNeteaseUserPlaylist {
    pub id: u64,
    #[serde(rename = "coverImgUrl")]
    pub cover_img_url: String,
    pub name: String,
}

impl From<SingleNeteaseUserPlaylist> for BriefAlbum {
    fn from(value: SingleNeteaseUserPlaylist) -> Self {
        Self {
            cid: format!("ncm:{}", value.id),
            name: value.name,
            cn_namespace: "网易云音乐".to_string(),
            cover_url: value.cover_img_url,
            artistes: vec![],
        }
    }
}

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct NeteaseUserPlaylistResponse {
    pub version: String,
    pub more: bool,
    pub code: i32,
    pub playlist: Vec<SingleNeteaseUserPlaylist>,
}

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct NeteaseBriefArtist {
    pub id: u64,
    pub name: String,
    // tns: Vec<String>,
    // alias: Vec<String>,
}

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct NeteaseBriefAlbum {
    pub id: u64,
    pub name: String,
    #[serde(rename = "picUrl")]
    pub pic_url: Option<String>,
    // tns: Vec<String>,
}

// todo!: add size show
// #[derive(Serialize, Deserialize, Debug, Clone)]
// https://docs-neteasecloudmusicapi.vercel.app/docs/#/?id=%e7%bd%91%e6%98%93%e4%ba%91%e9%9f%b3%e4%b9%90-api
// pub struct NeteasePlaylistDetailQuality {

// }

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct NeteasePlaylistDetailSingleSong {
    pub name: String,
    pub id: u64,
    /// artists
    pub ar: Vec<NeteaseBriefArtist>,
    /// album
    pub al: NeteaseBriefAlbum,
    /// duration
    pub dt: u64,
    #[serde(rename = "publishTime")]
    pub publish_time: i64,
}

impl NeteasePlaylistDetailSingleSong {
    fn to_siren_brief_song(self, album_cid: String) -> BriefSong {
        BriefSong {
            // redirect song to correct album id
            cid: format!("ncm:{}-{}", album_cid, self.id),
            name: self.name,
            album_cid: format!("ncm:{}", album_cid),
            artists: self.ar.into_iter().map(|a| a.name).collect(),
            size: None,
            // todo!: Does here i64 to u64 has problem?
            create_time: Some(self.publish_time as u64),
            duration: Some(self.dt),
            song_cover_url: self.al.pic_url,
            custom_data: None,
        }
    }
}

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct NeteasePlaylistDetail {
    pub id: u64,
    #[serde(rename = "coverImgUrl")]
    pub cover_img_url: String,
    pub name: String,
    pub description: Option<String>,
    pub tracks: Vec<NeteasePlaylistDetailSingleSong>,
}

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct NeteasePlaylistDetailResponse {
    pub code: i32,
    pub playlist: NeteasePlaylistDetail,
}

impl From<NeteasePlaylistDetailResponse> for Album {
    fn from(value: NeteasePlaylistDetailResponse) -> Self {
        Self {
            cid: format!("ncm:{}", value.playlist.id),
            name: value.playlist.name,
            cn_namespace: "网易云音乐".to_string(),
            intro: value.playlist.description.unwrap_or_default(),
            belong: "".to_string(),
            cover_url: value.playlist.cover_img_url,
            cover_de_url: "".to_string(),
            artistes: vec![],
            songs: value
                .playlist
                .tracks
                .into_iter()
                .map(|s| s.to_siren_brief_song(value.playlist.id.to_string()))
                .collect(),
        }
    }
}

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct NeteaseSongsDetailResponse {
    pub code: i32,
    pub songs: Vec<NeteasePlaylistDetailSingleSong>,
    // pub privileges: Vec<String>,
}

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct NeteaseSongDownloadInfo {
    pub id: u64,
    /// Sometimes url cannot get, on this time code will change to other instead of 200.
    pub url: Option<String>,
    pub code: i32,
    pub br: u32,
    pub size: u32,
    pub md5: Option<String>,
    pub r#type: Option<String>,
    pub level: Option<String>,
    /// Song duration
    pub time: u64,
}

impl NeteaseSongDownloadInfo {
    pub fn into_siren_song(
        self,
        detail: NeteasePlaylistDetailSingleSong,
        album_cid: String,
        lyric_url: Option<String>,
    ) -> Song {
        Song {
            cid: format!("ncm:{}-{}", album_cid, self.id),
            name: detail.name,
            album_cid: format!("ncm:{}", album_cid),
            source_url: if let Some(url) = self.url {
                url
            } else {
                String::new()
            },
            lyric_url,
            mv_url: None,
            mv_cover_url: None,
            artists: detail.ar.into_iter().map(|a| a.name).collect(),
            size: Some(self.size.into()),
            create_time: None,
            song_cover_url: detail.al.pic_url,
            duration: Some(self.time),
        }
    }
}

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct NeteaseSongDownloadResponse {
    pub code: i32,
    pub data: NeteaseSongDownloadInfo,
}

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct NeteaseSongUrlSingleData {
    pub id: u64,
    pub url: Option<String>,
    pub br: u32,
    pub size: u64,
    pub md5: Option<String>,
    pub r#type: Option<String>,
    pub code: i32,
    /// Song duration
    pub time: u64,
}

impl NeteaseSongUrlSingleData {
    pub fn into_siren_song(
        self,
        detail: NeteasePlaylistDetailSingleSong,
        album_cid: String,
        lyric_url: Option<String>,
    ) -> Song {
        Song {
            cid: format!("ncm:{}-{}", album_cid, self.id),
            name: detail.name,
            album_cid: format!("ncm:{}", album_cid),
            source_url: if let Some(url) = self.url {
                url
            } else {
                String::new()
            },
            lyric_url,
            mv_url: None,
            mv_cover_url: None,
            artists: detail.ar.into_iter().map(|a| a.name).collect(),
            size: Some(self.size.into()),
            create_time: None,
            song_cover_url: detail.al.pic_url,
            duration: Some(self.time),
        }
    }
}

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct NeteaseSongUrlResponse {
    pub code: i32,
    pub data: Vec<NeteaseSongUrlSingleData>,
}

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct NeteaseLyricInfo {
    pub version: u32,
    pub lyric: String,
}

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct NeteaseLyricResponse {
    pub code: i32,
    /// 原版歌词
    pub lrc: NeteaseLyricInfo,
    pub klyric: NeteaseLyricInfo,
    /// 翻译歌词
    pub tlyric: NeteaseLyricInfo,
    /// 罗马音歌词
    pub romalrc: NeteaseLyricInfo,
}
