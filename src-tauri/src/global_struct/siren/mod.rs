pub mod response_msg;

use serde::{Deserialize, Serialize};

/// parse the underline k_c to kC
/// todo!: optimize it when s is shorter
fn parse_kebab_to_camel(s: String) -> String {
    let mut result = String::new();
    let mut flag = false;
    for c in s.chars() {
        if c == '_' {
            flag = true;
            continue;
        }
        if flag {
            result.push(c.to_ascii_uppercase());
            flag = false;
        } else {
            result.push(c);
        }
    }
    result
}

pub trait ToResponseJson {
    fn to_reponse_json(&self) -> String
    where
        Self: Serialize,
    {
        let s = serde_json::to_string(self).unwrap();
        parse_kebab_to_camel(s)
    }
}

#[derive(Clone, Debug, Serialize, Deserialize)]
pub struct SirenBriefSong {
    pub cid: String,
    pub name: String,
    pub album_cid: String,
    pub artists: Vec<String>,
}

impl ToResponseJson for SirenBriefSong {}

#[derive(Clone, Debug, Serialize, Deserialize)]
pub struct SirenSong {
    pub cid: String,
    pub name: String,
    #[serde(rename = "albumCid")]
    pub album_cid: String,
    #[serde(rename = "sourceUrl")]
    pub source_url: String,
    #[serde(rename = "lyricUrl")]
    pub lyric_url: Option<String>,
    #[serde(rename = "mvUrl")]
    pub mv_url: Option<String>,
    #[serde(rename = "mvCoverUrl")]
    pub mv_cover_url: Option<String>,
    pub artists: Vec<String>,
}

impl ToResponseJson for SirenSong {}

#[derive(Clone, Debug, Serialize, Deserialize)]
pub struct SirenBriefAlbum {
    pub cid: String,
    pub name: String,
    #[serde(rename = "coverUrl")]
    pub cover_url: String,
    pub artistes: Vec<String>,
}

impl ToResponseJson for SirenBriefAlbum {}

#[derive(Clone, Debug, Serialize, Deserialize)]
pub struct SirenAlbum {
    pub cid: String,
    pub name: String,
    pub intro: String,
    pub belong: String,
    #[serde(rename = "coverUrl")]
    pub cover_url: String,
    #[serde(rename = "coverDeUrl")]
    pub cover_de_url: String,
    pub artistes: Vec<String>,
    pub songs: Vec<SirenBriefSong>,
}

impl ToResponseJson for SirenAlbum {}

// impl detail to brief
impl From<SirenAlbum> for SirenBriefAlbum {
    fn from(siren_album: SirenAlbum) -> Self {
        SirenBriefAlbum {
            cid: siren_album.cid,
            name: siren_album.name,
            cover_url: siren_album.cover_url,
            artistes: siren_album.artistes,
        }
    }
}

impl From<SirenSong> for SirenBriefSong {
    fn from(siren_song: SirenSong) -> Self {
        SirenBriefSong {
            cid: siren_song.cid,
            name: siren_song.name,
            album_cid: siren_song.album_cid,
            artists: siren_song.artists,
        }
    }
}
