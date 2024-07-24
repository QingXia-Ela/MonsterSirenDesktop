use crate::global_event::frontend_notify::notify_error;
use crate::vanilla_injector::{custom_playlist_injector, local_music_injector, template_injector};
use futures::executor::block_on;
use indexmap::IndexMap;
use std::sync::Arc;
use std::{collections::HashSet, thread::JoinHandle};
use std::{fmt::Debug, net::SocketAddrV4, thread};
use tauri::{App, Manager};
use warp::Filter;

use crate::{
    global_struct::music_injector::MusicInjector,
    vanilla_injector::siren_injector::{self},
};

use super::handler::handle_request_with_plugin;

type FilterType = Vec<[&'static str; 2]>;

pub struct ApiProxy {
    port: u16,
    cdn_port: u16,
    filter_rules: FilterType,
    injector: Arc<IndexMap<String, MusicInjector>>,
}

impl ApiProxy {
    /// Create a new api proxy server
    ///
    /// **Warning**: This is a low level api.
    ///
    /// [siren api docs](https://github.com/QingXia-Ela/MonsterSirenApi/blob/main/docs/dev/%E6%8E%A5%E5%8F%A3%E4%B8%80%E8%A7%88.md)
    ///
    /// # Example
    /// ```
    /// thread::spawn(move || {
    ///   let _ = api_proxy::new(11452, 11451, vec![["content will be replace", "content will use"]]);
    /// })
    /// ```
    pub fn new(
        port: u16,
        cdn_port: u16,
        filter_rules: FilterType,
        app: tauri::AppHandle,
        injectors: Vec<MusicInjector>,
    ) -> Self {
        // basic injector
        let mut s = vec![
            #[cfg(debug_assertions)]
            template_injector::get_injector(app.clone()),
            custom_playlist_injector::get_injector(app.clone()),
            siren_injector::get_injector(app.clone()),
            local_music_injector::get_injector(app.clone()),
        ];
        injectors.into_iter().for_each(|i| s.push(i));
        let wating_injectors: Vec<String> = s.iter().map(|i| i.get_namespace()).collect();

        let mut injector_map: IndexMap<String, MusicInjector> = IndexMap::new();
        // init fn run only once
        for m in s.into_iter() {
            if let Some(f) = &m.init_fn {
                f(app.app_handle());
            }
            injector_map.insert(m.get_namespace(), m);
        }
        if wating_injectors.len() != injector_map.len() {
            let loaded_injectors: Vec<String> =
                injector_map.values().map(|i| i.get_namespace()).collect();
            let not_existing_injectors: Vec<String> = wating_injectors
                .into_iter()
                .filter(|i| !loaded_injectors.contains(i))
                .collect();
            let msg = format!(
                "一些播放器注入插件似乎未加载: {:?}。相关功能已被禁用",
                not_existing_injectors
            );
            println!("{:?}", msg);
            notify_error(&app, msg);
        }

        let arc_map = Arc::new(injector_map);
        let cloned_map = arc_map.clone();

        ApiProxy {
            port,
            cdn_port,
            filter_rules,
            injector: cloned_map,
        }
    }

    /// Run the api proxy server
    ///
    /// **Warning**: This method will block the current thread and consume itself.
    #[tokio::main]
    pub async fn run(self) {
        let proxy = warp::path::full()
            .and(warp::header::headers_cloned())
            // todo!: move to handle with plugin
            .and_then(move |p, r| {
                handle_request_with_plugin(
                    self.port,
                    self.cdn_port,
                    p,
                    r,
                    self.filter_rules.clone(),
                    self.injector.clone(),
                )
            });
        block_on(async {
            let addr: SocketAddrV4 = format!("127.0.0.1:{}", self.port).parse().unwrap();
            warp::serve(proxy).run(addr).await;
        });
    }
}

/// Spawn api proxy with a new thread.
///
/// Current time doesn't need to support high concurrency, so just create a new thread.
///
/// Inner method use tokio runtime.
pub fn spawn_api_proxy(app: tauri::AppHandle, injectors: Vec<MusicInjector>) -> JoinHandle<()> {
    let handle_clone = app;
    thread::spawn(move || {
        let p = ApiProxy::new(11452, 11451, vec![], handle_clone, injectors);
        p.run();
    })
}
