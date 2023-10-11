import type { SirenStore } from "../types/SirenStore";

// @ts-expect-error: tauri expose store
export default window.siren_store as SirenStore