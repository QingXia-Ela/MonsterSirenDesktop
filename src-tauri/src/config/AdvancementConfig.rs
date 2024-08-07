use serde::{Deserialize, Serialize};
// use tauri::{Manager, Runtime};

#[allow(non_snake_case)]
#[derive(Debug, Serialize, Deserialize)]
pub struct Config {
    pub enable: bool,
    pub cdnProxyPort: u16,
    pub apiProxyPort: u16,
    pub logStore: bool,
    pub allowContextMenu: bool,
    pub allowRefreshPage: bool,
}

pub fn init(main_window: &mut tauri::Window, config: &Config) {
    if config.logStore {
        main_window
            .eval("window.siren_config.log_store = true")
            .unwrap();
    }
}
