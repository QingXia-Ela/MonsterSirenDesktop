#[warn(non_snake_case)]
use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize, Debug)]
pub struct Config {
    pub enable: bool,
    pub url: String,
    pub backgroundOptions: Vec<SingleBackgroundOption>,
}

#[derive(Serialize, Deserialize, Debug)]
pub struct SingleBackgroundOption {
    pub pageName: String,
    pub opacity: u8,
    pub blur: u8,
}
