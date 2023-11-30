import { forwardRef } from 'react';
import Styles from './index.module.scss';

interface DisabledMarkProps extends React.HTMLAttributes<HTMLDivElement> {
  disabled: boolean;
}

const DisabledMark = forwardRef<HTMLDivElement, DisabledMarkProps>(
  function DisabledMark(
    { disabled, children, className, ...props }: DisabledMarkProps,
    ref,
  ) {
    return (
      <div
        className={`w-full flex transition-opacity ${
          disabled && Styles.disabled
        } ${className ?? ''}`}
        ref={ref}
        {...props}
      >
        <div className='w-full'>{children}</div>
      </div>
    );
  },
);

export default DisabledMark;
