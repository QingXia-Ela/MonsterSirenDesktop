import SirenLogo from '@/icons/tsx/SirenLogo';
import { FunctionComponent } from 'react';

interface PendingTipsProps {}

const PendingTips: FunctionComponent<PendingTipsProps> = () => {
  return (
    <div className='w-full h-full flex justify-center items-center flex-col'>
      <div className='w-8 h-4 mb-2'>
        <SirenLogo className='fill-[#91959d] opacity-50' />
      </div>
      <span className='text-[.3rem] font-bold text-[#ccc]'>
        加载中 (¦3【▓▓】
      </span>
    </div>
  );
};

export default PendingTips;
