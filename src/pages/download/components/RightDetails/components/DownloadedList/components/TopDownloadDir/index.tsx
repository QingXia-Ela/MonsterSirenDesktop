import Button from '@/components/Button';
import $settingDownload from '@/store/models/settings/download';
import { useStore } from '@nanostores/react';
import { open } from '@tauri-apps/api/shell';
import { FunctionComponent } from 'react';

interface TopDownloadDirProps {}

const TopDownloadDir: FunctionComponent<TopDownloadDirProps> = () => {
  const { path } = useStore($settingDownload);

  const openDir = (path: string) => {
    open(path);
  };
  return (
    <div className='flex gap-1 w-full text-[.3rem] font-[SourceHanSansCN-Bold] mb-2 items-center'>
      <span>下载目录</span>
      <Button
        size='small'
        style={{
          width: '5rem',
        }}
      >
        {path}
      </Button>
      <a
        onClick={() => path && openDir(path)}
        className='underline text-[.24rem] text-gray-300 transition-opacity hover:opacity-80 opacity-100'
      >
        打开目录
      </a>
    </div>
  );
};

export default TopDownloadDir;
