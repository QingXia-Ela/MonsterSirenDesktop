import React, { FunctionComponent, HTMLAttributes, ReactNode, createRef, useEffect, useState } from "react";
import Styles from './index.module.scss'
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import useCloseState from "@/hooks/useCloseState";
import IterParentElement from "@/utils/iterParentElement";

interface SingleOption {
  label: string
  value: string
  title?: string
  content?: ReactNode
  disabled?: boolean
}

interface DropDownProps extends HTMLAttributes<HTMLDivElement> {
  value?: any
  placeholder?: string
  arrow?: boolean
  listHeight: number | string
  borderTheme?: 'block' | 'line' | 'none'
  options: SingleOption[]
}

const DropDown: FunctionComponent<DropDownProps> = ({ value, placeholder, listHeight, arrow, options, borderTheme = "block", ...props }) => {
  const [currentValue, setCurrentValue] = useState(value ?? "");
  const [isOpen, handleClick] = useCloseState("data-select-wrapper");

  return (
    <div
      className={`${Styles.dropdown} ${borderTheme !== "none" && Styles[`dropdown--border-${borderTheme}`]}`}
      onClick={handleClick}
      {...props}
    >
      <div className={Styles.dropdown__label}>{currentValue.length ? currentValue : placeholder}</div>
      <ul
        data-select-wrapper
        style={{ height: isOpen ? listHeight : 0 }}
        className={Styles.dropdown__list}
      >
        {options.map(option => (
          <li
            key={option.value}
            title={option.title}
            className={`${Styles.dropdown__option} ${option.disabled ? Styles.disabled : ''}`}>
            {option.content ?? option.label}
          </li>
        ))}
      </ul>
      <i className={Styles.dropdown__icon}>
        {arrow && <ArrowBackIosNewIcon style={{
          fontSize: '.4rem',
          transform: isOpen ? 'rotate(-90deg)' : '',
          transition: 'transform .3s'
        }} />}
      </i>
    </div>
  );
}

export default DropDown;