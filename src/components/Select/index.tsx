import React, {
  FunctionComponent,
  HTMLAttributes,
  ReactNode,
  createRef,
  useEffect,
  useState,
} from "react";
import Styles from "./index.module.scss";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import useCloseState from "@/hooks/useCloseState";

interface SingleOption {
  label: string;
  value: string;
  title?: string;
  content?: ReactNode;
  disabled?: boolean;
}

interface DropDownProps extends HTMLAttributes<HTMLDivElement> {
  value?: any;
  placeholder?: string;
  arrow?: boolean;
  height: number | string;
  listHeight: number | string;
  onChange?: (value: any) => void;
  borderTheme?: "block" | "line" | "none";
  addonListBefore?: ReactNode;
  addonListAfter?: ReactNode;
  /** @default true */
  closeAfterSelect?: boolean;
  options: SingleOption[];
}

const DropDown: FunctionComponent<DropDownProps> = ({
  value,
  placeholder,
  height,
  listHeight,
  arrow,
  options,
  onChange,
  addonListBefore,
  addonListAfter,
  closeAfterSelect = true,
  borderTheme = "block",
  ...props
}) => {
  const [currentValue, setCurrentValue] = useState(value ?? "");
  const [currentLabel, setCurrentLabel] = useState(
    value ? options.find((option) => option.value === value)?.label : "",
  );
  const [isOpen, handleClick] = useCloseState(
    "data-select-wrapper",
    closeAfterSelect,
  );

  const handleListClick = (e: React.MouseEvent<HTMLUListElement>) => {
    const label = (e.target as HTMLLIElement).getAttribute("data-label");
    const value = (e.target as HTMLLIElement).getAttribute("data-value");
    onChange?.(value);
    setCurrentValue(value);
    setCurrentLabel(label);
  };

  return (
    <div
      className={`${Styles.dropdown} ${
        borderTheme !== "none" && Styles[`dropdown--border-${borderTheme}`]
      }`}
      onClick={handleClick}
      {...props}
    >
      <div className={Styles.dropdown__label}>
        {currentLabel?.length ? currentLabel : placeholder}
      </div>
      <div
        data-select-wrapper
        style={{ height: isOpen ? height : 0 }}
        className={Styles.dropdown__content}
      >
        {addonListBefore}
        <ul
          className={Styles.dropdown__list}
          style={{ height: listHeight }}
          onClick={handleListClick}
        >
          {options.map((option) => (
            <li
              key={option.value}
              data-label={option.label}
              data-value={option.value}
              title={option.title}
              className={`${Styles.dropdown__option} 
            ${currentValue === option.value ? Styles.selected : ""} 
            ${option.disabled ? Styles.disabled : ""}`}
            >
              {option.content ?? option.label}
            </li>
          ))}
        </ul>
        {addonListAfter}
      </div>
      <i className={Styles.dropdown__icon}>
        {arrow && (
          <ArrowBackIosNewIcon
            style={{
              fontSize: ".4rem",
              transform: isOpen ? "rotate(-90deg)" : "",
              transition: "transform .3s",
            }}
          />
        )}
      </i>
    </div>
  );
};

export default DropDown;
