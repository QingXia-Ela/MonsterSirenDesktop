import React, { FunctionComponent } from "react";
import {
  Dialog as MuiDialog,
  DialogProps as MuiDialogProps,
} from "@mui/material";
import Styles from "./index.module.scss";
import ZebraRight from "@/icons/Zebra/Right";
import ZebraLeft from "@/icons/Zebra/Left";
import { Transition } from "react-transition-group";
import { TransitionProps } from "react-transition-group/Transition";

const duration = 300;

const defaultStyle = {
  transition: `opacity ${duration}ms, transform ${duration}ms`,
  opacity: 0,
  width: "100%",
  height: "100%",
};

const TransitionComponent = React.forwardRef<
  HTMLDivElement,
  TransitionProps<HTMLElement>
>(({ in: inProp, children, ...props }, ref) => {
  return (
    <Transition in={inProp} timeout={duration} {...props}>
      {(state) => (
        <div
          style={{
            ...defaultStyle,
            opacity: state === "entering" || state === "entered" ? 1 : 0,
            transform:
              state === "entering" || state === "entered"
                ? "translateX(0)"
                : "translateY(-.6rem)",
          }}
          ref={ref}
        >
          {children as React.ReactElement}
        </div>
      )}
    </Transition>
  );
});

TransitionComponent.displayName = "TransitionComponent";

type DialogProps = MuiDialogProps;

const Dialog: FunctionComponent<DialogProps> = ({
  className,
  children,
  title,
  ...props
}) => {
  return (
    <MuiDialog
      classes={{
        paper: Styles.dialog__paper,
      }}
      className={`${Styles.dialog__bg} ${className ?? ""}`}
      TransitionComponent={TransitionComponent}
      {...props}
    >
      <div className={`${Styles.dialog}`}>
        <div className={`${Styles.dialog__title}`}>
          <ZebraLeft />
          {title}
          <ZebraRight />
        </div>
        <div className={`${Styles.dialog__body}`}>{children}</div>
      </div>
    </MuiDialog>
  );
};

export default Dialog;
