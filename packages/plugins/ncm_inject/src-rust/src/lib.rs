// use monster_siren_desktop::global_struct::music_injector;

#[no_mangle]
pub extern "C" fn ncm_inject() {
    println!("Hello from ncm_inject!");
}
