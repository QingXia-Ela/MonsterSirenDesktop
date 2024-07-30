import styled from '@emotion/styled';
import { ControlledMenu, ControlledMenuProps } from '@szhsin/react-menu';

export default styled(({ ...p }: ControlledMenuProps) => (
  <ControlledMenu {...p} />
))(() => ({
  '.szh-menu': {
    color: 'white !important',
    minWidth: '4rem !important',
    backgroundColor: '#000 !important',
    boxShadow: '0 0 10px black !important',
    padding: '0.2rem 0 !important',
    borderRadius: '0.2rem !important',
    backgroundImage:
      'linear-gradient(90deg,rgba(99,99,99,.1),rgba(99,99,99,.1) 1px,transparent 0,transparent),linear-gradient(90deg,hsla(0,0%,100%,.1) -20%,transparent 15%),linear-gradient(0deg,hsla(0,0%,100%,.1),transparent 25%) !important;',
  },
}));
