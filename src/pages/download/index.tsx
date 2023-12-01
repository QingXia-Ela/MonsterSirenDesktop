import { FunctionComponent, useEffect, useState } from 'react';
import Styles from './index.module.scss';
import { RouterCombineProps } from '@/router/types';
import DownloadLeftControl, {
  DownloadButtonValue,
} from './components/LeftControl';

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
    </div>
  );
};

export default Download;
