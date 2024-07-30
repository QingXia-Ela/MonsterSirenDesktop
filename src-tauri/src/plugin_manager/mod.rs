mod plugin_instance;
mod plugin_utils;

use plugin_utils::*;
use std::{
    collections::HashMap,
    io::{self},
};

use crate::{
    global_struct::music_injector::{MusicInjector, MusicInjectorMetadata},
    plugin_error::{PluginError},
};

extern crate libloading;

pub struct PluginManager {
    pub app: tauri::AppHandle,
    pub support_node: bool,
    pub plugin_map: HashMap<String, plugin_instance::PluginInstance>,
}

// todo!: add plugin kill on drop
impl PluginManager {
    pub fn new(app: tauri::AppHandle) -> Self {
        // detect node
        let support_node = match is_support_node() {
            Ok(_) => true,
            Err(_) => false,
        };

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
            let lib = libloading::Library::new(&path).expect("load inject failed");
            (
                get_js_string(&lib, "get_node_js_bundle").unwrap_or_default(),
                get_js_string(&lib, "get_frontend_js").unwrap_or_default(),
                // this method cause error
                get_plugin_injector(&lib, self.app.clone()),
                lib,
            )
        };

        if let Ok(injector) = plugin_injector {
            let mut instance = plugin_instance::PluginInstance::new(
                lib,
                self.app.clone(),
                injector,
                node,
                frontend.clone(),
            );

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
    pub fn kill_plugin(&mut self, namespace: String) -> Option<plugin_instance::PluginInstance> {
        self.plugin_map.remove(&namespace)
    }

    pub fn kill_all_plugin(&mut self) {
        self.plugin_map.values_mut().for_each(|p| p.unload());
    }

    /// A macro, same as running `kill_plugin` and `start_plugin` next;
    pub fn restart_plugin(namespace: String) {}

    /// Load all plugins from the `plugins` directory
    pub fn load_all_plugin() {}

    pub fn get_all_injector(&self) -> Vec<MusicInjector> {
        let mut res = vec![];
        for (_, plugin) in &self.plugin_map {
            res.push(unsafe { plugin.get_injector() }.unwrap());
            // plugin.inj
        }
        res
    }

    pub fn list_plugins(dir: Option<String>) -> Result<Vec<String>, std::io::Error> {
        // ensure dir is exist
        let _ = std::fs::create_dir_all("plugins");
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

    pub fn get_injector_metadata_by_possible_name(
        &self,
        possible_name: String,
    ) -> Option<MusicInjectorMetadata> {
        for (_, plugin) in &self.plugin_map {
            if possible_name.contains(format!("{}:", plugin.injector.get_namespace()).as_str()) {
                return Some(plugin.injector.get_metadata());
            }
        }
        None
    }

    pub fn get_all_injector_metadata(&self) -> Vec<MusicInjectorMetadata> {
        let mut res = vec![];
        for (_, plugin) in &self.plugin_map {
            res.push(plugin.injector.get_metadata());
        }
        res
    }
}

// #[test]
// fn test() {
//     let builder = tauri::Builder::default().setup(move |app| {
//         let mut plugin_manager = PluginManager::new(app.handle().clone());
//         let _ = plugin_manager.start();
//         Ok(())
//     });

//     builder
//         .run(tauri::generate_context!())
//         .expect("error while running tauri application");
// }
