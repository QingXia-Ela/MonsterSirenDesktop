// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use std::{fs, thread};

use futures::executor::block_on;
use monster_siren_desktop::proxy::Proxy;
use tauri::{Runtime, WindowBuilder};

// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

fn main() {
    // thread::spawn(|| {
    //     let p = Proxy::new("127.0.0.1:55938".parse().unwrap());
    //     p.start();
    // });

    let js = fs::read_to_string("inject.js").unwrap();

    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![greet])
        .setup(move |app| {
            let _ = WindowBuilder::new(
                app,
                "main",
                tauri::WindowUrl::App("https://monster-siren.hypergryph.com".into()),
            )
            .initialization_script(js.as_str())
            .build()?;

            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

//
// config
//      {
//     "label": "main",
//     "fullscreen": false,
//     "resizable": true,
//     "title": "MonsterSirenDesktop",
//     "minWidth": 1280,
//     "minHeight": 800,
//     "width": 1280,
//     "height": 800,
//     "decorations": false
//   }
//
