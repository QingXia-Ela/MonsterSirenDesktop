import { PluginOption, createLogger } from "vite"
import { WebSocketServer } from 'ws'
import * as esbuild from 'esbuild'
import chalk from 'chalk'
import getTime from "./utils/getTime"

// stupid logger
const logger = createLogger()

const {
  info,
  error,
  warn
} = logger

logger.info = (msg, options) => {
  info(`${getTime()} ${chalk.blueBright("[vite-plugin-tauri-hmr]")} ${msg}`, options)
}

logger.error = (msg, options) => {
  error(`${getTime()} ${chalk.redBright("[vite-plugin-tauri-hmr]")} ${msg}`, options)
}

logger.warn = (msg, options) => {
  warn(`${getTime()} ${chalk.yellowBright("[vite-plugin-tauri-hmr]")} ${msg}`, options)
}

const wss = new WebSocketServer({
  port: 30012,
})

let TauriWs = null

wss.on("connection", (ws) => {
  logger.info("connection established.")
  ws.on("error", (err) => {
    logger.error(err.message)
  })
  TauriWs = ws
})

const Plugin = function () {
  return {
    name: "tauri-hmr",
    options(options) {

    },
    handleHotUpdate(ctx) {
      if (!TauriWs || ctx.file.includes("src-tauri") || ctx.file.includes("dist")) return
      esbuild.build({
        entryPoints: ["src/main.tsx"],
        bundle: true,
        outfile: "src-tauri/main.js",
        minify: true
      }).then(() => {
        TauriWs.send("inject")
        logger.info(`Update and build successfully: ${ctx.file}`.trim())
      }).catch((err) => {
        logger.error(err.message)
      })
    },
  } as PluginOption
}

export default Plugin
