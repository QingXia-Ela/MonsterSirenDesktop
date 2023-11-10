import { FunctionComponent, DetailedHTMLProps, HTMLAttributes, forwardRef, AnchorHTMLAttributes } from "react";
import Styles from './index.module.scss'


interface NormalListItemProps extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  invalid?: boolean
  selected?: boolean
  disabled?: boolean
  activeOnClick?: boolean
  /** 默认 0.98 */
  SmallScaleNum?: number
}

const getSpeicalStyle = (props: NormalListItemProps) => {
  const { invalid, selected, activeOnClick, disabled } = props

  let finalStyle = ""

  if (invalid) finalStyle += `${Styles.invalid} `
  if (selected) finalStyle += `${Styles.active} `
  if (activeOnClick) finalStyle += `${Styles.active_on_click} `
  if (disabled) finalStyle += `${Styles.disabled}`

  return finalStyle
}

export const getNormalListItemStyle = ({ className, SmallScaleNum, invalid, selected, activeOnClick, disabled }: NormalListItemProps = {}) => (
  {
    className: `${Styles.normal_list_item} ${getSpeicalStyle({
      invalid, selected, activeOnClick, disabled
    })} ${className ?? ""}`,
    style: {
      "--normal-list-item-scale": SmallScaleNum ?? 0.98
    }
  }
)

const NormalListItem = forwardRef<HTMLAnchorElement, NormalListItemProps>(({ SmallScaleNum, className, children, ...p }, ref) => (
  <a
    {...p}
    className={`${Styles.normal_list_item} ${getSpeicalStyle(p)} ${className ?? ""}`}
    ref={ref}
    style={{
      ...p.style,
      // @ts-expect-error: custom val
      "--normal-list-item-scale": SmallScaleNum ?? 0.98
    }}
  >{children}</a>
))

NormalListItem.displayName = "NormalListItem"

export default NormalListItem;
