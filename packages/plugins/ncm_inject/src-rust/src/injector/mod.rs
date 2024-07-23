mod global_struct;
pub mod ncm_injector;
mod request_handler;
use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize)]
pub struct UidResponseWrapper<T> {
    code: u32,
    body: T,
}

#[derive(Serialize, Deserialize)]
pub struct OkUidReponseBody {
    uid: String,
}

#[derive(Serialize, Deserialize)]
pub struct ErrUidReponseBody {
    message: String,
}
