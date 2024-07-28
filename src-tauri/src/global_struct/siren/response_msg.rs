use serde::{Deserialize, Serialize};
use ts_rs::TS;

/// Monster Siren api response message wrapper
#[derive(Clone, Debug, Serialize, Deserialize, TS)]
pub struct ResponseMsg<T> {
    pub code: u32,
    pub msg: String,
    pub data: T,
}

impl<T> ResponseMsg<T> {
    pub fn new(code: u32, msg: String, data: T) -> Self {
        Self { code, msg, data }
    }
}

#[derive(serde::Serialize, serde::Deserialize)]
pub struct SongsReponse<T> {
    list: Vec<T>,
    autoplay: Option<bool>,
}

impl<T> SongsReponse<T> {
    pub fn new(list: Vec<T>, autoplay: Option<bool>) -> Self {
        Self { list, autoplay }
    }
}
