import { FunctionComponent } from 'react';
import BasicSettings from '../components/RightOptionDetail/Settings/BasicSettings';
import BackgroundSettings from '../components/RightOptionDetail/Settings/BackgroundSettings';
import AdvancementSettings from '../components/RightOptionDetail/Settings/AdvancementSettings';

export enum OptionType {
  BasicSettings,
  BackgroundSettings,
  AdvancementSettings,
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
    rightComponent: () => <div>关于</div>,
  },
];
