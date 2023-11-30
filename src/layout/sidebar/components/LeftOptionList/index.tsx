import { FunctionComponent, HTMLAttributes } from 'react';
import '@/assets/fonts/menu/iconfont.css';
import SingleOptionItem from './SingleOptionItem';
import { OptionType, SingleOptionItemProps } from '../../constants/config';

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
  const topList = optionList.filter((item) => item.position !== 'bottom');
  const bottomList = optionList.filter((item) => item.position === 'bottom');
  return (
    <div className='h-full flex flex-col justify-between' {...props}>
      <div>
        {topList.map((item, index) => (
          <SingleOptionItem
            key={index}
            selected={item.value === value}
            {...item}
            onClick={() => onValueChange?.(item.value)}
          />
        ))}
      </div>
      <div>
        {bottomList.map((item, index) => (
          <SingleOptionItem
            key={index}
            selected={item.value === value}
            {...item}
            onClick={() => onValueChange?.(item.value)}
          />
        ))}
      </div>
    </div>
  );
};

export default SidebarLeftOptionList;
