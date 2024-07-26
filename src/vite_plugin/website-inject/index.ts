import { PluginOption } from 'vite';
import fs from 'fs/promises';
import path from 'path';
import startSirenWebsiteScrape from './website-grap';
// import './website-inject/createServer';

const CDN_PATH = 'https://web.hycdn.cn/';

function replaceStr(str: string, oldStr: string, newStr: string) {
  return str
    .replaceAll(new RegExp(oldStr, 'g'), newStr)
    .replaceAll('https', 'http');
}

const headers = {
  'User-Agent':
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.142.86 Safari/537.36',
};

let sourceSirenStr: string;

function Plugin() {
  return {
    name: 'website-inject',
    async transformIndexHtml(html, ctx) {
      if (process.env.STORYBOOK) return html;

      if (!sourceSirenStr) {
        sourceSirenStr = await fetch('https://monster-siren.hypergryph.com', {
          headers,
        }).then((res) => {
          return res.text();
        });
      }
      let initalProps = /window\.g_initialProps = (.*);/;
      sourceSirenStr = sourceSirenStr
        .replace('window.g_useSSR = true;', '')
        .replace(initalProps, '')
        .replace(`<link data-react-helmet="true" rel="manifest" href="/manifest.json">`, "");

      if (process.env.NODE_ENV === 'production') {
        // download siren website vanilla files.
        // let texts = await downloadFileToDist(sourceSirenStr)
        // while (texts.length > 0) {
        //   texts = await downloadFileToDist(sourceSirenStr)
        // }
        await startSirenWebsiteScrape();
      }

      let sirenInjectHtml =
        replaceStr(
          sourceSirenStr,
          'web.hycdn.cn',
          // process.env.NODE_ENV === 'production' ? '/' : 'localhost:11451',
          'localhost:11451',
        ) + html;
      return sirenInjectHtml;
      // + `<script>${await fetch("https://web.hycdn.cn/service-worker.js").then(res => res.text())}</script>`
    },
  } as PluginOption;
}

export default Plugin;
