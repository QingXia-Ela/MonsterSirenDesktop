/// <reference types="vite/client" />

import SirenStore from './store/SirenStore';

declare global {
  declare module globalThis {
    const siren_config: Record<string, any>;
    const siren_store: typeof SirenStore;
    export { siren_config, siren_store };
  }
}