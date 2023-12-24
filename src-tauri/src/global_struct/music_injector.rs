use super::siren::{Album, BriefAlbum, BriefSong, Song};
use async_trait::async_trait;
use tauri::App;

/// Music Inject trait
/// Use it to create a music injector
/// impl this trait should add `#[async_trait]` annotation
/// We impl `Send + Sync` because now it can use safe in async because we don't modify it in runtime, only call the methods.
/// todo!: finish all api
#[async_trait]
pub trait MusicInject: Send + Sync {
    async fn get_albums(&self) -> Vec<BriefAlbum>;
    async fn get_songs(&self) -> Vec<BriefSong>;
    /// Id will remove namespace
    async fn get_song(&self, id: String) -> Result<Song, reqwest::Error>;
    /// Id will remove namespace
    async fn get_album(&self, id: String) -> Result<Album, reqwest::Error>;
}

pub struct MusicInjector {
    /// injector request namespace, will use as only key in request
    pub namespace: String,
    /// cn namespace, will use at the place where need cn translate.
    pub cn_namespace: String,
    /// a theme color, provide to frontend.
    ///
    /// For example:
    ///
    /// `"#ff0000"` or `"rgb(255,0,0)"`
    ///
    /// it will use in css directly
    pub color: String,
    pub request_interceptor: Box<dyn MusicInject>,
    pub init_fn: Option<dyn FnOnce(&mut App)>
}

impl MusicInjector {
    pub fn new(
        namespace: String,
        cn_namespace: String,
        color: String,
        request_interceptor: Box<dyn MusicInject>,
    ) -> Self {
        Self {
            namespace,
            cn_namespace,
            color,
            request_interceptor,
            init_fn: None
        }
    }

    pub fn get_namespace(&self) -> &String {
        &self.namespace
    }

    /// The app init hook.
    ///
    /// Call when app start running.
    ///
    /// This hook only apply one function.
    pub fn on_init<T>(&mut self, func: T) -> &Self
    where
        T: FnOnce(&mut App)
    {
        self.init_fn = func;
        self
    }
}
