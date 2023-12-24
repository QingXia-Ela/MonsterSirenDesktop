import { FunctionComponent } from "react";
import SubTitle from "../../components/SubTitle";
import { version } from '@/../package.json'
import Button from "@/components/Button";

interface AboutSettingsProps {

}

const AboutSettings: FunctionComponent<AboutSettingsProps> = () => {
  return (
    <div className="w-full flex flex-col gap-1 text-[.32rem]">
      <span>软件版本：{version}</span>
      <Button className="w-full">
        <a target="_blank" className="text-white no-underline w-full block" href="https://github.com/QingXia-Ela/MonsterSirenDesktop" rel="noreferrer">GitHub官网</a>
      </Button>
      <Button className="w-full pb-1">
        <a target="_blank" className="text-white no-underline w-full block" href="https://monster-siren.hypergryph.com" rel="noreferrer">塞壬唱片官网</a>
      </Button>
      <span>本软件仅供学习交流使用，下载后请于24小时内删除。</span>
      <span>网站本体来源于塞壬唱片官网，其中所有素材均归鹰角网络所有。</span>
      <span>本软件为同人作品，不代表官方任何内容。软件行为本身与官方均无关。</span>
    </div>
  );
}

export default AboutSettings;