// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
#[tauri::command]
pub fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

#[tauri::command]
pub fn open_devtools(win: tauri::Window) {
    // assert it because the method is exists but rc throw error said it not exists
    win.open_devtools();
}
