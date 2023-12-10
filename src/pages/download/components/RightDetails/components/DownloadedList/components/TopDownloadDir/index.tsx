import Button from '@/components/Button';
import { FunctionComponent } from 'react';

interface TopDownloadDirProps {}

const TopDownloadDir: FunctionComponent<TopDownloadDirProps> = () => {
  return (
    <div className='flex gap-1 w-full text-[.3rem] font-[SourceHanSansCN-Bold] mb-2 items-center'>
      <span>下载目录</span>
      <Button size='small'>test</Button>
      <a className='underline text-[.24rem] text-gray-300 transition-opacity hover:opacity-80 opacity-100'>
        打开目录
      </a>
    </div>
  );
};

export default TopDownloadDir;
