// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use std::{fs, sync::mpsc, thread};

use monster_siren_desktop::proxy::{
    ApiProxy,
    CdnProxy::{self, get_basic_filter_rules, CdnProxyRules},
};
use tauri::Manager;

// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

fn main() {
    thread::spawn(|| {
        CdnProxy::CdnProxy::new(
            11451,
            get_basic_filter_rules(vec![CdnProxyRules::PreventAutoplay]),
        );
    });
    thread::spawn(|| {
        ApiProxy::ApiProxy::new(11452, vec![]);
    });
    tauri::Builder::default()
        .setup(move |app| {
            let core_app = app.get_window("main").unwrap();
            // core_app.eval(js.as_str()).unwrap();
            // core_app.eval(inject_css().as_str()).unwrap();

            Ok(())
        })
        .invoke_handler(tauri::generate_handler![greet])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
