# ~~NODE_ENV~~ 已弃用

## 原因

采用 `deno_core` 有几个如下问题

- 不支持 esm
- 不支持 require 引入原生模块，需要创建胶水文件

未来将尝试使用 pkg 获得完整 node 环境支持

## 源简介

塞壬唱片桌面版 node 环境插件

该插件会获得tauri环境注入的原生支持

使用 deno_core 作为内核

以后有没有机会塞个原生node呢？

你的执行js文件必须是 commonjs，因为 deno_core 不接受 esm。

运行js时你可能需要遵守 Deno_core 相关的方法与[下载](https://www.npmjs.com/package/@deno/shim-deno)相关类型以提供 ts 补全。