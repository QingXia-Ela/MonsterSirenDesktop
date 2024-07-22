import styled from '@emotion/styled';
import Menu, { MenuProps } from '@mui/material/Menu';

/**
 * @deprecated - use V2 instead
 */
export default styled(({ ...p }: MenuProps) => <Menu {...p} />)(() => ({
  '.MuiPaper-root': {
    color: 'white',
    minWidth: '2.5rem',
    backgroundColor: '#000',
    boxShadow: '0 0 10px black',
    backgroundImage:
      'linear-gradient(90deg,rgba(99,99,99,.1),rgba(99,99,99,.1) 1px,transparent 0,transparent),linear-gradient(90deg,hsla(0,0%,100%,.1) -20%,transparent 15%),linear-gradient(0deg,hsla(0,0%,100%,.1),transparent 25%);',
  },
}));
