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

export function changeShowListMode(showMode: CONFIG_TYPE['basic']['showSirenMusicListMode']) {
  $settingBasic.set({ ...$settingBasic.get(), showSirenMusicListMode: showMode });
}

export const PlaylistModeChooses: Array<{
  title: string;
  value: Exclude<CONFIG_TYPE['basic']['showSirenMusicListMode'], undefined>;
}> = [
    {
      title: "展示所有的塞壬唱片专辑",
      value: "show"
    },
    {
      title: "隐藏塞壬唱片所有专辑",
      value: "hide"
    },
    {
      title: "将所有专辑打平为一个音乐列表",
      value: "collect"
    }
  ]

export const CloseModeChooses: Array<{
  title: string;
  value: Exclude<CONFIG_TYPE['basic']['closeMode'], undefined>;
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
