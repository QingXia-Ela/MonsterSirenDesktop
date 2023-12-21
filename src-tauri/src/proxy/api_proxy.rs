use crate::proxy::handler::handle_request;
use futures::executor::block_on;
use std::{collections::HashMap, fmt::Debug, net::SocketAddrV4, thread};
use std::{collections::HashSet, thread::JoinHandle};
use warp::Filter;

use crate::{
    global_struct::music_injector::MusicInjector,
    vanilla_injector::siren_injector::{self},
};

const SIREN_WEBSITE: &str = "https://monster-siren.hypergryph.com";

type FilterType = Vec<[&'static str; 2]>;

pub struct ApiProxy;

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
    /// `
    #[tokio::main]
    pub async fn new(port: u16, cdn_port: u16, filter_rules: FilterType) -> Self {
        let s = vec![siren_injector::get_injector()];
        let mut injector_map: HashMap<String, MusicInjector> = HashMap::new();
        // run only once
        for m in s.into_iter() {
            injector_map.insert(m.namespace.clone(), m);
        }
        let proxy = warp::path::full()
            .and(warp::header::headers_cloned())
            // todo!: move to handle with plugin
            .and_then(move |p, r| handle_request(port, cdn_port, p, r, filter_rules.clone()));
        block_on(async {
            let addr: SocketAddrV4 = format!("127.0.0.1:{}", port).parse().unwrap();
            warp::serve(proxy).run(addr).await;
        });
        ApiProxy {}
    }
}

#[derive(Debug, Eq, PartialEq, Hash)]
pub enum ApiProxyRules {}

pub fn get_basic_filter_rules(mut settings: Vec<ApiProxyRules>) -> FilterType {
    let mut rules = vec![];
    let settings = settings
        .into_iter()
        .collect::<HashSet<_>>()
        .into_iter()
        .collect::<Vec<_>>();

    for v in settings {
        match v {
            _ => (),
        }
    }

    rules
}

pub fn spawn_api_proxy() -> JoinHandle<()> {
    thread::spawn(|| {
        ApiProxy::new(11452, 11451, vec![]);
    })
}
