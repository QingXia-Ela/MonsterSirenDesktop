import { HTMLAttributes, forwardRef } from 'react';

interface SubTitleProps extends HTMLAttributes<HTMLSpanElement> {}

const SubTitle = forwardRef<HTMLSpanElement, SubTitleProps>(function SubTitle(
  { children, className, ...props },
  ref,
) {
  return (
    <span
      ref={ref}
      className={`block text-[.4rem] font-['SourceHanSansCN-Bold'] ${
        className ?? ''
      }`}
      {...props}
    >
      {children}
    </span>
  );
});

export default SubTitle;
