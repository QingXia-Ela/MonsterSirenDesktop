import SirenLogo from '@/icons/tsx/SirenLogo';
import { FunctionComponent } from 'react';

interface RetryTipsProps {
  retryFn?: any;
}

const RetryTips: FunctionComponent<RetryTipsProps> = ({ retryFn }) => {
  return (
    <div className='w-full h-full flex justify-center items-center flex-col'>
      <div className='w-8 h-4 mb-2'>
        <SirenLogo className='fill-[#91959d] opacity-50' />
      </div>
      <span className='text-[.3rem] font-bold text-[#ccc]'>
        加载失败了{retryFn ? <span onClick={retryFn}>点击重试</span> : ''}
        ━━━∑(ﾟ□ﾟ*川━
      </span>
    </div>
  );
};

export default RetryTips;
