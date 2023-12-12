use crate::utils::get_main_window;

pub fn change_song(app: &tauri::AppHandle, direction: i8) {
    get_main_window(app)
        .emit("store:change_song", direction)
        .unwrap();
}
