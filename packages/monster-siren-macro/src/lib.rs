mod utils;

extern crate proc_macro;

use md5::compute;
use proc_macro::TokenStream;
use quote::{quote, ToTokens};
use syn::{parse_macro_input, ItemFn};
use utils::{get_plugin_str, parse_type_2_ts};
use uuid::Uuid;

fn parse_args_to_js_object(args: Vec<syn::FnArg>) -> String {
    let mut content = String::from("{");
    for i in args {
        match i {
            syn::FnArg::Typed(typed) => {
                // arg name
                let pat = typed.pat.to_token_stream().to_string();
                // arg type
                let ty = typed.ty.to_token_stream().to_string();
                let res = parse_type_2_ts(&ty);
                // todo!: optimize filter rules
                // maybe it can only approval the struct can be serialize
                if pat.ne(/* tauri app */ "app") && pat.ne(/* resource manager */ "manager") {
                    content.push_str(&format!(" {}: {},", pat, res));
                }
            }
            _ => {}
        }
    }

    content.push_str(" }");
    content
}

fn get_plugin_namespace(attr: TokenStream) -> String {
    return attr.to_string().split(',').collect::<Vec<&str>>()[0]
        .to_string()
        .trim_matches('\"')
        .to_string();
}
/// 标记一个函数，使其在 app 构建时能够输出自己的 Typescript 类型到类型包中 `@monster-siren-desktop/types`
///
/// **注意**：该包只能被 tauri app 引用
///
/// # Stability
/// 目前这个特性并不稳定，未来可能会发生重大变动
///
/// # Notice
/// 目前不支持函数参数复杂类型转换，接收参数名字只支持 `String` 类型识别，其他一律为 `any`
///
/// 返回值均为 `Promise<any>`
///
/// 过滤器会将参数名字为 `app` 和 `manager` 的参数进行过滤，该特性可能在未来时会改变
///
/// # Example
/// ```rust
/// #[monster_siren_macro::command_ts_export]
/// fn add(a: i32, b: i32) -> i32 {
///     a + b
/// }
///
/// #[monster_siren_macro::command_ts_export("namesp")]
/// fn foo<R: tauri::Runtime>(app: tauri::AppHandle<R>, bar: String) -> String {
///     bar
/// }
/// ```
/// 输出的 ts 类型为：
/// ```ts
/// declare module "@tauri-apps/api/tauri" {
///     function invoke(cmd: "add", args: { a: any, b: any }): Promise<any>;
///     function invoke(cmd: "plugin:namesp|foo", args: { bar: string }): Promise<any>;
/// }
/// ```
#[proc_macro_attribute]
pub fn command_ts_export(attr: TokenStream, item: TokenStream) -> TokenStream {
    let return_val = item.clone();
    let input_fn = parse_macro_input!(item as ItemFn);
    // let attr = parse_macro_input!(attr as syn::Item);
    // let input_fn = return_fn.clone();
    if !cfg!(debug_assertions) {
        let fn_name = input_fn.sig.ident.to_string();

        let args =
            parse_args_to_js_object(input_fn.sig.inputs.into_iter().collect::<Vec<syn::FnArg>>());

        let return_type = match input_fn.sig.output {
            syn::ReturnType::Default => "void".to_string(),
            syn::ReturnType::Type(_, ty) => match ty {
                _ => {
                    // todo!: add Result type get like Result<(), String>
                    println!(
                        "Unsupported return type: {}",
                        ty.to_token_stream().to_string()
                    );
                    String::from("any")
                }
            },
        };

        // let res: Result<Vec<String>, syn::Error> = attr.parse_args();

        let ts_declaration = format!(
            "\tfunction invoke(cmd: \"{}\", args: {}): Promise<{}>;\n",
            get_plugin_str(&get_plugin_namespace(attr), &fn_name),
            args,
            return_type
        );

        let _ = std::fs::create_dir_all("target/declarations");
        // 将 TypeScript 声明写入到文件中（简化处理，实际使用时应考虑并发写入问题）
        let _ = std::fs::write(
            format!(
                "target/declarations/{}_{}.d.ts",
                fn_name,
                // paruse id to string
                Uuid::new_v4().to_string() // String::from_utf8(compute(&fn_name).to_vec()).unwrap()
            ),
            ts_declaration,
        );
    }

    // 返回原始函数
    return_val
}
