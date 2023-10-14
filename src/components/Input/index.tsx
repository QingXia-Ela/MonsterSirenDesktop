import { InputHTMLAttributes, FunctionComponent, forwardRef, useMemo } from "react";
import Styles from './index.module.scss'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {

}

const Input: FunctionComponent<InputProps> = forwardRef<HTMLInputElement, InputProps>(({ className, placeholder, value, children, ...props }, ref) => {
  const emptyInput = useMemo(() => {
    return !value
  }, [value])
  return (
    <div className={Styles.input}>
      <div className={Styles.wrapper}>
        <input className={Styles.inner} placeholder="" ref={ref} value={value} {...props} />
        {emptyInput && <span className={Styles.placeholder}>{placeholder}</span>}
      </div>
    </div>
  );
})

export default Input;