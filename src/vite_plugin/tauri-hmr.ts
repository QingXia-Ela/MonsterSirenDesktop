import { PluginOption, createLogger } from "vite"
import { WebSocketServer } from 'ws'
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
      if (!TauriWs || ctx.file.includes("src-tauri")) return
      logger.info(`Update: ${ctx.file}`)
      TauriWs.send("inject")
    },
  } as PluginOption
}

export default Plugin
