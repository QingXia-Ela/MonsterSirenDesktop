use std::env;
use std::fs;
use std::path::Path;

fn main() {
    let out_dir = env::var("OUT_DIR").unwrap();
    let dest_path = Path::new(&out_dir).join("files.rs");

    let folder_path = "assets/siren";
    let mut contents = String::new();

    if let Ok(entries) = fs::read_dir(folder_path) {
        for entry in entries {
            if let Ok(entry) = entry {
                let path = entry.path();
                if path.is_file() {
                    let file_path = path.to_str().unwrap();
                    contents.push_str(&format!(
                        "pub const {}: &bytes = include_bytes!(\"{}\");\n",
                        path.file_stem().unwrap().to_str().unwrap().to_uppercase(),
                        file_path
                    ));
                }
            }
        }
    }

    fs::write(&dest_path, contents).unwrap();

    tauri_build::build()
}
