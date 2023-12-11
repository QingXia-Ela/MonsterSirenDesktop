import { listen } from '@tauri-apps/api/event'
import type { SirenStore } from '../types/SirenStore';

const store = window.siren_store;

const unlisten = await listen('store:play_and_pause', () => {
  // store.
})

export default store as SirenStore;
