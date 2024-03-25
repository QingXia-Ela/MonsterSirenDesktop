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

#[derive(Debug)]
pub struct PluginError {
    message: String,
}

impl PluginError {
    pub fn new(message: String) -> Self {
        PluginError { message }
    }
}

impl From<std::io::Error> for PluginError {
    fn from(value: std::io::Error) -> Self {
        PluginError {
            message: value.to_string(),
        }
    }
}

impl warp::reject::Reject for PluginRequestError {}
