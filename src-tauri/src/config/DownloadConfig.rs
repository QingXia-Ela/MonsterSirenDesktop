use serde::{Deserialize, Serialize};

#[allow(non_snake_case)]
#[derive(Serialize, Deserialize, Debug)]
pub struct Config {
    pub path: String,
    pub downloadLrc: bool,
    pub parseFileType: String,
}
