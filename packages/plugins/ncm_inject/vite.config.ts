import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  build: {
    // Tauri supports es2021
    // In current app we only support windows, which is target to be chrome105
    target: "chrome105",
    outDir: "dist-html",
  },
})