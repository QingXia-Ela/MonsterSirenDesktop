pub enum DownloadError {
    RequestError(reqwest::Error),
    IOError(std::io::Error),
}

impl From<reqwest::Error> for DownloadError {
    fn from(err: reqwest::Error) -> Self {
        Self::RequestError(err)
    }
}

impl From<std::io::Error> for DownloadError {
    fn from(err: std::io::Error) -> Self {
        Self::IOError(err)
    }
}
