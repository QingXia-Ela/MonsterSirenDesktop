import $settingDownload, {
  changeDownloadPath,
} from '@/store/models/settings/download';
import { useStore } from '@nanostores/react';
import { FunctionComponent } from 'react';
import SubTitle from '../../components/SubTitle';
import Button from '@/components/Button';
import { open } from '@tauri-apps/api/dialog';

interface DownloadSettingsProps { }

const DownloadSettings: FunctionComponent<DownloadSettingsProps> = () => {
  const { path } = useStore($settingDownload);

  const handleSelectPath = async () => {
    const p = (await open({
      directory: true,
      multiple: false,
    })) as string;
    if (!p) return;
    changeDownloadPath(p);
  };

  return (
    <div className='w-full flex flex-col gap-1 text-[.32rem]'>
      <SubTitle>下载路径选择</SubTitle>
      <span>这功能还没启用，你改了也没用（逃</span>
      <Button
        onClick={handleSelectPath}
        title={path}
        className='w-full'
        decorate
      >
        {path?.length ? path : '选择路径'}
      </Button>
    </div>
  );
};

export default DownloadSettings;
