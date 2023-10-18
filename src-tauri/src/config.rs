#[warn(non_snake_case)]
use std::{
    fs,
    io::{self, Error},
    path::PathBuf,
};

use serde::{Deserialize, Serialize};

/// sync with `src/public/init_config.json`
const INIT_CONFIG: &str = r#"{
    "basic": {
      "closeAutoPlay": true,
      "volume": 20
    },
    "background": {
      "enable": false,
      "url": "",
      "blur": 0,
      "maskOpacity": 0
    },
    "localMusic": {
      "enable": false,
      "paths": []
    },
    "download": {
      "path": "",
      "downloadLrc": false,
      "parseFileType": "none"
    },
    "outputDevice": {},
    "desktopLrc": {},
    "advanced": {
      "enable": false,
      "cdnProxyPort": 0,
      "apiProxyPort": 0
    }
  }"#;

#[derive(Serialize, Deserialize, Debug)]
pub struct BaiscConfig {
    pub closeAutoPlay: bool,
    pub volume: u8,
}

#[derive(Serialize, Deserialize, Debug)]
pub struct Config {
    pub basic: BaiscConfig,
}

pub fn get_config(raw_json: &String) -> Result<Config, Error> {
    let parsed: Config = serde_json::from_str(raw_json)?;
    Ok(parsed)
}

/// Initialize and get the config file
pub fn init_config(path: String, filename: String) -> Config {
    let full_path = format!("{}\\{}", path, filename);
    if fs::metadata(&path).is_err() || fs::metadata(&full_path).is_err() {
        let _ = fs::create_dir(&path);
    }

    let raw_json = fs::read_to_string(&full_path).unwrap();
    let config = get_config(&raw_json);
    match config {
        Ok(cfg) => cfg,
        Err(_) => {
            fs::write(&full_path, INIT_CONFIG).unwrap();
            get_config(&String::from(INIT_CONFIG)).unwrap()
        }
    }
    // println!("config: {:?}", config);
}
