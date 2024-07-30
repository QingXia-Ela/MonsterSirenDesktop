use libloading::Library;

use crate::client_path::PLUGIN_PATH;

// unuse right now :(
// type JsRuntimeFnPtr<'a> = Symbol<'a, unsafe extern "C" fn() -> *mut c_void>;

/// Get deno node env runtime.
///
/// # Examples
///
/// ```
/// use libloading::{Library, Symbol};
/// use std::ffi::c_void;
///
/// unsafe {
///    let lib = get_node_env_core().expect("Failed to load library");
///    // 获取 `create_js_runtime` 函数的符号
///    let create_js_runtime: Symbol<unsafe extern "C" fn() -> *mut c_void> =
///        lib.get(b"create_js_runtime").expect("Failed to load symbol");
///    
///    // 调用函数以创建 `JsRuntime` 实例
///    let runtime_ptr = create_js_runtime();
///
///    // 在这里你可以使用 `runtime_ptr`，确保你知道如何正确地与这个指针交互
///
///    // 获取 `drop_js_runtime` 函数的符号，用于释放 `JsRuntime`
///    let drop_js_runtime: Symbol<unsafe extern "C" fn(*mut c_void)> =
///        lib.get(b"drop_js_runtime").expect("Failed to load symbol");
///
///    // 使用完毕后，释放 `JsRuntime` 实例
///    drop_js_runtime(runtime_ptr);
/// }
/// ```
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
