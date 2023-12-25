#[derive(Debug, Clone, serde::Serialize, serde::Deserialize)]
pub enum InjectEvent {
    // frontend to rust
    #[serde(rename = "local_music_injector:add_folder")]
    AddFolder,
    #[serde(rename = "local_music_injector:remove_folder")]
    RemoveFolder,
    #[serde(rename = "local_music_injector:swap")]
    Swap,
    // rust to frontend
    #[serde(rename = "local_music_injector:reload")]
    Reload,
}

impl From<InjectEvent> for String {
    fn from(event: InjectEvent) -> Self {
        serde_json::to_string(&event).unwrap()
    }
}
