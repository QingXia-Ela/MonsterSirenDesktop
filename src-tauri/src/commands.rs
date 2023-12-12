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
