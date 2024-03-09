// use monster_siren_desktop::global_struct::music_injector;

#[no_mangle]
pub static FRONTEND_JS: &str = include_str!("../../dist-node/bundle.cjs");

#[no_mangle]
pub extern "C" fn plugin_init() {
    println!("Hello from ncm_inject!");
}
