use crate::global_struct::siren::BriefSong;

#[derive(Debug, Clone, serde::Serialize, serde::Deserialize)]
pub struct SinglePlaylistInfo {
    pub name: String,
    pub id: String,
    pub description: String,
    pub cover_url: String,
    pub songs: Vec<BriefSong>,
}
