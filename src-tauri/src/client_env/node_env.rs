use std::ffi::c_void;

use libloading::{Library, Symbol};

use crate::client_path::PLUGIN_PATH;

// unuse right now :(.
// type JsRuntimeFnPtr<'a> = Symbol<'a, unsafe extern "C" fn() -> *mut c_void>;

pub fn get_node_env_core() -> Option<Library> {
    unsafe {
        let lib = match Library::new(format!("{}/{}", PLUGIN_PATH, "node_env.dll")) {
            Ok(lib) => lib,
            Err(_) => {
                return None;
            }
        };

        Some(lib)
    }
}

#[test]
fn test_node_env() {
    get_node_env_core();
}
