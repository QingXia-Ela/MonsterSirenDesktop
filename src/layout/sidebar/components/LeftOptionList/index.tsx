import { FunctionComponent, HTMLAttributes } from "react";
import "@/assets/fonts/menu/iconfont.css";
import SingleOptionItem from "./SingleOptionItem";
import { OptionType, SingleOptionItemProps } from "../../constants/config";

interface SidebarLeftOptionListProps extends HTMLAttributes<HTMLDivElement> {
  optionList: Array<SingleOptionItemProps>;
  value: OptionType;
  onValueChange?: (value: OptionType) => void;
}

const SidebarLeftOptionList: FunctionComponent<SidebarLeftOptionListProps> = ({
  optionList,
  value,
  onValueChange,
  ...props
}) => {
  return (
    <div className="h-full flex flex-col justify-between" {...props}>
      <div>
        {optionList.map((item, index) => (
          <SingleOptionItem
            key={index}
            selected={item.value === value}
            {...item}
            onClick={() => onValueChange?.(item.value)}
          />
        ))}
      </div>
      <div>
        <SingleOptionItem iconClass="icon-tool" title="高级设置" />
        <SingleOptionItem iconClass="icon-24gl-infoCircle" title="关于" />
      </div>
    </div>
  );
};

export default SidebarLeftOptionList;
