import styled from '@emotion/styled';
import { SubMenu, SubMenuProps } from '@szhsin/react-menu';

export default styled(({ ...p }: SubMenuProps) => (
  <SubMenu {...p} className={`text-nowrap ${p.className ?? ''}`} />
))(() => ({
  // style sync with BlackMenuItem
  '.szh-menu__item': {
    fontFamily: 'SourceHanSansCN-Normal !important',
    height: '0.56rem !important',
    fontSize: '0.34rem !important',
    transition: 'background-color .3s !important',
    color: '#fff !important',
    padding: '0.2rem 0.4rem !important',
    '&:hover': {
      backgroundColor: '#333 !important',
    },
    '&::after': {
      right: '.4rem !important',
    },
  },
}));
