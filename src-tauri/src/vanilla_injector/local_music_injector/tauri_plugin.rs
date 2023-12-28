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

pub fn init<R: Runtime>(manager: LocalMusicManager) -> tauri::plugin::TauriPlugin<R> {
    tauri::plugin::Builder::new("local")
        .invoke_handler(tauri::generate_handler![add_folder, remove_folder])
        .setup(|app| {
            app.manage(manager);
            Ok(())
        })
        .build()
}
