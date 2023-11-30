import { DebouncedFunc, throttle } from 'lodash';
import {
  createRef,
  forwardRef,
  FunctionComponent,
  memo,
  RefObject,
  useEffect,
  useImperativeHandle,
  useState,
} from 'react';
import Styles from './index.module.scss';
import { Tween, Easing } from '@tweenjs/tween.js';

interface PosNum {
  x1: string | number;
  y1: string | number;
  x2: string | number;
  y2: string | number;
}

interface SilverBorderProps {}

export interface SilverBorderMethods {
  changeBorderPos: (p: PosNum, duration?: number, isLeave?: boolean) => void;
}

let TweenObj: any, timer: NodeJS.Timer | undefined;

const handleRadialGradient = (
  { current: c1 }: RefObject<SVGRadialGradientElement>,
  { current: c2 }: RefObject<SVGRadialGradientElement>,
) => ({
  x1: c1!.getAttribute('cx'),
  y1: c1!.getAttribute('cy'),
  x2: c2!.getAttribute('cx'),
  y2: c2!.getAttribute('cy'),
});

/** 可优化 */
const SilverBorder = forwardRef<SilverBorderMethods, SilverBorderProps>(
  (props, ref) => {
    const r1 = createRef<SVGRadialGradientElement>();
    const r2 = createRef<SVGRadialGradientElement>();

    useEffect(() => {
      return () => {
        clearInterval(timer);
        timer = undefined;
      };
    }, []);

    useImperativeHandle(ref, () => ({
      changeBorderPos: (p: PosNum, duration = 60, isLeave = false) => {
        TweenObj?.stop();
        TweenObj = new Tween(handleRadialGradient(r1, r2))
          .to(p, duration)
          .onUpdate(({ x1, y1, x2, y2 }) => {
            r1.current?.setAttribute('cx', x1!);
            r1.current?.setAttribute('cy', y1!);
            r2.current?.setAttribute('cx', x2!);
            r2.current?.setAttribute('cy', y2!);
          })
          .start();

        if (isLeave) {
          setTimeout(() => {
            clearInterval(timer);
            timer = undefined;
          }, duration);
        } else {
          if (!timer)
            timer = setInterval(() => {
              TweenObj?.update();
            }, 33);
        }
      },
    }));

    return (
      <svg className={Styles.silver_border} viewBox='0 0 138.25 45.25' key={1}>
        <defs>
          <radialGradient
            id='revealButtonGradient1'
            cx={1}
            cy={0}
            r='1'
            ref={r1}
          >
            <stop offset='0%' stopColor='rgba(255, 255, 255, 1)'></stop>
            <stop offset='100%' stopColor='rgba(255, 255, 255, 0.1)'></stop>
          </radialGradient>
          <radialGradient
            id='revealButtonGradient2'
            cx={0}
            cy={1}
            r='1'
            ref={r2}
          >
            <stop offset='0%' stopColor='rgba(255, 255, 255, 1)'></stop>
            <stop offset='100%' stopColor='rgba(255, 255, 255, 0.1)'></stop>
          </radialGradient>
          <path
            id='revealButtonPath'
            strokeWidth='3'
            fill='transparent'
            className={Styles.path}
            d='M0.750,0.750 L136.750,0.750 L136.750,43.750 L0.750,43.750 L0.750,0.750 Z'
          ></path>
        </defs>
        <use
          href='#revealButtonPath'
          stroke='url(#revealButtonGradient1)'
        ></use>
        <use
          href='#revealButtonPath'
          stroke='url(#revealButtonGradient2)'
        ></use>
      </svg>
    );
  },
);

SilverBorder.displayName = 'SilverBorder';

export default SilverBorder;
