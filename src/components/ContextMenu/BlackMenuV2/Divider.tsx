import { Divider as MuiDivider } from '@mui/material';
import { FunctionComponent } from 'react';

const Divider: FunctionComponent<{ children?: string }> = ({
  children = '',
}) => (
  <MuiDivider
    sx={{
      borderColor: 'rgba(255, 255, 255, 0.2)',
      width: '100%',
      margin: '0.2rem auto',
      fontSize: '0.24rem',
      '&::before, &::after': {
        borderColor: 'rgba(255, 255, 255, 0.2)',
      },
    }}
  >
    {children}
  </MuiDivider>
);

export default Divider;
