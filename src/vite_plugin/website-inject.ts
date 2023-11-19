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
          await fetch("https://monster-siren.hypergryph.com", {
            headers: {
              "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.142.86 Safari/537.36",
            }
          }).then((res) => {
            return res.text()
          },
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
