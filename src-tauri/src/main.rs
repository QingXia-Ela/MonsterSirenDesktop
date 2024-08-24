// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]
extern crate lazy_static;
mod client_env;
pub mod client_path;
mod config;
pub mod constants;
mod global_enum;
mod global_event;
mod global_struct;
mod global_utils;
#[allow(non_snake_case)]
mod logger;
mod plugin_error;
mod plugin_manager;
mod proxy;
mod server;
mod system_tray_menu;
mod tauri_commands;
pub mod vanilla_injector;

use logger::debug;
use plugin_manager::PluginManager;
use proxy::{api_proxy::spawn_api_proxy, cdn_proxy::spawn_cdn_proxy};
use server::file_server::spawn_file_server;
use std::sync::{Arc, Mutex};
use tauri::*;

/// invoke on setup hook
///
/// stupid tauri app `app_data_dir` call fail!
fn init(app: tauri::AppHandle) -> Arc<Mutex<PluginManager>> {
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

    let mut plugin_manager = PluginManager::new(app.app_handle());
    let _ = plugin_manager.start();
    config::init_window_from_config(&mut main_window, &app_config);
    spawn_file_server(11453, None);
    spawn_cdn_proxy(app.app_handle(), &app_config);
    spawn_api_proxy(app.app_handle(), plugin_manager.get_all_injector());
    let arc_manager = Arc::new(Mutex::new(plugin_manager));
    app.manage(Arc::clone(&arc_manager));
    // here drop some memory which is still usage and cause 0xc0000005
    arc_manager
}

fn main() {
    // init_config
    let builder = tauri::Builder::default().setup(move |app| {
        let core_app = app.get_window("main").unwrap();
        core_app.eval("window.siren_config = {}").unwrap();
        init(app.handle());
        logger::info("App init finished");
        Ok(())
    });
    builder
        .system_tray(system_tray_menu::get_app_menu())
        .on_system_tray_event(system_tray_menu::system_tray_event_handler)
        .invoke_handler(generate_handler![
            tauri_commands::open_devtools,
            tauri_commands::greet,
            tauri_commands::change_tray_tooltip,
            tauri_commands::get_all_injector_metadata
        ])
        .on_window_event(move |event| match event.event() {
            //  Destroyed is trigger on window close, hide to system tray is trigger on other event
            WindowEvent::Destroyed => {
                let app = event.window().app_handle();
                // todo!: optimize this
                app.state::<Arc<Mutex<PluginManager>>>()
                    .lock()
                    .unwrap()
                    .kill_all_plugin();
                #[cfg(debug_assertions)]
                debug("destroyed");
            }
            _e => {
                // #[cfg(debug_assertions)]
                // debug(format!("event: {:?}", e).as_str());
            }
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
    println!("end");
    std::process::exit(0);
}
