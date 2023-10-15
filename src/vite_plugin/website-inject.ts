import { PluginOption } from "vite";
import fs from "fs";
import { request } from "https";
import "./website-inject/createServer";

const CDN_PATH = "web.hycdn.cn";

function replaceStr(str: string, oldStr: string, newStr: string) {
  return str
    .replaceAll(new RegExp(oldStr, "g"), newStr)
    .replaceAll("https", "http");
}

function Plugin() {
  return {
    name: "website-inject",
    async transformIndexHtml(html, ctx) {
      if (process.env.STORYBOOK) return html;

      return (
        replaceStr(
          await fetch("https://monster-siren.hypergryph.com").then((res) =>
            res.text(),
          ),
          CDN_PATH,
          "localhost:11451",
        ) + html
      );
      // + `<script>${await fetch("https://web.hycdn.cn/service-worker.js").then(res => res.text())}</script>`
    },
  } as PluginOption;
}

export default Plugin;
