import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import svgLoader from 'vite-svg-loader';
import websiteInject from "./src/vite_plugin/website-inject";
import createSvgIcon from './src/vite_plugin/svg-icon'

// https://vitejs.dev/config/
export default defineConfig(async () => ({
  plugins: [react(), svgLoader({
    defaultImport: 'component',
  }), createSvgIcon(), websiteInject()],
  // Vite options tailored for Tauri development and only applied in `tauri dev` or `tauri build`
  // prevent vite from obscuring rust errors
  clearScreen: false,
  // tauri expects a fixed port, fail if that port is not available
  server: {
    port: 8000,
    strictPort: true,
  },
  resolve: {
    alias: {
      "@": "/src",
      SirenStore: "/src/store/SirenStore",
    },
  },
  // to make use of `TAURI_DEBUG` and other env variables
  // https://tauri.studio/v1/api/config#buildconfig.beforedevcommand
  envPrefix: ["VITE_", "TAURI_"],
  build: {
    // Tauri supports es2021
    // In current app we only support windows, which is target to be chrome105
    target: "chrome105",
    // don't minify for debug builds
    minify: !process.env.TAURI_DEBUG ? "esbuild" : false,
    // produce sourcemaps for debug builds
    sourcemap: !!process.env.TAURI_DEBUG,
  },
}));
