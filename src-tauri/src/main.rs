// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]
extern crate lazy_static;
#[allow(non_snake_case)]
mod Logger;
mod client_env;
mod client_path;
mod config;
pub mod constants;
mod global_enum;
mod global_event;
mod global_struct;
mod global_utils;
mod plugin_error;
mod plugin_manager;
mod proxy;
mod server;
mod system_tray_menu;
mod tauri_commands;
pub mod vanilla_injector;

use proxy::{api_proxy::spawn_api_proxy, cdn_proxy::spawn_cdn_proxy};
use server::file_server::spawn_file_server;
use tauri::*;

/// invoke on setup hook
///
/// stupid tauri app `app_data_dir` call fail!
fn init(app: tauri::AppHandle) {
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

    // Use box to make manager has 'static lifetime, DO NOT REMOVE BOX::LEAK and Box::NEW
    // todo!: 取消内存泄露的方式来防止被回收
    let plugin_manager = Box::leak(Box::new(plugin_manager::PluginManager::new(
        app.app_handle(),
    )));
    let _ = plugin_manager.start();
    config::init_window_from_config(&mut main_window, &app_config);
    spawn_file_server(11453, None);
    spawn_cdn_proxy(&app_config);
    spawn_api_proxy(app.app_handle(), plugin_manager.get_all_injector());
    // here drop some memory which is still usage and cause 0xc0000005
}

fn main() {
    // init_config
    let builder = tauri::Builder::default().setup(move |app| {
        let core_app = app.get_window("main").unwrap();
        core_app.eval("window.siren_config = {}").unwrap();
        init(app.handle());
        Logger::info("App init finished");
        Ok(())
    });
    builder
        .system_tray(system_tray_menu::get_app_menu())
        .on_system_tray_event(system_tray_menu::system_tray_event_handler)
        .invoke_handler(generate_handler![
            tauri_commands::open_devtools,
            tauri_commands::greet,
            tauri_commands::change_tray_tooltip
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
