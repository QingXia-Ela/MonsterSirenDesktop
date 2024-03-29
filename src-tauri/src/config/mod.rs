use config::Config as ConfigLib;
#[warn(non_snake_case)]
use std::fs;

use serde::{Deserialize, Serialize};
#[allow(non_snake_case)]
mod AdvancementConfig;
#[allow(non_snake_case)]
mod BackgroundConfig;
#[allow(non_snake_case)]
mod DownloadConfig;
mod constants;
use constants::INIT_CONFIG;

#[allow(non_snake_case)]
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
    pub download: DownloadConfig::Config,
}

pub fn init_window_from_config(window: &mut tauri::Window, config: &Config) {
    // let main_window = app.get_window("main").unwrap();
    AdvancementConfig::init(window, &config.advancement);
}

/// Initialize and get the config file
/// `path` is `%app_data_dir%\\config`, and limit the scope of config to be only in `config` dir
pub fn init_config(path: String, filename: String) -> Config {
    let full_path = format!("{}\\{}", path, filename);
    // fix: app data dir doesn't exist
    // 管他还在不在，先试着创建先，假如创建和后续的写入失败就提示一下用户说会使用默认配置，或者后续可以考虑用注册表注册配置
    // todo!: 这里创建了 app 的根目录，可能需要移植到外面
    let _ = fs::create_dir(format!("{}\\{}", path, "../"));

    // if path of file doesn't exist just create it
    if fs::metadata(&path).is_err() || fs::metadata(&full_path).is_err() {
        let _ = fs::create_dir(&path);
        fs::write(&full_path, INIT_CONFIG).unwrap();
    }

    // todo!: init config do not need to write into file, instead use ConfigLib to read and read
    let default_config_path = format!("{}\\{}", path, "init.json");
    fs::write(&default_config_path, INIT_CONFIG).unwrap();

    let settings = ConfigLib::builder()
        .add_source(config::File::with_name(&default_config_path))
        .add_source(config::File::with_name(&full_path))
        .build()
        .unwrap();

    settings.try_deserialize::<Config>().unwrap()
}
