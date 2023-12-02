import { FunctionComponent, HTMLAttributes } from 'react';
import Styles from './index.module.scss';

export type DownloadButtonValue = 'downloading' | 'downloaded';

const buttons: Array<{
  text: string;
  icon: string;
  value: DownloadButtonValue;
}> = [
  {
    text: '正在下载',
    icon: 'icon-24gl-download',
    value: 'downloading',
  },
  {
    text: '已下载',
    icon: 'icon-24gl-successCircle',
    value: 'downloaded',
  },
];

const ControlButton: FunctionComponent<
  {
    icon: string;
    text: string;
    active?: boolean;
  } & HTMLAttributes<HTMLAnchorElement>
> = ({ icon, text, className, active = false, ...props }) => (
  <a
    className={`${Styles.control_button} ${className} ${
      active && Styles.active
    }`}
    {...props}
  >
    <i className={`iconfont ${Styles.iconfont} ${icon}`}></i>
    <span className={Styles.text}>{text}</span>
  </a>
);

interface DownloadLeftControlProps {
  value: DownloadButtonValue;
  onChange?: (value: DownloadButtonValue) => void;
}

const DownloadLeftControl: FunctionComponent<DownloadLeftControlProps> = ({
  value: selectValue,
  onChange,
}) => {
  return (
    <div className='w-20 flex flex-col gap-1'>
      <div className='text-[.6em] font-bold mb-1'>下载管理</div>
      {buttons.map(({ value, icon, text }) => (
        <ControlButton
          key={value}
          active={value === selectValue}
          text={text}
          icon={icon}
          onClick={() => onChange?.(value)}
        />
      ))}
    </div>
  );
};

export default DownloadLeftControl;
