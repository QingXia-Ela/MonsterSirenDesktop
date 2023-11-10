/// <reference types="vite/client" />

import SirenStore from "./store/SirenStore"

declare module globalThis {
  const siren_config = {}
  const siren_store: typeof SirenStore
  export {
    siren_config,
    siren_store
  }
}