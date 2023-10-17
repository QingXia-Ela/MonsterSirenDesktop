import { Tooltip } from "@mui/material";
import Styles from './index.module.scss'

const StyledTooltip = (props: any) => {
  return <Tooltip classes={{
    tooltip: Styles.tooltip
  }} {...props} />
}

export default StyledTooltip as typeof Tooltip