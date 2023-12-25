use crate::global_utils::get_main_window;
pub fn notify_error(app: &tauri::AppHandle, message: String) {
    get_main_window(app).emit("notify:error", message).unwrap()
}

pub fn notify_info(app: &tauri::AppHandle, message: String) {
    get_main_window(app).emit("notify:info", message).unwrap()
}

pub fn notify_warning(app: &tauri::AppHandle, message: String) {
    get_main_window(app)
        .emit("notify:warning", message)
        .unwrap()
}
