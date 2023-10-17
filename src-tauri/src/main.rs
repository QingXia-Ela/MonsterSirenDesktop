// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]
mod config;

use std::thread::{self, JoinHandle};

// use config::init_config;
use monster_siren_desktop::proxy::{
    ApiProxy,
    CdnProxy::{self, get_basic_filter_rules, CdnProxyRules},
};
use tauri::{App, Manager};

// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

fn spawn_cdn_proxy() -> JoinHandle<()> {
    thread::spawn(|| {
        CdnProxy::CdnProxy::new(
            11451,
            11452,
            get_basic_filter_rules(vec![
                CdnProxyRules::PreventAutoplay,
                CdnProxyRules::LogStoreChange,
            ]),
        );
    })
}

fn spawn_api_proxy() -> JoinHandle<()> {
    thread::spawn(|| {
        ApiProxy::ApiProxy::new(11452, 11451, vec![]);
    })
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
    spawn_cdn_proxy();
    spawn_api_proxy();
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
