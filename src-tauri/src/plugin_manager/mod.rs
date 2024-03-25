mod plugin_instance;
mod plugin_utils;

use libloading::Library;
use plugin_utils::*;
use std::{
    collections::HashMap,
    io::{self, Write},
};

use crate::{
    global_struct::music_injector::MusicInjector,
    plugin_error::{PluginError, PluginRequestError},
    Logger,
};

extern crate libloading;

pub struct PluginManager {
    pub app: tauri::AppHandle,
    pub support_node: bool,
    pub plugin_map: HashMap<String, plugin_instance::PluginInstance>,
}

impl PluginManager {
    pub fn new(app: tauri::AppHandle) -> Self {
        // detect node
        let support_node = match is_support_node() {
            Ok(_) => true,
            Err(_) => false,
        };

        // load plugin
        // unsafe {
        //     let lib = libloading::Library::new("./plugins/ncm_inject.dll")
        //         .expect("load ncm_inject failed");

        //     let frontend_js: libloading::Symbol<unsafe extern "C" fn() -> *const i8> =
        //         lib.get(b"get_frontend_js\0").unwrap();

        //     let node_js_bundle: libloading::Symbol<unsafe extern "C" fn() -> *const i8> =
        //         lib.get(b"get_node_js_bundle\0").unwrap();

        //     let frontend = std::ffi::CStr::from_ptr(frontend_js()).to_str().unwrap();
        //     let node_script = std::ffi::CStr::from_ptr(node_js_bundle()).to_str().unwrap();

        //     // 创建一个Command来运行node
        //     let mut child = std::process::Command::new("node")
        //         .stdin(std::process::Stdio::piped())
        //         .spawn()
        //         .expect("Failed to spawn Node.js process");

        //     // 获取标准输入句柄并写入Rust变量中的脚本内容
        //     if let Some(ref mut stdin) = child.stdin {
        //         stdin
        //             .write_all(node_script.as_bytes())
        //             .expect("Failed to write to Node.js stdin");
        //     }
        // }
        Self {
            support_node,
            app,
            plugin_map: HashMap::new(),
        }
    }

    /// Manager start for all plugin.
    pub fn start(&mut self) -> Result<Vec<String>, PluginError> {
        let list = PluginManager::list_plugins(None)?;
        let mut res = vec![];
        for plugin in list {
            match self.load_plugin(plugin) {
                Ok(s) => {
                    res.push(s);
                }
                Err(_) => {}
            }
        }

        Ok(res)
    }

    pub fn load_plugin(&mut self, path: String) -> Result<String, PluginError> {
        let (node, frontend, plugin_injector, lib) = unsafe {
            let lib = libloading::Library::new(&path).expect("load ncm_inject failed");
            (
                get_js_string(&lib, "get_node_js_bundle").unwrap_or_default(),
                get_js_string(&lib, "get_frontend_js").unwrap_or_default(),
                // this method cause error
                get_plugin_injector(&lib),
                lib,
            )
        };

        if let Ok(injector) = plugin_injector {
            let mut instance = plugin_instance::PluginInstance::new(
                lib,
                self.app.clone(),
                injector,
                node.clone(),
                frontend.clone(),
            );
            // // test only
            // let new_injector = unsafe { instance.get_injector().unwrap() };

            // tokio::runtime::Builder::new_current_thread()
            //     .enable_all()
            //     .build()
            //     .unwrap()
            //     .block_on(async {
            //         println!("{:?}", new_injector.request_interceptor.get_songs().await);
            //     });

            let namespace = instance.injector.get_namespace().clone();

            instance.start()?;

            self.plugin_map.insert(path, instance);

            return Ok(namespace);
        } else {
            return Err(PluginError::new(String::from(
                "unable to load plugin injector",
            )));
        }
    }

    pub fn unload_plugin(&mut self, namespace: String) {
        let plugin = self.plugin_map.remove(&namespace);

        if let Some(mut plugin) = plugin {
            plugin.unload();
        }
    }

    pub fn start_plugin(&mut self, namespace: String) -> io::Result<()> {
        if let Some(instance) = self.plugin_map.get_mut(&namespace) {
            instance.start()?;
        }

        Ok(())
    }

    pub fn start_all_plugin() {}

    /// Stop a plugin.
    pub fn kill_plugin(namespace: String) {}

    /// A macro, same as running `kill_plugin` and `start_plugin` next;
    pub fn restart_plugin(namespace: String) {}

    /// Load all plugins from the `plugins` directory
    pub fn load_all_plugin() {}

    pub fn get_all_injector(&self) -> Vec<MusicInjector> {
        let res = vec![];
        for (_, plugin) in &self.plugin_map {
            // res.push(plugin);
            // plugin.inj
        }
        res
    }

    pub fn list_plugins(dir: Option<String>) -> Result<Vec<String>, std::io::Error> {
        let dirs = std::fs::read_dir(dir.unwrap_or_else(|| "plugins".to_string()))?;

        let mut plugins = Vec::new();

        for entry in dirs {
            let entry = entry?;
            let path = entry.path();
            if path.is_file() {
                plugins.push(path.to_str().unwrap().to_string());
            }
        }
        Ok(plugins)
    }
}

#[test]
fn test() {
    let builder = tauri::Builder::default().setup(move |app| {
        let mut plugin_manager = PluginManager::new(app.handle().clone());
        let _ = plugin_manager.start();
        Ok(())
    });

    builder
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
