import {
  InputHTMLAttributes,
  FunctionComponent,
  forwardRef,
  useMemo,
} from "react";
import Styles from "./index.module.scss";
import type { SizeEnum } from "@/types";

interface InputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "size"> {
  size?: SizeEnum;
}

const Input: FunctionComponent<InputProps> = forwardRef<
  HTMLInputElement,
  InputProps
>(({ className, placeholder, value, children, size, ...props }, ref) => {
  const emptyInput = useMemo(() => {
    return !value;
  }, [value]);
  return (
    <div className={Styles.input}>
      <div className={Styles.wrapper}>
        <input
          className={Styles.inner}
          placeholder=""
          ref={ref}
          value={value}
          {...props}
        />
        {emptyInput && (
          <span className={Styles.placeholder}>{placeholder}</span>
        )}
      </div>
    </div>
  );
});

Input.displayName = "Input";

export default Input;
