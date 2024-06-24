/**
 * @deprecated - 后端写下载模块有点麻烦，先暂时不用这个页面
 *
 * 本页需要达成功能：
 *
 * - 前后端下载事件同步
 */
import { FunctionComponent, useEffect, useState } from 'react';
import Styles from './index.module.scss';
import { RouterCombineProps } from '@/router/types';
import DownloadLeftControl, {
  DownloadButtonValue,
} from './components/LeftControl';
import DownloadRightDetails from './components/RightDetails';

interface DownloadProps extends RouterCombineProps {}

const Download: FunctionComponent<DownloadProps> = ({ active, ...props }) => {
  // first active always show
  const [cssActive, setcssActive] = useState(true);
  const [selectValue, setSelectValue] =
    useState<DownloadButtonValue>('downloading');
  // delay css control show to next tick
  useEffect(() => {
    setcssActive(active);
  }, [active]);

  return (
    <div
      className={`${Styles.download} ${cssActive && Styles.downloadShow}`}
      {...props}
    >
      <DownloadLeftControl value={selectValue} onChange={setSelectValue} />
      {/* DOWNLOAD */}
      <DownloadRightDetails />
    </div>
  );
};

export default Download;
