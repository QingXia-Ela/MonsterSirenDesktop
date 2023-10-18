// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]
mod config;
mod proxy;
mod server;

use proxy::{
    ApiProxy::{self, spawn_api_proxy},
    CdnProxy::{self, get_basic_filter_rules, spawn_cdn_proxy, CdnProxyRules},
};
use server::spanw_file_server;
use tauri::{App, Manager};

// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
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
        // core_app.eval(js.as_str()).unwrap();
        // core_app.eval(inject_css().as_str()).unwrap();
        init(app);

        Ok(())
    });
    builder
        .invoke_handler(tauri::generate_handler![greet])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
