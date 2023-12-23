use deno_core::{JsRuntime, PollEventLoopOptions, RuntimeOptions};

fn main() {
    // 初始化一个运行时环境，这里的配置是默认的
    let mut runtime = JsRuntime::new(RuntimeOptions::default());

    // JavaScript代码字符串，可以从文件中读取或者是内联的
    let script = r#"
        function print(value) {
            Deno.core.print(value.toString()+"\n");
        }

        print("The sum of");
    "#;

    let f = async {
        // 执行JavaScript代码
        // "<unknown>" 是这段代码的名字，主要用于调试目的
        // 例如如果有错误发生，它会显示在错误信息中
        runtime.execute_script_static("<unknown>", script).unwrap();
        // runtime.ex

        // // 因为Deno的console.log并没有直接打印到Rust的标准输出
        // // 你需要进行一些配置来获取输出或者使用Deno的操作(op)系统
        // // 比如下面就是一个简单的事件循环，用于处理Deno内部的异步事件
        loop {
            runtime
                .run_event_loop(PollEventLoopOptions::default())
                .await
                .unwrap()
        }
    };

    // 执行异步代码
    tokio::runtime::Builder::new_current_thread()
        .enable_all()
        .build()
        .unwrap()
        .block_on(f);
}
