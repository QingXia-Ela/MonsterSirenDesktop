import { FunctionComponent, HTMLAttributes } from "react";
import Styles from "./index.module.scss";

interface SplitProps extends HTMLAttributes<HTMLDivElement> {
  children?: any;
  width?: number | string;
}

export const ZebraLine = `${Styles.line}`;
export const ZebraLeft = `${Styles.zebra} ${Styles.zebra_left}`;
export const ZebraRight = `${Styles.zebra} ${Styles.zebra_right}`;

const Split: FunctionComponent<SplitProps> = ({
  children,
  width,
  className,
  ...props
}) => {
  return (
    <div className={`${Styles.zebra_divider} w100 ${className}`} {...props}>
      {children ?? (
        <>
          <div className={ZebraLeft}></div>
          <div className={ZebraLine} style={width ? { width } : {}}></div>
          <div className={ZebraRight}></div>
        </>
      )}
    </div>
  );
};

export default Split;
