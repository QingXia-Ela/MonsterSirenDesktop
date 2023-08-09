// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use std::{fs, sync::mpsc, thread};

use tauri::WindowBuilder;
use ws::listen;

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

    let sender2 = sender.clone();

    thread::spawn(move || {
        let _ = listen("127.0.0.1:30012", |out| {
            println!("HMR Websocket connecting...");
            let c = &sender2;

            // 处理程序需要获取out的所有权，因此我们使用move
            move |msg: ws::Message| {
                // 处理在此连接上接收的消息
                println!("Client 收到消息 '{}'. ", msg);

                c.send(msg.to_string()).unwrap();

                out.send("ok")
            }
        });
    });

    let js = fs::read_to_string("inject.js").unwrap();

    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![greet])
        .setup(move |app| {
            let core_app = WindowBuilder::new(
                app,
                "main",
                tauri::WindowUrl::App("https://monster-siren.hypergryph.com".into()),
            )
            .initialization_script(js.as_str())
            .build()?;

            thread::spawn(move || {
                for event in receiver {
                    match event.as_str() {
                        "inject" => {
                            let _ = &core_app.eval(read_js().as_str()).unwrap();
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
