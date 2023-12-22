// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
#[tauri::command]
pub fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

#[tauri::command]
pub async fn open_devtools(window: tauri::Window) {
    // assert it because the method is exists but rc throw error said it not exists
    window.open_devtools();
}

#[tauri::command]
pub async fn change_tray_tooltip(app: tauri::AppHandle, tooltip: &str) -> Result<(), String> {
    match app.tray_handle_by_id("basic-tray") {
        Some(tray) => {
            if let Err(e) = tray.set_tooltip(tooltip) {
                return Err(e.to_string());
            }
        }
        None => {
            return Err("tray not found".to_string());
        }
    }
    Ok(())
}
