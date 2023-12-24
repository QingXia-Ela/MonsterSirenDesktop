import { FunctionComponent } from 'react';
import BasicSettings from '../Settings/SettingOptions/BasicSettings';
import BackgroundSettings from '../Settings/SettingOptions/BackgroundSettings';
import AdvancementSettings from '../Settings/SettingOptions/AdvancementSettings';
import DownloadSettings from '../Settings/SettingOptions/DownloadSettings';
import AboutSettings from '../Settings/SettingOptions/AboutSettings';

export enum OptionType {
  BasicSettings,
  BackgroundSettings,
  AdvancementSettings,
  DownloadSettings,
  About,
}

export interface SingleOptionItemProps {
  iconClass: string;
  title: string;
  value: OptionType;
  position?: 'top' | 'bottom';
  selected?: boolean;
  rightComponent: FunctionComponent;
}

export const OptionList: Array<SingleOptionItemProps> = [
  {
    iconClass: 'icon-24gl-gear4',
    title: '基本设置',
    value: OptionType.BasicSettings,
    rightComponent: BasicSettings,
  },
  {
    iconClass: 'icon-image',
    title: '背景设置',
    value: OptionType.BackgroundSettings,
    rightComponent: BackgroundSettings,
  },
  {
    iconClass: 'icon-24gl-download',
    title: '下载设置',
    value: OptionType.DownloadSettings,
    rightComponent: DownloadSettings,
  },
  {
    iconClass: 'icon-tool',
    title: '高级设置',
    position: 'bottom',
    value: OptionType.AdvancementSettings,
    rightComponent: AdvancementSettings,
  },

  {
    iconClass: 'icon-24gl-infoCircle',
    title: '关于',
    position: 'bottom',
    value: OptionType.About,
    rightComponent: AboutSettings,
  },
];
