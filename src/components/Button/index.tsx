import { ButtonHTMLAttributes, FunctionComponent } from "react";
import Styles from './index.module.scss'

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

const Button: FunctionComponent<ButtonProps> = ({ className, decorate, theme = 'primary', disabled, children, size, ...props }) => {
  return (
    <button className={`${Styles.button} 
    ${Styles[`button--${size}`]} 
    ${Styles[`button--${theme}`]} 
    ${decorate && Styles.button_decorate} 
    ${disabled && Styles.button_disabled}
    ${className}`} {...props}>
      {children}
    </button>
  );
}

export default Button;
