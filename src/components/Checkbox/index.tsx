import { FunctionComponent, InputHTMLAttributes, forwardRef, useState } from "react";
import Styles from "./index.module.scss";

interface CheckboxProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "onChange"> {
  onChange?: (e: boolean) => void;
}

const Checkbox = forwardRef<HTMLDivElement, CheckboxProps>(function Checkbox({
  checked,
  onChange,
  disabled,
  children,
  ...props
}, ref) {
  const [checkedState, setCheckedState] = useState(checked);

  const handleChange = () => {
    onChange?.(!checkedState);
    setCheckedState(!checkedState);
  };

  return (
    <div
      className={`${Styles.checkbox} ${disabled && Styles.disabled}`}
      onClick={handleChange}
      ref={ref}
    >
      <input
        type="checkbox"
        style={{ display: "none" }}
        checked={checkedState}
        readOnly
        {...props}
      />
      <div
        className={`${Styles.checkbox__check}
      ${checkedState && Styles.selected}`}
      ></div>
      <div className={Styles.checkbox__content}>{children}</div>
    </div>
  );
})

export default Checkbox;
