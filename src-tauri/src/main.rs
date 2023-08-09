// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use std::{fs, sync::mpsc, thread};

use monster_siren_desktop::logger::Logger;
use tauri::Manager;
use ws::connect;

// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

fn read_js() -> String {
    fs::read_to_string("inject.js").unwrap()
}

fn main() {
    let (sender, receiver) = mpsc::channel::<String>();
    let logger = Logger::new();

    let sender2 = sender.clone();

    thread::spawn(move || {
        let _ = connect("ws://127.0.0.1:30012", |out| {
            let c = &sender2;

            if let Ok(_) = out.send("Hello from tauri hmr") {
                // println!("Tauri HMR Websocket stablish at 127.0.0.1:30012");
                let _ = &logger.info("Tauri HMR Websocket stablish at 127.0.0.1:30012");
            }

            // 处理程序需要获取out的所有权，因此我们使用move
            move |msg: ws::Message| {
                // 处理在此连接上接收的消息

                c.send(msg.to_string()).unwrap();

                out.send("ok")
            }
        });
    });

    let js = fs::read_to_string("inject.js").unwrap();

    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![greet])
        .setup(move |app| {
            let core_app = app.get_window("main").unwrap();
            core_app.eval(js.as_str()).unwrap();

            thread::spawn(move || {
                for event in receiver {
                    match event.as_str() {
                        "inject" => {
                            let _ = core_app.eval(read_js().as_str()).unwrap();
                            println!()
                        }
                        _ => println!("Unknown event: {}", event),
                    }
                }
            });

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
