use config::Config as ConfigLib;
#[warn(non_snake_case)]
use std::{
    fs,
    io::{self, Error},
    path::PathBuf,
};

use serde::{Deserialize, Serialize};
mod AdvancementConfig;
mod BackgroundConfig;
mod constants;
use constants::INIT_CONFIG;

#[derive(Serialize, Deserialize, Debug)]
pub struct BaiscConfig {
    pub closeAutoPlay: bool,
    pub volume: u8,
}

#[derive(Serialize, Deserialize, Debug)]
pub struct Config {
    pub basic: BaiscConfig,
    pub background: BackgroundConfig::Config,
    pub advancement: AdvancementConfig::Config,
}

pub fn init_window_from_config(window: &mut tauri::Window, config: &Config) {
    // let main_window = app.get_window("main").unwrap();
    AdvancementConfig::init(window, &config.advancement);
}

/// Initialize and get the config file
pub fn init_config(path: String, filename: String) -> Config {
    let full_path = format!("{}\\{}", path, filename);
    // if path of file doesn't exist just create it
    if fs::metadata(&path).is_err() || fs::metadata(&full_path).is_err() {
        let _ = fs::create_dir(&path);
        fs::write(&full_path, INIT_CONFIG).unwrap();
    }

    let settings = ConfigLib::builder()
        .add_source(config::File::with_name(&full_path))
        .build()
        .unwrap();

    settings.try_deserialize::<Config>().unwrap()
}
