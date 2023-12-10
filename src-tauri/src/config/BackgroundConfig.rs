use serde::{Deserialize, Serialize};

#[allow(non_snake_case)]
#[derive(Serialize, Deserialize, Debug)]
pub struct Config {
    pub enable: bool,
    pub url: String,
    pub backgroundOptions: Vec<SingleBackgroundOption>,
}

#[allow(non_snake_case)]
#[derive(Serialize, Deserialize, Debug)]
pub struct SingleBackgroundOption {
    pub pageName: String,
    pub opacity: u8,
    pub blur: u8,
}
