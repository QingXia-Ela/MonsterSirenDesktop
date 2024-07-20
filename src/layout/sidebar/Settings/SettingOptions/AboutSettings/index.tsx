import { FunctionComponent } from 'react';
import { version } from '@/../package.json';
import Button from '@/components/Button';

interface AboutSettingsProps {}

const AboutSettings: FunctionComponent<AboutSettingsProps> = () => {
  return (
    <div className='w-full flex flex-col gap-1 text-[.32rem]'>
      <span>软件版本：{version}</span>
      <Button className='w-full'>
        <a
          target='_blank'
          className='text-white no-underline w-full block'
          href='https://github.com/QingXia-Ela/MonsterSirenDesktop'
          rel='noreferrer'
        >
          GitHub
        </a>
      </Button>
      <Button className='w-full'>
        <a
          target='_blank'
          className='text-white no-underline w-full block'
          href='https://monster-siren.hypergryph.com'
          rel='noreferrer'
        >
          塞壬唱片官网
        </a>
      </Button>
      <span>本软件仅供学习交流使用，下载后请于24小时内删除。</span>
      <span>
        网站本体来源于塞壬唱片官网，其中所有素材版权均归鹰角网络所有。
      </span>
      <span>
        本软件为同人作品，不代表官方任何内容。软件行为本身与官方均无关。
      </span>
      <span>软件在发布后除了漏洞以外不会进行任何更新</span>
      <span>
        建议您在选择插件时只选用来自本仓库发布的插件，代码公开透明，且不会窃取隐私信息
      </span>
    </div>
  );
};

export default AboutSettings;
