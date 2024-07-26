import { SettingsManager } from '../';
import { CONFIG_TYPE } from '../types';

const $settingAdvancement =
  SettingsManager.getAtom<CONFIG_TYPE['advancement']>('advancement');

export function changeLogStore(logStore: boolean) {
  window.siren_config.logStore = logStore;
  $settingAdvancement.set({ ...$settingAdvancement.get(), logStore });
}

export function changeAllowContextMenu(allowContextMenu: boolean) {
  $settingAdvancement.set({ ...$settingAdvancement.get(), allowContextMenu });
}

export function changeAllowRefreshPage(allowRefreshPage: boolean) {
  $settingAdvancement.set({ ...$settingAdvancement.get(), allowRefreshPage });
}

export default $settingAdvancement;
