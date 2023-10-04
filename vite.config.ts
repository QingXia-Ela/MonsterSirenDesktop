import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tauriHmr from './src/vite_plugin/tauri-hmr'
import basicSsl from '@vitejs/plugin-basic-ssl'
import websiteInject from './src/vite_plugin/website-inject'

// https://vitejs.dev/config/
export default defineConfig(async () => ({
  plugins: [react(), websiteInject()],
  // root: "https://monster-siren.hypergryph.com/index.html",
  // base: "https://monster-siren.hypergryph.com",

  // Vite options tailored for Tauri development and only applied in `tauri dev` or `tauri build`
  // prevent vite from obscuring rust errors
  clearScreen: false,
  // tauri expects a fixed port, fail if that port is not available
  server: {
    port: 8000,
    strictPort: true,
    proxy: {
      "/cdn_proxy": {
        target: "https://web.hycdn.cn",
        rewrite: (path) => path.replace(/^\/cdn_proxy/, ""),
        changeOrigin: true,
        headers: {
          "referer": "https://monster-siren.hypergryph.com",
        },
      }
    }
  },
  resolve: {
    alias: {
      "@": "/src",
    },
  },
  // to make use of `TAURI_DEBUG` and other env variables
  // https://tauri.studio/v1/api/config#buildconfig.beforedevcommand
  envPrefix: ["VITE_", "TAURI_"],
  build: {
    // Tauri supports es2021
    target: process.env.TAURI_PLATFORM == "windows" ? "chrome105" : "safari13",
    // don't minify for debug builds
    minify: !process.env.TAURI_DEBUG ? "esbuild" : false,
    // produce sourcemaps for debug builds
    sourcemap: !!process.env.TAURI_DEBUG,
  },
}));
