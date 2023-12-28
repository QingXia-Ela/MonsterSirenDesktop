use super::LocalMusicManager;
use tauri::{AppHandle, Manager, Runtime, State};

#[tauri::command]
async fn add_folder<R: Runtime>(
    _app: AppHandle<R>,
    manager: State<'_, LocalMusicManager>,
    path: String,
) -> Result<(), String> {
    manager.add_folder(path).await;
    Ok(())
}

#[tauri::command]
async fn remove_folder<R: Runtime>(
    _app: AppHandle<R>,
    manager: State<'_, LocalMusicManager>,
    path: String,
) -> Result<(), String> {
    manager.remove_folder(path).await;
    Ok(())
}

#[tauri::command]
async fn swap<R: Runtime>(
    _app: AppHandle<R>,
    manager: State<'_, LocalMusicManager>,
    i1: usize,
    i2: usize,
) -> Result<(), String> {
    manager.swap(i1, i2).await;
    Ok(())
}

#[tauri::command]
async fn get_folders<R: Runtime>(
    _app: AppHandle<R>,
    manager: State<'_, LocalMusicManager>,
) -> Result<Vec<String>, String> {
    Ok(manager.get_folders().await)
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

// https://tauri.app/v1/guides/features/plugin
pub fn init<R: Runtime>(manager: LocalMusicManager) -> tauri::plugin::TauriPlugin<R> {
    tauri::plugin::Builder::new("local")
        .invoke_handler(tauri::generate_handler![
            add_folder,
            remove_folder,
            swap,
            hello_world,
            get_folders
        ])
        .setup(|app| {
            app.manage(manager);
            Ok(())
        })
        .build()
}
