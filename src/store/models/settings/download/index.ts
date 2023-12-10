import { SettingsManager } from '../';
import { CONFIG_TYPE } from '../types';
import { audioDir } from '@tauri-apps/api/path'

const $settingDownload = SettingsManager.getAtom<CONFIG_TYPE['download']>('download');

if ($settingDownload.get().path === "") {
  $settingDownload.set({ ...$settingDownload.get(), path: await audioDir() });
}

console.log(await audioDir());


export default $settingDownload