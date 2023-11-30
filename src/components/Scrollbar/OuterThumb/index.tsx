import React, {
  FunctionComponent,
  CSSProperties,
  useImperativeHandle,
} from 'react';
import { positionValues } from 'react-custom-scrollbars';

export interface ScrollClipPathProps {
  lt: number | string;
  rt: number | string;
  lb: number | string;
  rb: number | string;
}

export interface OuterThumbProps extends React.HTMLProps<HTMLDivElement> {
  /** 以 rem 作为单位 */
  marginBarHeightLimit?: number;
  ScrollbarDegNum?: number;
}

export interface OuterThumbMethods {
  /**
   * Contorl bar scroll position
   * @param pos get by Scrollbars instance `getValues()` method
   * @param ScrollbarDegNum
   * @returns
   */
  ScrollTo: (pos: positionValues, ScrollbarDegNum?: number) => void;
}

const OuterThumbStyle: CSSProperties = {
  position: 'absolute',
  top: 0,
  right: 0,
  width: '10px',
  backgroundImage:
    'linear-gradient(45deg, transparent, transparent 40%, #ccc 0, #ccc 60%, transparent 0, transparent)',
  backgroundRepeat: 'repeat',
  backgroundSize: '0.3750rem 0.3750rem',
  transform: 'none !important',
};

const OuterThumb = React.forwardRef<OuterThumbMethods, OuterThumbProps>(
  function OuterThumb(
    { marginBarHeightLimit = 0, ScrollbarDegNum = 0.5, ...props },
    _ref,
  ) {
    const [sp, setSP] = React.useState<ScrollClipPathProps>({
      lt: -1,
      rt: 1,
      lb: -1,
      rb: 1,
    });

    useImperativeHandle<OuterThumbMethods, OuterThumbMethods>(_ref, () => {
      return {
        ScrollTo: (pos) => {
          const { top, clientHeight, scrollHeight } = pos;
          const scrollbarHeightP =
              Number((clientHeight / scrollHeight).toFixed(6)) * 100,
            emptySpace = (100 - scrollbarHeightP) * top;

          setSP({
            lt: (emptySpace - ScrollbarDegNum).toFixed(2),
            rt: (emptySpace + ScrollbarDegNum).toFixed(2),
            lb: (scrollbarHeightP + emptySpace - ScrollbarDegNum).toFixed(2),
            rb: (scrollbarHeightP + emptySpace + ScrollbarDegNum).toFixed(2),
          });
        },
      };
    });

    return (
      <div
        {...props}
        style={{
          clipPath: `polygon(0% ${sp.lt}%, 0% ${sp.lb}%, 100% ${sp.rb}%, 100% ${sp.rt}%)`,
          margin: `${marginBarHeightLimit}rem 0`,
          height: `calc(100% - ${marginBarHeightLimit * 2}rem)`,
        }}
      ></div>
    );
  },
);

export default OuterThumb;
