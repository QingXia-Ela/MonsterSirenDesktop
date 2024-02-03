use deno_runtime::*;
use std::ffi::c_void;

#[no_mangle]
pub extern "C" fn create_js_runtime() -> *mut c_void {
    let runtime = JsRuntime::new(RuntimeOptions::default());
    // 将JsRuntime转换为裸指针
    Box::into_raw(Box::new(runtime)) as *mut c_void
}

#[no_mangle]
pub extern "C" fn drop_js_runtime(ptr: *mut c_void) {
    if !ptr.is_null() {
        // 从裸指针重新构造Box以便正确释放JsRuntime
        unsafe {
            let _ = Box::from_raw(ptr as *mut JsRuntime);
        };
    }
}
