import { SettingsManager, saveSettings } from '../';
import { CONFIG_TYPE } from '../types';
import { audioDir } from '@tauri-apps/api/path';

const $settingDownload =
  SettingsManager.getAtom<CONFIG_TYPE['download']>('download');

if ($settingDownload.get().path === '') {
  $settingDownload.set({ ...$settingDownload.get(), path: await audioDir() });
  saveSettings();
}

export const changeDownloadPath = (path: string) => {
  $settingDownload.set({ ...$settingDownload.get(), path });
};

export const changeDownloadLrc = (downloadLrc: boolean) => {
  $settingDownload.set({ ...$settingDownload.get(), downloadLrc });
};

export default $settingDownload;
