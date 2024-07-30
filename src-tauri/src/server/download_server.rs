mod download_error;

use std::{collections::HashMap, sync::Arc};
// use std::hash::
use reqwest::{Client};
use serde::{Deserialize, Serialize};
use tokio::time::Instant;

#[derive(Serialize, Deserialize, Debug, Clone, Copy)]
pub enum DownloadState {
    Waiting,
    Downloading,
    Completed,
    Failed,
    Pause,
    Canceled,
}

pub struct FileDownloader {
    url: String,
    save_path: String,
    client: Arc<Client>,
    content_length: u64,
    downloaded_bytes: u64,
    speed: u64,
    data: Vec<u8>,
    // pub auth_header: Option<HashMap<String, String>>,
    state: DownloadState,
}

struct FileDownloadProgress {
    state: DownloadState,
    content_length: u64,
    downloaded_bytes: u64,
    /// number between 0 and 1
    precentage: f64,
    speed: u64,
}

impl FileDownloader {
    fn new(url: String, save_path: String, client: Arc<Client>) -> Self {
        Self {
            url,
            save_path,
            client,
            content_length: 0,
            downloaded_bytes: 0,
            speed: 0,
            data: Vec::new(),
            state: DownloadState::Waiting,
        }
    }
    #[tokio::main]
    async fn start(&mut self) -> Result<(), download_error::DownloadError> {
        let req = self.client.request(reqwest::Method::GET, &self.url);
        let mut res = req
            .header(
                reqwest::header::RANGE,
                format!("bytes={}-", self.downloaded_bytes),
            )
            .send()
            .await?;

        match res.status() {
            reqwest::StatusCode::OK => {
                self.state = DownloadState::Downloading;
                if let Some(content_length) = res.content_length() {
                    self.content_length = content_length;
                } else {
                    self.state = DownloadState::Failed;
                }
            }
            _ => {
                self.state = DownloadState::Failed;
            }
        };

        let mut downloaded: u64 = 0;
        self.data = Vec::new();

        while let Some(c) = res.chunk().await? {
            downloaded += c.len() as u64;
            self.data.extend_from_slice(&c);

            let elapsed = Instant::now().elapsed().as_secs_f32();
            self.speed = (c.len() as f32 / elapsed) as u64;
            self.downloaded_bytes = downloaded;
        }

        self.state = DownloadState::Completed;

        tokio::fs::write(&self.save_path, &self.data).await?;

        Ok(())
    }

    fn get_progress(&self) -> FileDownloadProgress {
        FileDownloadProgress {
            state: self.state,
            content_length: self.content_length,
            downloaded_bytes: self.downloaded_bytes,
            precentage: self.downloaded_bytes as f64 / self.content_length as f64,
            speed: self.speed,
        }
    }

    #[tokio::main]
    async fn pause(&mut self) {
        self.state = DownloadState::Pause;

        // TODO: Send a pause request
    }

    #[tokio::main]
    async fn cancel(&mut self) {
        self.state = DownloadState::Canceled;

        // TODO: Send a cancel request
    }
}

pub struct DownloadServer {
    /// the path to save the downloaded file, need to set file name manually and with extension
    save_path: String,
    client: Arc<Client>,
    max_concurrent_downloads: u8,
    map: HashMap<String, FileDownloader>,
}

impl DownloadServer {
    pub fn new(max_concurrent_downloads: u8, save_path: String) -> Self {
        Self {
            save_path,
            client: Arc::new(Client::new()),
            max_concurrent_downloads,
            map: HashMap::new(),
        }
    }

    #[tokio::main]
    pub async fn download_file(&mut self, url: String) -> Result<(), reqwest::Error> {
        let client = self.client.clone();

        self.map.insert(
            url.to_string(),
            FileDownloader::new(url, self.save_path.clone(), client),
        );

        Ok(())
    }
}
