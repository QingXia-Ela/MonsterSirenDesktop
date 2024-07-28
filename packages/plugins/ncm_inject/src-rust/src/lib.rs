use std::ffi::c_void;

mod injector;
mod netease_struct;

pub static NODE_JS_BUNDLE: &str = include_str!("../../dist-node/bundle.cjs");

pub static FRONTEND_JS: &str = include_str!("../../dist-browser/index.js");

#[no_mangle]
pub extern "C" fn get_frontend_js() -> *const i8 {
    FRONTEND_JS.as_ptr() as *const i8
}

#[no_mangle]
pub extern "C" fn get_node_js_bundle() -> *const i8 {
    NODE_JS_BUNDLE.as_ptr() as *const i8
}

#[no_mangle]
pub extern "C" fn init(app: tauri::AppHandle) -> *mut c_void {
    let injector = injector::ncm_injector::get_ncm_injector(app);
    let boxed_injector = Box::new(injector);

    Box::into_raw(boxed_injector) as *mut c_void
}

#[cfg(test)]
mod running_nodejs_test {
    use std::{
        io::{Read, Write},
        os::windows::process::CommandExt,
    };

    use crate::NODE_JS_BUNDLE;

    pub fn get_node_process() -> Result<std::process::Child, std::io::Error> {
        let child = std::process::Command::new("node")
            .creation_flags(0x08000000)
            .stdin(std::process::Stdio::piped())
            .stdout(std::process::Stdio::piped())
            .stderr(std::process::Stdio::piped())
            .spawn()?;

        Ok(child)
    }

    pub fn call_node_js_bundle(js: &str) -> Result<std::process::Child, std::io::Error> {
        let mut child = get_node_process()?;
        if let Some(ref mut stdin) = child.stdin {
            stdin.write_all(js.as_bytes())?;
        }

        Ok(child)
    }
    #[test]
    fn run() {
        let mut child = call_node_js_bundle(NODE_JS_BUNDLE).unwrap();
        let output = child.wait_with_output().unwrap();
        println!("{:?}", String::from_utf8(output.stderr));
    }
}
