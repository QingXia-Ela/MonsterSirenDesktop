import { FunctionComponent } from "react";
import BasicSettings from "../components/RightOptionDetail/Settings/BasicSettings";
import BackgroundSettings from "../components/RightOptionDetail/Settings/BackgroundSettings";

export enum OptionType {
  BasicSettings,
  BackgroundSettings
}

export interface SingleOptionItemProps {
  iconClass: string;
  title: string;
  value: OptionType;
  selected?: boolean;
  rightComponent: FunctionComponent;
}

export const OptionList: Array<SingleOptionItemProps> = [
  {
    iconClass: "icon-24gl-gear4",
    title: "基本设置",
    value: OptionType.BasicSettings,
    rightComponent: BasicSettings,
  },
  {
    iconClass: "icon-image",
    title: "背景设置",
    value: OptionType.BackgroundSettings,
    rightComponent: BackgroundSettings,
  }
];
