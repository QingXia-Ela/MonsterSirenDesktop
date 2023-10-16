import React, { FunctionComponent } from "react";
import { VirtuosoHandle, Virtuoso, VirtuosoProps } from "react-virtuoso";
import Styles from './index.module.scss'

export interface VirtuosoWrapperProps extends React.HTMLProps<HTMLDivElement> {
  VirtuosoProps: VirtuosoProps<any, any>
}

export interface VirtuosoElement {

}

export interface VirtuosoMethods {
  VirtuosoInstance: React.RefObject<VirtuosoHandle>
  VirtuosoScroller: React.RefObject<HTMLDivElement>
}

const VirtuosoWrapper = React.forwardRef<VirtuosoMethods, VirtuosoWrapperProps>(function VirtuosoWrapper({ VirtuosoProps, ...props }, ref) {
  const VirtuosoInstance = React.createRef<VirtuosoHandle>()
  const VirtuosoScroller = React.createRef<HTMLDivElement>()

  React.useImperativeHandle(ref, () => {
    return {
      VirtuosoInstance,
      VirtuosoScroller
    }
  })

  return (
    <div
      {...props}
      className={Styles.virtuoso_style}
    >
      <Virtuoso
        {...VirtuosoProps}
        className={`${Styles.virtuoso} hide_scrollbar`}
        ref={VirtuosoInstance}
        // @ts-expect-error: change instance
        scrollerRef={(e) => VirtuosoScroller.current = e}
      />
    </div>
  );
})

export default VirtuosoWrapper;