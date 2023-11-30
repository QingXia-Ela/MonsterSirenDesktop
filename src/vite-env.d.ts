/// <reference types="vite/client" />

import SirenStore from './store/SirenStore';

declare module Window {
  const siren_config = {};
  const siren_store: typeof SirenStore;
  export { siren_config, siren_store };
}
