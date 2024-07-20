use super::{manager::CustomPlaylistManager, pub_struct::SinglePlaylistInfo};
use crate::global_struct::siren::BriefSong;
use tauri::{AppHandle, Manager, Runtime, State};

#[tauri::command]
#[monster_siren_macro::command_ts_export("playlist")]
async fn add_playlist<R: Runtime>(
    app: tauri::AppHandle<R>,
    manager: State<'_, CustomPlaylistManager>,
    name: String,
) -> Result<(), String> {
    manager.add_playlist(name).await;
    Ok(())
}

#[tauri::command]
#[monster_siren_macro::command_ts_export("playlist")]
async fn remove_playlist<R: Runtime>(
    app: tauri::AppHandle<R>,
    manager: State<'_, CustomPlaylistManager>,
    playlist_id: String,
) -> Result<(), String> {
    manager.remove_playlist(playlist_id).await;
    Ok(())
}

#[tauri::command]
async fn update_playlist<R: Runtime>(
    app: tauri::AppHandle<R>,
    manager: State<'_, CustomPlaylistManager>,
) -> Result<(), String> {
    // manager.upda
    // Ok(())
    Err("not implement".into())
}

#[tauri::command]
#[monster_siren_macro::command_ts_export("playlist")]
async fn get_playlist<R: Runtime>(
    app: tauri::AppHandle<R>,
    manager: State<'_, CustomPlaylistManager>,
    playlist_id: String,
) -> Result<SinglePlaylistInfo, String> {
    match manager.get_playlist(playlist_id).await {
        Some(playlist) => Ok(playlist),
        None => Err("not found".into()),
    }
}

#[tauri::command]
#[monster_siren_macro::command_ts_export("playlist")]
async fn add_song_to_playlist<R: Runtime>(
    app: tauri::AppHandle<R>,
    manager: State<'_, CustomPlaylistManager>,
    playlist_id: String,
    song: BriefSong,
) -> Result<(), String> {
    manager.add_song(playlist_id, song).await;
    Ok(())
}

#[tauri::command]
#[monster_siren_macro::command_ts_export("playlist")]
async fn remove_song_from_playlist<R: Runtime>(
    app: tauri::AppHandle<R>,
    manager: State<'_, CustomPlaylistManager>,
    playlist_id: String,
    song_cid: String,
) -> Result<(), String> {
    manager.remove_song(playlist_id, song_cid).await;
    Ok(())
}

#[tauri::command]
#[monster_siren_macro::command_ts_export("playlist")]
async fn update_songs_in_playlist<R: Runtime>(
    app: tauri::AppHandle<R>,
    manager: State<'_, CustomPlaylistManager>,
    playlist_id: String,
    songs: Vec<BriefSong>,
) -> Result<(), String> {
    manager.update_songs(playlist_id, songs).await;
    Ok(())
}

#[tauri::command]
#[monster_siren_macro::command_ts_export("playlist")]
async fn get_all_playlists<R: Runtime>(
    app: tauri::AppHandle<R>,
    manager: State<'_, CustomPlaylistManager>,
) -> Result<Vec<SinglePlaylistInfo>, String> {
    Ok(manager.get_all_playlists().await)
}

#[tauri::command]
#[monster_siren_macro::command_ts_export("playlist")]
async fn update_song<R: Runtime>(
    app: tauri::AppHandle<R>,
    manager: State<'_, CustomPlaylistManager>,
    playlist_id: String,
    old_song_cid: String,
    new_song: BriefSong,
) -> Result<(), String> {
    manager
        .update_song(playlist_id, old_song_cid, new_song)
        .await;
    Ok(())
}

#[tauri::command]
#[monster_siren_macro::command_ts_export("playlist")]
async fn get_song<R: Runtime>(
    app: tauri::AppHandle<R>,
    manager: State<'_, CustomPlaylistManager>,
    playlist_id: String,
    cid: String,
) -> Result<BriefSong, String> {
    match manager.get_song(playlist_id, cid).await {
        Some(song) => Ok(song),
        None => Err("not found".into()),
    }
}

#[tauri::command]
#[monster_siren_macro::command_ts_export("playlist")]
async fn update_playlist_metadata<R: Runtime>(
    app: tauri::AppHandle<R>,
    manager: State<'_, CustomPlaylistManager>,
    playlist_id: String,
    metadata: SinglePlaylistInfo,
) -> Result<(), String> {
    manager
        .update_playlist_metadata(playlist_id, metadata)
        .await;
    Ok(())
}

#[tauri::command]
/// Return "Hello, world!"
///
/// # Example
///
/// ```tsx
/// import { invoke } from "@tauri-apps/api"
///
/// // plugin namespace is "local"
/// invoke("plugin:local|hello_world").then((res) => console.log(res))
/// ```
fn hello_world<R: Runtime>(_app: AppHandle<R>) -> Result<String, String> {
    Ok(String::from("Hello, world!"))
}

pub fn init<R: Runtime>(manager: CustomPlaylistManager) -> tauri::plugin::TauriPlugin<R> {
    tauri::plugin::Builder::new("playlist")
        .invoke_handler(tauri::generate_handler![
            add_playlist,
            remove_playlist,
            update_playlist,
            get_playlist,
            add_song_to_playlist,
            remove_song_from_playlist,
            update_songs_in_playlist,
            update_song,
            get_song,
            get_all_playlists,
            update_playlist_metadata,
            hello_world
        ])
        .setup(|app| {
            app.manage(manager);
            Ok(())
        })
        .build()
}
