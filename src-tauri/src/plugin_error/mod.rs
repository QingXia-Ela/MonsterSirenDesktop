use reqwest::{self, StatusCode};
use serde::{Deserialize, Serialize};
use warp::{self, reply::Reply};

#[derive(Debug, Serialize, Deserialize)]
pub struct PluginRequestError {
    #[serde(rename = "msg")]
    message: String,
}

impl PluginRequestError {
    pub fn new(message: String) -> Self {
        PluginRequestError { message }
    }

    pub fn to_json(&self) -> String {
        serde_json::to_string(self).unwrap()
    }
}

impl From<PluginRequestError> for warp::reply::Response {
    fn from(value: PluginRequestError) -> Self {
        warp::reply::with_header(
            warp::reply::with_status(value.to_json(), StatusCode::INTERNAL_SERVER_ERROR),
            "Access-Control-Allow-Origin",
            "*",
        )
        .into_response()
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
