use reqwest;
use warp;

#[derive(Debug)]
pub struct PluginRequestError {
    message: String,
}

impl PluginRequestError {
    pub fn new(message: String) -> Self {
        PluginRequestError { message }
    }
}

impl From<reqwest::Error> for PluginRequestError {
    fn from(value: reqwest::Error) -> Self {
        PluginRequestError {
            message: value.to_string(),
        }
    }
}

impl warp::reject::Reject for PluginRequestError {}
