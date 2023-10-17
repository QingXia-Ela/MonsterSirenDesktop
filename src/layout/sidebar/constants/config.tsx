import { FunctionComponent } from "react";
import BasicSettings from "../components/RightOptionDetail/components/BasicSettings";

export enum OptionType {
  BasicSettings
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
    rightComponent: BasicSettings
  }
]