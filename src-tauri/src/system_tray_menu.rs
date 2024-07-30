use std::sync::{Arc, Mutex};

use crate::global_event::{audio_instance, store};
use crate::global_utils::get_main_window;
use crate::plugin_manager::PluginManager;
use tauri::{CustomMenuItem, Manager, SystemTrayMenu};
use tauri::{SystemTray, SystemTrayEvent};

fn show_and_focus(app: &tauri::AppHandle) {
    let win = get_main_window(app);
    win.show().unwrap();
    win.set_focus().unwrap();
}

pub fn system_tray_event_handler(app: &tauri::AppHandle, event: SystemTrayEvent) {
    match event {
        SystemTrayEvent::LeftClick { .. } => {
            show_and_focus(app);
        }
        SystemTrayEvent::MenuItemClick { id, .. } => match id.as_str() {
            "quit" => {
                // app.manage(state)
                app.state::<Arc<Mutex<PluginManager>>>()
                    .lock()
                    .unwrap()
                    .kill_all_plugin();

                std::process::exit(0);
            }
            "show" => {
                show_and_focus(app);
            }
            "play_and_pause" => {
                audio_instance::play_and_pause(app);
            }
            "next" => {
                store::change_song(app, 1);
            }
            "prev" => {
                store::change_song(app, -1);
            }
            _ => (),
        },
        _ => (),
    }
}

pub fn get_app_menu() -> SystemTray {
    let id = "basic-tray";

    let mut tray_menu = SystemTrayMenu::new();

    let play_and_pause = CustomMenuItem::new("play_and_pause", "播放/暂停");
    let next = CustomMenuItem::new("next", "下一首");
    let prev = CustomMenuItem::new("prev", "上一首");
    let show = CustomMenuItem::new("show", "显示主界面");
    let quit = CustomMenuItem::new("quit", "退出");

    tray_menu = tray_menu
        .add_item(play_and_pause)
        .add_native_item(tauri::SystemTrayMenuItem::Separator)
        .add_item(prev)
        .add_item(next)
        .add_native_item(tauri::SystemTrayMenuItem::Separator)
        .add_item(show)
        .add_native_item(tauri::SystemTrayMenuItem::Separator)
        .add_item(quit);

    let tray = SystemTray::new()
        .with_menu(tray_menu)
        .with_id(id)
        .with_tooltip("Monster Siren Desktop App(alpha)");

    tray
}
