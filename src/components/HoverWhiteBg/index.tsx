import { HTMLAttributes, PropsWithChildren, forwardRef } from 'react';

interface HoverWhiteBgProps
  extends PropsWithChildren<HTMLAttributes<HTMLDivElement>> {}

const HoverWhiteBg = forwardRef<HTMLDivElement, HoverWhiteBgProps>(
  function HoverWhiteBg({ children, className, ...props }, ref) {
    return (
      <div
        ref={ref}
        className={`w-full h-full transition-[background-color] bg-white bg-opacity-0 hover:bg-opacity-10 p-1 cursor-pointer ${
          className ?? ''
        }`}
        {...props}
      >
        {children}
      </div>
    );
  },
);

export default HoverWhiteBg;
