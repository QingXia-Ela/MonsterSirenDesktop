import { FunctionComponent } from "react";
import SubTitle from "../../components/SubTitle";
import { open } from '@tauri-apps/api/dialog'
import { useStore } from "@nanostores/react";
import $settingBackground, { changeBackgroundEnabled } from "@/store/models/settings/background";
import HoverWhiteBg from "@/components/HoverWhiteBg";
import Checkbox from "@/components/Checkbox";
import DisabledMark from "@/components/DisabledMark";
import Button from "@/components/Button";

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
  const { enable, url, maskOpacity } = useStore($settingBackground)
  return (
    <div className="w-full flex flex-col gap-1">
      <SubTitle>基本设置</SubTitle>
      <HoverWhiteBg>
        <Checkbox
          checked={enable}
          onChange={changeBackgroundEnabled}
          theme="config"
        >
          启用自定义背景图
        </Checkbox>
      </HoverWhiteBg>
      <DisabledMark disabled={!enable}>
        <SubTitle>背景图选择</SubTitle>
        <Button className="mt-2 w-full" decorate>
          {url?.length ? url : "选择图片"}
        </Button>
      </DisabledMark>
    </div>
  );
}

export default BackgroundSettings;