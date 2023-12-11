import { SettingsManager } from '../';
import { CONFIG_TYPE } from '../types';

const $settingBasic = SettingsManager.getAtom<CONFIG_TYPE['basic']>('basic');

export function changeAutoPlay(closeAutoPlay: boolean) {
  $settingBasic.set({ ...$settingBasic.get(), closeAutoPlay });
}

export function changeVolume(volume: number) {
  $settingBasic.set({ ...$settingBasic.get(), volume });
}

export function changeCloseMode(closeMode: CONFIG_TYPE['basic']['closeMode']) {
  $settingBasic.set({ ...$settingBasic.get(), closeMode });
}

export const CloseModeChooses: Array<{
  title: string;
  value: CONFIG_TYPE['basic']['closeMode'];
}> = [
  {
    title: '隐藏到任务栏',
    value: 'tray',
  },
  {
    title: '最小化窗口',
    value: 'minimize',
  },
  {
    title: '直接退出',
    value: 'close',
  },
  {
    title: '每次关闭时询问',
    value: '',
  },
];

export default $settingBasic;
