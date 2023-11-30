import {
  InputHTMLAttributes,
  FunctionComponent,
  forwardRef,
  useMemo,
} from 'react';
import Styles from './index.module.scss';

interface InputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  addonAfter?: React.ReactNode;
}

const Input: FunctionComponent<InputProps> = forwardRef<
  HTMLInputElement,
  InputProps
>(({ className, placeholder, value, addonAfter, ...props }, ref) => {
  const emptyInput = useMemo(() => {
    return !value;
  }, [value]);
  return (
    <div className={`${Styles.input} ${className}`}>
      <div className={Styles.wrapper}>
        <input
          className={Styles.inner}
          placeholder=''
          ref={ref}
          value={value}
          {...props}
        />
        {emptyInput && (
          <span className={Styles.placeholder}>{placeholder}</span>
        )}
        {addonAfter}
      </div>
    </div>
  );
});

Input.displayName = 'Input';

export default Input;
