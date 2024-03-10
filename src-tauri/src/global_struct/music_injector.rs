use std::sync::Arc;

use crate::plugin_error::PluginRequestError;

use super::siren::{Album, BriefAlbum, BriefSong, Song};
use async_trait::async_trait;
use futures::lock::Mutex;
use tauri::App;

/// Music Inject trait
/// Use it to create a music injector
/// impl this trait should add `#[async_trait]` annotation
/// We impl `Send + Sync` because now it can use safe in async because we don't modify it in runtime, only call the methods.
/// todo!: finish all api
#[async_trait]
pub trait MusicInject: Send + Sync {
    /// Show on playlist page.
    async fn get_albums(&self) -> Vec<BriefAlbum>;
    /// Show on vanilla siren page. **Usually return a empty array.**
    ///
    /// Sometimes maybe it return too many songs which will lead page performance be worst.
    async fn get_songs(&self) -> Vec<BriefSong>;
    /// Id will remove namespace
    async fn get_song(&self, id: String) -> Result<Song, PluginRequestError>;
    /// Id will remove namespace
    async fn get_album(&self, id: String) -> Result<Album, PluginRequestError>;
}

#[repr(C)]
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
    /// a js string running on frontend
    ///
    /// The js should be a module and export a default init function.
    ///
    /// Please read the documation for more infomation and learn the rules that need to know.
    pub frontend_js: Option<String>,
    pub request_interceptor: Box<dyn MusicInject>,
    pub init_fn: Option<Box<dyn Fn(tauri::AppHandle) + Send + Sync>>,
}

impl MusicInjector {
    pub fn new(
        namespace: String,
        cn_namespace: String,
        color: String,
        frontend_js: Option<String>,
        request_interceptor: Box<dyn MusicInject>,
    ) -> Self {
        Self {
            namespace,
            cn_namespace,
            color,
            frontend_js,
            request_interceptor,
            init_fn: None,
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
        T: Fn(tauri::AppHandle) + Send + Sync + 'static,
    {
        self.init_fn = Some(Box::new(func));
        self
    }
}
