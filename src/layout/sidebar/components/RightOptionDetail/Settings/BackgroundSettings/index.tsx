import { FunctionComponent } from "react";
import SubTitle from "../../components/SubTitle";
import { open } from '@tauri-apps/api/dialog'
import { readBinaryFile } from "@tauri-apps/api/fs";

interface BackgroundSettingsProps {

}

async function getBackgroundImage() {

  const selected = await open({
    filters: [
      {
        name: '图片',
        extensions: ['png', 'jpeg', 'jpg', 'bmp']
      }
    ]
  }) as string

  const ImageFile = new Image()
  ImageFile.src = `http://localhost:11453/?path=${selected}`

  return ImageFile
}

const BackgroundSettings: FunctionComponent<BackgroundSettingsProps> = () => {
  async function openFile() {
    console.log(await getBackgroundImage());

  }
  return (
    <div className="w-full flex flex-col gap-1">
      <SubTitle>基本设置</SubTitle>
      <div onClick={() => openFile()}>click</div>
    </div>
  );
}

export default BackgroundSettings;