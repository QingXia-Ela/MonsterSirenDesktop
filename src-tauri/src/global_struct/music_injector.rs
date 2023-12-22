use super::siren::{Album, BriefAlbum, BriefSong, Song};
use async_trait::async_trait;

/// Music Inject trait
/// Use it to create a music injector
/// impl this trait should add `#[async_trait]` annotation
/// We impl `Send + Sync` because now it can use safe in async because we don't modify it in runtime, only call the methods.
/// todo!: finish all api
#[async_trait]
pub trait MusicInject: Send + Sync {
    async fn get_albums(&self) -> Vec<BriefAlbum>;
    async fn get_songs(&self) -> Vec<BriefSong>;
    async fn get_song(&self, id: String) -> Result<Song, reqwest::Error>;
    async fn get_album(&self, id: String) -> Result<Album, reqwest::Error>;
}

pub struct MusicInjector {
    /// injector request namespace, will use as only key in request
    pub namespace: String,
    pub request_interceptor: Box<dyn MusicInject>,
}

impl MusicInjector {
    pub fn new(namespace: String, request_interceptor: Box<dyn MusicInject>) -> Self {
        Self {
            namespace,
            request_interceptor,
        }
    }

    pub fn get_namespace(&self) -> &String {
        &self.namespace
    }
}
