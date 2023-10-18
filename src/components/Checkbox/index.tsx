import {
  FunctionComponent,
  InputHTMLAttributes,
  forwardRef,
  useState,
} from "react";
import Styles from "./index.module.scss";

/**
 * Checkbox 主题，默认为 `normal`，`config` 一般用于配置页面
 */
type CheckboxTheme = "normal" | "config";

interface CheckboxProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "onChange"> {
  onChange?: (e: boolean) => void;
  theme?: CheckboxTheme;
}

const CheckboxComponent: FunctionComponent<{
  checked?: boolean;
  theme?: CheckboxTheme;
  children: React.ReactNode;
}> = ({ checked, theme, children }) => (
  <div
    className={`w-full flex items-center ${
      theme === "config" ? "flex-row-reverse justify-between" : ""
    }`}
  >
    <div
      className={`ml-1
      ${Styles.checkbox__check}
      ${checked && Styles.selected}
      ${
        Styles[
          theme === "config" ? "checkboxTheme--config" : "checkboxTheme--normal"
        ]
      }`}
    ></div>
    <div className={Styles.checkbox__content}>{children}</div>
  </div>
);

const Checkbox = forwardRef<HTMLDivElement, CheckboxProps>(function Checkbox(
  { checked, onChange, disabled, children, theme = "normal", ...props },
  ref,
) {
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
      <CheckboxComponent checked={checkedState} theme={theme}>
        {children}
      </CheckboxComponent>
    </div>
  );
});

export default Checkbox;
