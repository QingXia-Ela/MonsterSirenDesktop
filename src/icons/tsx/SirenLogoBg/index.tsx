import { HTMLAttributes, forwardRef } from 'react';
import Styles from './index.module.scss';

interface SirenLogoBgProps extends HTMLAttributes<HTMLDivElement> {
  svgHeight?: string;
}

const SirenLogoBg = forwardRef<HTMLDivElement, SirenLogoBgProps>(
  function SirenLogoBg({ className, svgHeight = '1rem', ...props }, ref) {
    return (
      <div className={`${className ?? ''} ${Styles.bg}`} ref={ref} {...props}>
        <svg
          style={{ height: svgHeight }}
          viewBox='0 0 530 50'
          version='1.1'
          xmlns='http://www.w3.org/2000/svg'
        >
          <defs>
            <clipPath id='newsHeader'>
              <path
                fill='currentColor'
                d='M 106.3 49.3 L 86.4 0.2 L 530 0.2 L 530 49.3 Z M 88.3 49.3 L 75.3 16.7 L 72.1 24.7 L 81.9 49.3 L 68.7 49.3 L 65.5 41.4 L 62.4 49.3 L 49.1 49.3 L 58.9 24.7 L 55.7 16.7 L 42.8 49.3 L 29.5 49.3 L 49 0.2 L 49.1 0.2 L 62.3 0.2 L 62.4 0.2 L 65.5 8.1 L 68.7 0.2 L 68.8 0.2 L 81.9 0.2 L 82 0.2 L 101.5 49.3 L 88.3 49.3 Z M 0 49.3 L 0 0.2 L 44 0.2 L 24.1 49.3 Z'
              ></path>
            </clipPath>
            <filter id='noise'>
              <feTurbulence
                type='fractalNoise'
                baseFrequency='80'
                result='noisy'
              ></feTurbulence>
              <feColorMatrix type='saturate' values='0'></feColorMatrix>
              <feBlend in='SourceGraphic' in2='noisy' mode='multiply'></feBlend>
            </filter>
          </defs>
          <g>
            <rect
              filter='url(#noise)'
              clipPath='url(#newsHeader)'
              fill='currentColor'
              width='100%'
              height='100%'
            ></rect>
          </g>
        </svg>
      </div>
    );
  },
);

export default SirenLogoBg;
