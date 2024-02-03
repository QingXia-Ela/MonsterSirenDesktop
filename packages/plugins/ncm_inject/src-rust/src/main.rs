use deno_runtime::*;
use std::fs;

fn main() {
    let static_js = fs::read_to_string("../dist-node/bundle.cjs").unwrap();

    let mut js_runtime = deno_runtime::JsRuntime;
    js_runtime.execute("<anon>", static_js.as_str()).unwrap();
}
