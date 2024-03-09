use std::io::Write;

extern crate libloading;

pub struct PluginManager {
    app: tauri::AppHandle,
    support_node: bool,
}

impl PluginManager {
    pub fn new(app: tauri::AppHandle) -> Self {
        // detect node
        let support_node = {
            let mut cmd = std::process::Command::new("123");

            cmd.arg("-v")
                .stdout(std::process::Stdio::piped())
                .stderr(std::process::Stdio::piped())
                .spawn()
                .unwrap()
                .wait()
                .unwrap()
                .success()
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
}
