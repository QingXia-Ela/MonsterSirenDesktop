// use monster_siren_desktop::global_struct::music_injector;

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
pub extern "C" fn plugin_init() {
    println!("Hello from ncm_inject!");
}
