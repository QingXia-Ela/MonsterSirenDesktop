import { FunctionComponent } from 'react';
import MuiSnackbar, {
  SnackbarProps as MuiSnackbarProps,
} from '@mui/material/Snackbar';
import Alert, { AlertProps } from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import Styles from './index.module.scss';

type SnackbarProps = MuiSnackbarProps &
  Pick<AlertProps, 'title' | 'severity'> & {
    content: string;
  };

const Snackbar: FunctionComponent<SnackbarProps> = ({
  severity = 'info',
  title,
  content,
  action,
  ...props
}) => {
  return (
    <MuiSnackbar
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      {...props}
    >
      <Alert
        classes={{
          icon: Styles.icon,
        }}
        className={Styles.snackbar__alert}
        severity={severity}
        action={action}
      >
        {title && (
          <AlertTitle className={Styles.alert__title}>{title}</AlertTitle>
        )}
        {content}
      </Alert>
    </MuiSnackbar>
  );
};

export default Snackbar;
