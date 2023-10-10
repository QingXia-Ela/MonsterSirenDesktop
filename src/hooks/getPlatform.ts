export type PlatformType = 'browser' | 'tauri'


export default function getPlatform(): PlatformType {
  // @ts-expect-error: tauri platform
  if (window.__TAURI_IPC__) return 'tauri'
  return 'browser'
}

export const isTauri = () => getPlatform() === 'tauri'
