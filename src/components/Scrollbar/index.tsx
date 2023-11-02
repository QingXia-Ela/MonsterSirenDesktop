import React, { FunctionComponent, PropsWithChildren } from "react";
import Styles from "./index.module.scss";
import {
  ScrollbarProps as CustomScrollbarProps,
  Scrollbars,
} from "react-custom-scrollbars";
import OuterThumb, { OuterThumbMethods } from "./OuterThumb";
import VirtuosoWrapper, {
  VirtuosoMethods,
  VirtuosoWrapperProps,
} from "./VirtuosoWrapper";
import throttle from "lodash/throttle";
import { appWindow } from "@tauri-apps/api/window";

interface ScrollbarProps {
  /** 以 rem 作为单位 */
  marginBarHeightLimit?: number;
  /** 最小 0 */
  ScrollbarDegNum?: number;
  /**
   * 启用虚拟列表，启用后传入 children 的内容会被忽略，渲染由 `Virtuoso` 完成
   *
   * @example
   * const options = {
   *  // 外侧默认会放在 wrapper div 上
   *  style: {
   *    width: "95%"
   *  },
   *  // 在 Virtuoso 实例上解构
   *  VirtuosoProps: {
   *    totalCount: 200,
   *    itemContent: (idx) => <div>{`Item ${idx}`}</div>
   *  }
   *}
   */
  VirtuosoOptions?: VirtuosoWrapperProps;
  ScrollbarProps?: CustomScrollbarProps;
}

let change = false

const Scrollbar: FunctionComponent<PropsWithChildren<ScrollbarProps>> = ({
  children,
  marginBarHeightLimit = 0,
  ScrollbarDegNum,
  VirtuosoOptions,
  ScrollbarProps,
}) => {
  const [fillHeight, setFillHeight] = React.useState(0);
  const ScrollInstance = React.createRef<Scrollbars>();
  const OuterThumbInstance = React.createRef<OuterThumbMethods>();
  const VirtuosoWrapperRef = React.createRef<VirtuosoMethods>();
  // resize on children change
  React.useEffect(() => {
    OuterThumbInstance.current?.ScrollTo(ScrollInstance.current!.getValues());
    if (window.__TAURI_METADATA__) {
      if (!change) {
        change = true
        appWindow.onResized(function () {
          requestAnimationFrame(() => {
            OuterThumbInstance.current?.ScrollTo(
              ScrollInstance.current!.getValues(),
            );
          })
        });
      }
    }
  }, [children, OuterThumbInstance]);

  const marginBarHeightStyle = React.useMemo(
    () => ({
      width: "0.12rem",
      margin: `${marginBarHeightLimit}rem 0`,
      height: `calc(100% - ${marginBarHeightLimit * 2}rem)`,
    }),
    [marginBarHeightLimit],
  );

  const memoVirtuosoProps = React.useMemo<VirtuosoWrapperProps>(
    () => ({
      ...VirtuosoOptions,
      VirtuosoProps: {
        ...VirtuosoOptions?.VirtuosoProps,
        totalListHeightChanged(height) {
          setFillHeight(height);
          // init height on new height value
          OuterThumbInstance.current?.ScrollTo({
            ...ScrollInstance.current!.getValues(),
            scrollHeight: height,
          });
        },
        onScroll: (e) => {
          // @ts-expect-error: element attr
          SyncScroll(e.target.scrollTop, e.target.scrollLeft, true);
        },
      },
    }),
    [VirtuosoOptions, OuterThumbInstance],
  );

  const SyncScroll = React.useMemo(
    () =>
      throttle((top: number, left: number, isVirtuoso?: boolean) => {
        OuterThumbInstance.current?.ScrollTo(
          ScrollInstance.current!.getValues(),
        );
        if (isVirtuoso) {
          ScrollInstance.current?.scrollTop(top);
        } else {
          VirtuosoWrapperRef.current?.VirtuosoInstance.current?.scrollTo({
            top,
            left,
          });
        }
      }, 33),
    [OuterThumbInstance],
  );

  return (
    <div className={Styles.white_scroll_wrapper}>
      <OuterThumb
        marginBarHeightLimit={marginBarHeightLimit}
        className={Styles["white_zebra_scrollbar_thumb-vertical"]}
        ref={OuterThumbInstance}
        ScrollbarDegNum={ScrollbarDegNum}
      />
      <Scrollbars
        {...ScrollbarProps}
        ref={(e) => {
          // @ts-expect-error: set ref
          if (ScrollbarProps?.ref) ScrollbarProps.ref.current = e;
          // @ts-expect-error: set ref
          ScrollInstance.current = e;
        }}
        renderTrackVertical={(prop) => (
          <div
            {...prop}
            className={Styles["white_zebra_scrollbar_track-vertical"]}
            style={{ ...prop.style, ...marginBarHeightStyle }}
          />
        )}
        renderThumbVertical={(prop) => <div {...prop}></div>}
        renderView={(p) => (
          <div {...p} className={`${Styles.scroll_view} scrollbar__hidden`}></div>
        )}
        onScroll={(e) => {
          ScrollbarProps?.onScroll && ScrollbarProps.onScroll(e);
          // @ts-expect-error: element attr
          SyncScroll(e.target.scrollTop, e.target.scrollLeft);
        }}
      >
        {VirtuosoOptions ? (
          <div
            style={{
              height: fillHeight,
            }}
          ></div>
        ) : (
          children
        )}
      </Scrollbars>
      {VirtuosoOptions ? (
        <VirtuosoWrapper {...memoVirtuosoProps} ref={VirtuosoWrapperRef} />
      ) : null}
    </div>
  );
};

export default Scrollbar;
