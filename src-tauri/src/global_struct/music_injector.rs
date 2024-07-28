use std::fmt::Debug;

use super::siren::{Album, BriefAlbum, BriefSong, Song};
use crate::plugin_error::PluginRequestError;
use async_trait::async_trait;
use serde::{Deserialize, Serialize};

/// Music Inject trait
/// Use it to create a music injector
/// impl this trait should add `#[async_trait]` annotation
///
/// **注意**：由于早期架构问题，你的 injector 在使用时会被拷贝多份，所以当你需要共享一些全局变量如登录凭据时，你可能需要使用 `lazy_static!` 库来辅助你控制全局变量的生命周期
///
/// 你的数据需要使用 async_lock 以防止死锁或数据竞争
///
/// 或者对于你实现了 MusicInject 特征的结构体传入一个 `Arc<Mutex<T>>` 的全局唯一引用来在多个注入之间共享相同数据，同时要注意死锁问题
///
// todo!: finish all api
// todo!: 取消 injector 的拷贝行为，全局仅仅引用一份
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
#[derive(Clone, Debug, Serialize, Deserialize)]
pub struct MusicInjectorMetadata {
    pub namespace: String,
    #[serde(rename = "cnNamespace")]
    pub cn_namespace: String,
    pub color: String,
}

#[repr(C)]
pub struct MusicInjector {
    /// tauri app handle
    pub app: tauri::AppHandle,
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

impl Debug for MusicInjector {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        f.debug_struct("MusicInjector")
            .field("namespace", &self.namespace)
            .field("cn_namespace", &self.cn_namespace)
            .field("color", &self.color)
            .field("frontend_js", &self.frontend_js)
            .finish()
    }
}

impl MusicInjector {
    pub fn new(
        app: tauri::AppHandle,
        namespace: String,
        cn_namespace: String,
        color: String,
        frontend_js: Option<String>,
        request_interceptor: Box<dyn MusicInject>,
    ) -> Self {
        Self {
            app,
            namespace,
            cn_namespace,
            color,
            frontend_js,
            request_interceptor,
            init_fn: None,
        }
    }

    pub fn get_metadata(&self) -> MusicInjectorMetadata {
        MusicInjectorMetadata {
            namespace: self.namespace.clone(),
            cn_namespace: self.cn_namespace.clone(),
            color: self.color.clone(),
        }
    }

    pub fn get_namespace(&self) -> String {
        self.namespace.clone()
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
