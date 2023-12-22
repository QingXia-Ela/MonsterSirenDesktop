use crate::global_utils::get_main_window;

pub fn play_and_pause(app: &tauri::AppHandle) {
    get_main_window(app)
        .emit("audio_instance:play_and_pause", ())
        .unwrap();
}
