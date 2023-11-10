// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]
mod config;
mod proxy;
mod server;

use proxy::{ApiProxy::spawn_api_proxy, CdnProxy::spawn_cdn_proxy};
use server::spanw_file_server;
use tauri::{generate_handler, App, Manager, Runtime};

// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

#[tauri::command]
async fn open_devtools<R: Runtime>(
    app: tauri::AppHandle<R>,
    window: tauri::Window<R>,
) -> Result<(), String> {
    window.open_devtools();
    Ok(())
}

/// invoke on setup hook
///
/// stupid tauri app `app_data_dir` call fail!
fn init(app: &mut App) {
    let app_config = config::init_config(
        app.path_resolver()
            .app_data_dir()
            .unwrap()
            .join("config")
            .to_str()
            .unwrap()
            .to_string(),
        String::from("settings.json"),
    );
    spawn_cdn_proxy(&app_config);
    spawn_api_proxy();
    spanw_file_server();
}

fn main() {
    // init_config
    let builder = tauri::Builder::default().setup(move |app| {
        let core_app = app.get_window("main").unwrap();
        init(app);
        Ok(())
    });
    builder
        .invoke_handler(tauri::generate_handler![greet])
        .invoke_handler(generate_handler![open_devtools])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
