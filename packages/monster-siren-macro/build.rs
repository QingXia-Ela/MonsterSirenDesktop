// build.rs
use std::collections::HashSet;
use std::fs;

fn main() {
    if cfg!(debug_assertions) {
        return;
    }
    // todo!: 优化寻路
    let project_root = "../../src-tauri/";
    let types_root = "../types/"; // @monster-siren-desktop/types
    let _ = fs::create_dir_all(format!("{}/target/declarations", project_root));
    // 读取之前宏写入的所有 TypeScript 声明
    // target/declarations/*.d.ts
    let mut content = String::from("declare module \"@tauri-apps/api/tauri\" {\n\tfunction invoke<T = any>(cmd: string, args: Record<string, any>): Promise<T>;\n");
    let mut content_set: HashSet<String> = HashSet::new();
    let declaretions = fs::read_dir(format!("{}/target/declarations", project_root));
    match declaretions {
        Ok(files) => {
            for file in files {
                if let Ok(file) = file {
                    let path = file.path();
                    if path.is_file() {
                        content_set.insert(fs::read_to_string(&path).unwrap_or_default());
                        let _ = fs::remove_file(path);
                    }
                }
            }
        }
        Err(_) => {}
    }
    content.push_str(&content_set.into_iter().collect::<Vec<String>>().join("\n"));
    content.push_str("\n}");
    let _ = fs::create_dir_all("bindings");
    // 写入到最终的 TypeScript 定义文件
    fs::write(format!("{}/bindings/invoke.d.ts", types_root), content)
        .expect("Unable to write file");
    let _ = fs::remove_dir_all(format!("{}/target/declarations", project_root));

    println!("Cargo:rerun-if-changed=src");
}
