use std::os::raw::c_void;

use libloading::Library;

use crate::{
    global_struct::music_injector::MusicInjector, global_utils::get_main_window,
    plugin_error::PluginError,
};

type FuncPointer<'a> = libloading::Symbol<'a, unsafe extern "C" fn() -> *const i8>;

type InitFuncPointer<'a> = libloading::Symbol<'a, unsafe extern "C" fn() -> *mut c_void>;

pub fn is_support_node() -> Result<(), std::io::Error> {
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

pub fn call_frontend_js(app: tauri::AppHandle, js: &str) -> tauri::Result<()> {
    let win = get_main_window(&app);
    // todo!: 改造成前端获取该模块并在前端使用模块形式执行
    win.eval(js)
}

pub unsafe fn get_js_string(lib: &Library, symbol: &str) -> Result<String, PluginError> {
    let symbol = lib.get::<FuncPointer>(symbol.as_bytes());

    match symbol {
        Ok(s) => {
            let js = std::ffi::CStr::from_ptr(s()).to_str();

            if let Ok(s) = js {
                return Ok(s.to_string());
            }

            return Err(PluginError::new("get js string error".to_string()));
        }
        Err(e) => {
            return Err(PluginError::new(e.to_string()));
        }
    }
}

unsafe fn parse_pointer_to_injector(injector_pointer: *mut c_void) -> Box<MusicInjector> {
    let injector = Box::from_raw(injector_pointer as *mut MusicInjector);
    // very dangerous
    // todo!: optimize it
    println!("injector: {:?}", injector);
    injector
}

pub unsafe fn get_plugin_injector(lib: &Library) -> Result<MusicInjector, PluginError> {
    let symbol = lib.get::<InitFuncPointer>("init".as_bytes());

    match symbol {
        Ok(s) => {
            let injector_pointer = s();
            Ok(*parse_pointer_to_injector(injector_pointer))
        }
        Err(e) => Err(PluginError::new(e.to_string())),
    }
}
