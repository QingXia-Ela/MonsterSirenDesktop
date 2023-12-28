use tauri::Runtime;

use crate::global_utils::get_main_window;
pub fn notify_error<R: Runtime>(app: &tauri::AppHandle<R>, message: String) {
    get_main_window(app).emit("notify:error", message).unwrap()
}

pub fn notify_info<R: Runtime>(app: &tauri::AppHandle<R>, message: String) {
    get_main_window(app).emit("notify:info", message).unwrap()
}

pub fn notify_warning<R: Runtime>(app: &tauri::AppHandle<R>, message: String) {
    get_main_window(app)
        .emit("notify:warning", message)
        .unwrap()
}

pub fn notify_success<R: Runtime>(app: &tauri::AppHandle<R>, message: String) {
    get_main_window(app)
        .emit("notify:success", message)
        .unwrap()
}
