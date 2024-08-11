import { ButtonHTMLAttributes, forwardRef } from 'react';
import Styles from './index.module.scss';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  size?: 'small' | 'medium' | 'large';
  /**
   * Button theme, default is primary
   */
  theme?: 'primary' | 'secondary';
  /**
   * Decorate the button
   *
   * @default true
   */
  decorate?: boolean;
  disabled?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      decorate,
      theme = 'primary',
      disabled,
      children,
      size = 'medium',
      ...props
    },
    ref,
  ) => {
    return (
      <button
        ref={ref}
        className={`${Styles.button} 
      ${Styles[`button--${size}`]} 
      ${Styles[`button--${theme}`]} 
      ${decorate ? Styles.button_decorate : ''} 
      ${disabled ? Styles.button_disabled : ''}
      ${className}
    `}
        {...props}
      >
        <div className='w-full overflow-hidden text-ellipsis whitespace-nowrap'>
          {children}
        </div>
      </button>
    );
  },
);

Button.displayName = 'Button';

export default Button;
