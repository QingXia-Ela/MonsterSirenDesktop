import { throttle } from 'lodash';
import {
  createRef,
  FunctionComponent,
  PropsWithChildren,
  useEffect,
  useState,
} from 'react';
import SilverBorder, { SilverBorderMethods } from './border';
import Styles from './index.module.scss';

interface SilverBorderButtonProps {}

const SilverBorderButton: FunctionComponent<
  React.DetailedHTMLProps<
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  >
> = ({ children, ...p }) => {
  const svgWrapper = createRef<HTMLButtonElement>();
  const Border = createRef<SilverBorderMethods>();

  useEffect(() => {
    const w = svgWrapper.current!.clientWidth,
      h = svgWrapper.current!.clientHeight;
    const moveFunc = throttle(({ offsetX, offsetY }: MouseEvent) => {
      Border.current?.changeBorderPos({
        x1: offsetX / w,
        y1: offsetY / h,
        x2: offsetX / w,
        y2: offsetY / h,
      });
    }, 60);
    svgWrapper.current?.addEventListener('mousemove', moveFunc);
    svgWrapper.current?.addEventListener('mouseleave', () => {
      setTimeout(() => {
        Border.current?.changeBorderPos(
          {
            x1: 1,
            y1: 0,
            x2: 0,
            y2: 1,
          },
          300,
          true,
        );
      }, 200);
    });
  }, []);
  return (
    <button
      {...p}
      className={`${Styles.silver_button} ${p.className ?? ''}`}
      ref={svgWrapper}
    >
      <SilverBorder ref={Border} />
      {children}
    </button>
  );
};

export default SilverBorderButton;
