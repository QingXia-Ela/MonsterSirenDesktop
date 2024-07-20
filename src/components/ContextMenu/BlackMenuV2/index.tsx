import styled from '@emotion/styled';
import { ControlledMenu, ControlledMenuProps } from '@szhsin/react-menu';

export default styled(({ ...p }: ControlledMenuProps) => <ControlledMenu {...p} />)(() => ({
  '.szh-menu': {
    color: 'white',
    minWidth: '4rem',
    backgroundColor: '#000',
    boxShadow: '0 0 10px black',
    padding: '0.2rem 0',
    borderRadius: '0.2rem',
    backgroundImage:
      'linear-gradient(90deg,rgba(99,99,99,.1),rgba(99,99,99,.1) 1px,transparent 0,transparent),linear-gradient(90deg,hsla(0,0%,100%,.1) -20%,transparent 15%),linear-gradient(0deg,hsla(0,0%,100%,.1),transparent 25%);',
  },
}));
