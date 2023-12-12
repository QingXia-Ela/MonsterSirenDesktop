// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]
mod commands;
mod config;
mod global_event;
mod proxy;
mod server;
mod system_tray_menu;
mod utils;

use proxy::{api_proxy::spawn_api_proxy, cdn_proxy::spawn_cdn_proxy};
use server::spanw_file_server;
use tauri::*;

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
    let mut main_window = app.get_window("main").unwrap();
    config::init_window_from_config(&mut main_window, &app_config);
    spawn_cdn_proxy(&app_config);
    spawn_api_proxy();
    spanw_file_server();
}

fn main() {
    // init_config
    let builder = tauri::Builder::default().setup(move |app| {
        let core_app = app.get_window("main").unwrap();
        core_app.eval("window.siren_config = {}").unwrap();
        init(app);
        Ok(())
    });
    builder
        .system_tray(system_tray_menu::get_app_menu())
        .on_system_tray_event(system_tray_menu::system_tray_event_handler)
        .invoke_handler(generate_handler![commands::open_devtools, commands::greet])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
