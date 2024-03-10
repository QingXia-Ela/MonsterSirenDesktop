use std::io::Write;
use tauri::{AppHandle, Manager};

use crate::{global_utils::get_main_window, Logger};

extern crate libloading;

pub struct PluginManager {
    app: tauri::AppHandle,
    support_node: bool,
}

fn is_support_node() -> Result<(), std::io::Error> {
    let mut cmd = std::process::Command::new("node");

    let success = cmd
        .arg("-v")
        .stdout(std::process::Stdio::piped())
        .stderr(std::process::Stdio::piped())
        .spawn()?
        .wait()?
        .success();

    if !success {
        return Err(std::io::Error::new(
            std::io::ErrorKind::Other,
            "node running fail",
        ));
    }
    Ok(())
}

pub fn get_node_process() -> Result<std::process::Child, std::io::Error> {
    let child = std::process::Command::new("node")
        .stdin(std::process::Stdio::piped())
        .spawn()?;

    Logger::debug(format!("A new node process running with pid {}", child.id()).as_str());

    Ok(child)
}

pub fn get_frontend_js() {}

pub fn get_node_js_bundle() {}

pub fn call_frontend_js(app: tauri::AppHandle, js: &str) -> tauri::Result<()> {
    let win = get_main_window(&app);
    // todo!: 改造成前端获取该模块并在前端使用模块形式执行
    win.eval(js)
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
        Self { support_node, app }
    }

    pub fn load_plugin(path: String) {}

    pub fn unload_plugin(namespace: String) {}

    pub fn start_plugin() {}

    pub fn kill_plugin() {}

    /// A macro, same as running `kill_plugin` and `start_plugin` next;
    pub fn restart_plugin() {}

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
