import { SettingsManager, saveSettings } from '../';
import { CONFIG_TYPE } from '../types';

const $settingLocalMusic =
  SettingsManager.getAtom<CONFIG_TYPE['localMusic']>('localMusic');

export const toggleEnableLocalMusic = (enable: boolean) => {
  $settingLocalMusic.set({ ...$settingLocalMusic.get(), enable });
};

export const addLocalFolder = (path: string) => {
  const oldPaths = $settingLocalMusic.get().paths || [];
  $settingLocalMusic.set({
    ...$settingLocalMusic.get(),
    paths: Array.from(new Set([...oldPaths, path])),
  });
};

export const removeLocalFolder = (path: string) => {
  const oldPaths = $settingLocalMusic.get().paths || [];
  $settingLocalMusic.set({
    ...$settingLocalMusic.get(),
    paths: oldPaths.filter((p) => p !== path),
  });
};

export default $settingLocalMusic;
