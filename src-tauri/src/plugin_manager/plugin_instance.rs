use libloading::Library;
use tauri::Manager;

// type a =CommandL

use super::plugin_utils::*;
use crate::{
    global_struct::music_injector::MusicInjector,
    logger::{self, debug},
    plugin_error::PluginError,
};
use std::{
    fmt::Debug,
    io::{Read, Write},
    os::windows::process::CommandExt,
    process::Stdio,
};

pub fn get_node_process() -> Result<std::process::Child, std::io::Error> {
    let child = std::process::Command::new("node")
        .creation_flags(0x08000000)
        .stdin(std::process::Stdio::piped())
        .stdout(Stdio::piped())
        .stderr(Stdio::piped())
        .spawn()?;

    logger::debug(format!("A new node process running with pid {}", child.id()).as_str());

    Ok(child)
}

pub fn call_node_js_bundle(
    app: tauri::AppHandle,
    js: &str,
) -> Result<std::process::Child, std::io::Error> {
    let mut child = get_node_process()?;
    if let Some(ref mut stdin) = child.stdin {
        stdin.write_all(js.as_bytes())?;
    }

    Ok(child)
}

pub struct PluginInstance {
    plugin_lib: Library,
    pub app: tauri::AppHandle,
    pub injector: MusicInjector,
    pub node_js_process: Option<std::process::Child>,
    pub node_js_string: String,
    pub frontend_js_string: String,
    pub pid: Option<u32>,
}

impl Debug for PluginInstance {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        f.debug_struct("PluginInstance")
            .field("plugin_lib", &self.plugin_lib)
            .field("node_js_process", &self.node_js_process)
            .field("node_js_string_len", &self.node_js_string.len())
            .field("frontend_js_string_len", &self.frontend_js_string.len())
            .field("injector", &self.injector)
            .finish()
    }
}

// child process will not kill unless we call kill manually
// this happen when father exit and memory drop?
// impl Drop for PluginInstance {
//     fn drop(&mut self) {
//         if let Some(ref mut child) = self.node_js_process {
//             let _ = child.kill();
//             let _ = child.wait();
//         }
//     }
// }

impl PluginInstance {
    pub fn new(
        plugin_lib: Library,
        app: tauri::AppHandle,
        // todo!: 修改为 Arc 跨线程
        injector: MusicInjector,
        node_js_string: String,
        frontend_js_string: String,
    ) -> Self {
        PluginInstance {
            plugin_lib,
            app,
            injector,
            node_js_process: None,
            node_js_string,
            frontend_js_string,
            pid: None,
        }
    }

    pub fn start(&mut self) -> Result<(), std::io::Error> {
        if self.node_js_string.len() > 10 && is_support_node().is_ok() {
            debug(
                format!(
                    "nodejs_call by {}, len: {}",
                    self.injector.namespace,
                    self.node_js_string.len()
                )
                .as_str(),
            );
            let mut res = call_node_js_bundle(self.app.clone(), &self.node_js_string)?;
            self.pid = Some(res.id());

            // Assuming `call_node_js_bundle` already writes the JS string to stdin, flush it.
            res.stdin
                .as_mut()
                .ok_or(std::io::Error::new(
                    std::io::ErrorKind::BrokenPipe,
                    "Failed to get stdin",
                ))?
                .flush()?;

            // Dropping the stdin to signal Node.js that there are no more data to read.
            drop(res.stdin.take()); // This will close the stdin stream.

            // let output = res.wait_with_output().unwrap();
            // println!("{:?}", String::from_utf8(output.stderr));
            self.node_js_process = Some(res);
        }

        // frontend js
        let _ = self
            .app
            .get_window("main")
            .unwrap()
            .eval(&self.frontend_js_string);

        Ok(())
    }

    pub fn stop(&mut self) {
        self.unload()
    }

    pub fn unload(&mut self) {
        if let Some(mut process) = self.node_js_process.take() {
            let _ = process.kill();
        }
    }

    /// 此处返回的是一个全新的 injector，而不是之前创建的引用
    pub unsafe fn get_injector(&self) -> Result<MusicInjector, PluginError> {
        get_plugin_injector(&self.plugin_lib, self.app.clone())
    }
}
