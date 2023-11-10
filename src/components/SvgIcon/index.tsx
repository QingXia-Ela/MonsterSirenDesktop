import { FunctionComponent, HTMLAttributes } from "react";
import { Icon } from '@iconify/react';
import Styles from './index.module.scss'

interface SvgIconProps extends HTMLAttributes<HTMLElement> {
  name: string
  flip?: 'horizontal' | 'vertical' | 'both'
  rotate?: number
  color?: string
  size?: string | number
}

const SvgIcon: FunctionComponent<SvgIconProps> = ({ name, ...props }) => {
  const transform = []
  if (props.flip) {
    switch (props.flip) {
      case 'horizontal':
        transform.push('rotateY(180deg)')
        break
      case 'vertical':
        transform.push('rotateX(180deg)')
        break
      case 'both':
        transform.push('rotateX(180deg)')
        transform.push('rotateY(180deg)')
        break
    }
  }
  if (props.rotate) {
    transform.push(`rotate(${props.rotate % 360}deg)`)
  }
  const style = {
    ...(props.color && { color: props.color }),
    ...(props.size && { fontSize: typeof props.size === 'number' ? `${props.size}px` : props.size }),
    ...(transform.length && { transform: transform.join(' ') }),
  }

  return (
    <i className={Styles.icon} style={style}>
      {
        name.indexOf('ep:') === 0
          ? <Icon icon={name} />
          : (
            <svg aria-hidden="true">
              <use xlinkHref={`#icon-${name}`} />
            </svg>
          )
      }
    </i>
  );
}

export default SvgIcon;