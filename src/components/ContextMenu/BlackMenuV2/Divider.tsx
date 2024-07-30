import { Divider as MuiDivider } from '@mui/material';
import { FunctionComponent } from 'react';

const Divider: FunctionComponent<{ children?: string }> = ({
  children = '',
}) => (
  <MuiDivider
    sx={{
      borderColor: 'rgba(255, 255, 255, 0.2) !importnat',
      width: '100% !importnat',
      margin: '0.2rem auto !importnat',
      fontSize: '0.24rem !importnat',
      '&::before, &::after': {
        borderColor: 'rgba(255, 255, 255, 0.2) !importnat',
      },
    }}
  >
    {children}
  </MuiDivider>
);

export default Divider;
