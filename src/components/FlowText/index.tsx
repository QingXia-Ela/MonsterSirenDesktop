import {
  FunctionComponent,
  PropsWithChildren,
  createRef,
  useEffect,
  useState,
} from 'react';
import Styles from './index.module.scss';

interface FlowTextProps extends PropsWithChildren {}

const FlowText: FunctionComponent<FlowTextProps> = ({ children }) => {
  const textContainer = createRef<HTMLSpanElement>(),
    outerContainer = createRef<HTMLDivElement>();

  const [moveValue, setMoveValue] = useState(0);

  const animateTime = moveValue / 10 > 4 ? moveValue / 10 : 4;

  useEffect(() => {
    if (textContainer.current && outerContainer.current) {
      const outerWidth = outerContainer.current.offsetWidth,
        textWidth = textContainer.current.offsetWidth;
      setMoveValue(textWidth - outerWidth);
    }
  }, [textContainer, outerContainer]);

  return (
    <div
      ref={outerContainer}
      style={{
        // @ts-expect-error: custom val
        '--move-value': `-${moveValue}px`,
      }}
      className='w-full overflow-hidden'
      title={typeof children === 'string' ? children : ''}
    >
      <span
        className={`${Styles.textContainer} whitespace-nowrap`}
        style={{
          animationDuration: `${animateTime}s`,
        }}
        ref={textContainer}
      >
        {children}
      </span>
    </div>
  );
};

export default FlowText;
