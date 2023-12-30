import { defineConfig } from "vite";

export default defineConfig({
  build: {
    // Tauri supports es2021
    // In current app we only support windows, which is target to be chrome105
    target: "chrome105",
  },
})