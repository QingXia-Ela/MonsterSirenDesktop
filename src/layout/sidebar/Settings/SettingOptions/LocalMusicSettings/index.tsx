import { FunctionComponent } from "react";
import SubTitle from "../../components/SubTitle";

interface LocalMusicSettingsProps {

}

const LocalMusicSettings: FunctionComponent<LocalMusicSettingsProps> = () => {
  return (
    <div className='w-full flex flex-col gap-1 text-[.32rem]'>
      <SubTitle>添加/移除文件夹</SubTitle>

    </div>
  );
}

export default LocalMusicSettings;