use tauri::Manager;

pub fn get_main_window(app: &tauri::AppHandle) -> tauri::Window {
    app.get_window("main").unwrap()
}
