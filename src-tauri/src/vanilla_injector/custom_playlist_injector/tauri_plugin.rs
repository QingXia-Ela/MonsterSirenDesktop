use crate::global_event::frontend_notify::*;

use super::manager::CustomPlaylistManager;
use tauri::{AppHandle, Manager, Runtime, State};

pub fn init<R: Runtime>(manager: CustomPlaylistManager) -> tauri::plugin::TauriPlugin<R> {
    tauri::plugin::Builder::new("playlist")
        .invoke_handler(tauri::generate_handler![
            // add_folder,
            // remove_folder,
            // swap,
            // hello_world,
            // get_folders
        ])
        .setup(|app| {
            app.manage(manager);
            Ok(())
        })
        .build()
}
