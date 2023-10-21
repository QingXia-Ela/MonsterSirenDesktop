import { FunctionComponent, useEffect } from "react";
import SubTitle from "../../components/SubTitle";
import { open } from '@tauri-apps/api/dialog'
import { useStore } from "@nanostores/react";
import $settingBackground, { changeBackgroundEnabled, changeBackgroundImage } from "@/store/models/settings/background";
import HoverWhiteBg from "@/components/HoverWhiteBg";
import Checkbox from "@/components/Checkbox";
import DisabledMark from "@/components/DisabledMark";
import Button from "@/components/Button";
import useSirenCtx from "@/hooks/useSirenCtx";
import Styles from './index.module.scss'

interface BackgroundSettingsProps {

}

const INJECT_BACKGROUND_ID = "inject-app__bg"

function getEncodedUrl(url: string) {
  return encodeURI(`http://localhost:11453/?path=${url}`)
}

async function getBackgroundImage() {
  const ImagePath = await open({
    filters: [
      {
        name: '图片',
        extensions: ['png', 'jpeg', 'jpg', 'bmp']
      }
    ]
  }) as string

  // Image

  return {
    path: ImagePath,
    encodedUrl: getEncodedUrl(ImagePath)
  }
}

const BackgroundSettings: FunctionComponent<BackgroundSettingsProps> = () => {
  const { enable, url, maskOpacity } = useStore($settingBackground)
  async function handleSelectImage() {
    const { path } = await getBackgroundImage()
    changeBackgroundImage(path)
  }

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
        <Button onClick={handleSelectImage} title={url} className="mt-2 w-full" decorate>
          {url?.length ? url : "选择图片"}
        </Button>
      </DisabledMark>
    </div>
  );
}

export default BackgroundSettings;