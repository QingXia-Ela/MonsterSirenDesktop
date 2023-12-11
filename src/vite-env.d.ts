/// <reference types="vite/client" />

import type { SirenStore } from './types/SirenStore';

declare global {
  declare module globalThis {
    const siren_config: Record<string, any>;
    const siren_store: SirenStore;
    export { siren_config, siren_store };
  }
}
