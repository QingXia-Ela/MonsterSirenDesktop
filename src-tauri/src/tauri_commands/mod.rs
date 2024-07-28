use std::sync::{Arc, Mutex};

use indexmap::IndexMap;
use tauri::{generate_handler, Manager};

use crate::{
    global_struct::music_injector::{MusicInjector, MusicInjectorMetadata},
    logger::debug,
    plugin_manager::PluginManager,
};

// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
#[tauri::command]
pub fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

#[tauri::command]
pub fn open_devtools(window: tauri::Window) {
    // assert it because the method is exists but rc throw error said it not exists
    window.open_devtools();
}

#[tauri::command]
pub fn change_tray_tooltip(app: tauri::AppHandle, tooltip: &str) -> Result<(), String> {
    match app.tray_handle_by_id("basic-tray") {
        Some(tray) => {
            if let Err(e) = tray.set_tooltip(tooltip.trim()) {
                return Err(e.to_string());
            }
        }
        None => {
            return Err("tray not found".to_string());
        }
    }
    Ok(())
}

#[tauri::command]
pub fn get_all_injector_metadata(app: tauri::AppHandle) -> Vec<MusicInjectorMetadata> {
    let injector_map = app.state::<Arc<IndexMap<String, MusicInjector>>>();
    injector_map.iter().map(|x| x.1.get_metadata()).collect()
    // let x = match manager.lock() {
    //     Ok(x) => x.get_all_injector_metadata(),
    //     Err(_) => vec![]
    // };
    // #[cfg(debug_assertions)]
    // debug(format!("get_all_injector_metadata: {:?}", x).as_str());
    // x
}
