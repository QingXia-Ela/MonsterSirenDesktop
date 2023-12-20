/// Monster Siren api response message wrapper
#[derive(serde::Serialize, serde::Deserialize, Debug)]
pub struct ResponseMsg<T> {
    pub code: u32,
    pub msg: String,
    pub data: T,
}
