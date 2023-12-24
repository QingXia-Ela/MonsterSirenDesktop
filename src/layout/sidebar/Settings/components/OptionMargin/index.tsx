import { PropsWithChildren } from 'react';

interface OptionMarginProps extends PropsWithChildren {}

function OptionMargin({ children }: OptionMarginProps) {
  return <div className='w-full flex flex-col gap-[.36rem]'>{children}</div>;
}

export default OptionMargin;
