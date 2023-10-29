import { Tooltip } from "@mui/material";
import Styles from "./index.module.scss";

const StyledTooltip = (props: any) => {
  return (
    <Tooltip
      followCursor
      placement="bottom-start"
      {...props}
      classes={{
        tooltip: Styles.tooltip,
      }}
    />
  );
};

export default StyledTooltip as typeof Tooltip;
