use crate::vanilla_injector::{local_music_injector, template_injector};
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
    pub fn new(port: u16, cdn_port: u16, filter_rules: FilterType, app: tauri::AppHandle) -> Self {
        let s = vec![
            local_music_injector::get_injector(),
            template_injector::get_injector(),
            siren_injector::get_injector(),
        ];
        let mut injector_map: IndexMap<String, MusicInjector> = IndexMap::new();
        // init fn run only once
        for m in s.into_iter() {
            if let Some(f) = &m.init_fn {
                f(app.app_handle());
            }
            injector_map.insert(m.namespace.clone(), m);
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
pub fn spawn_api_proxy(app: &mut App) -> JoinHandle<()> {
    let handle_clone = app.handle().clone();
    thread::spawn(move || {
        let p = ApiProxy::new(11452, 11451, vec![], handle_clone);
        p.run();
    })
}
