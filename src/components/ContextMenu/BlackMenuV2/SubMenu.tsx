import styled from '@emotion/styled';
import { SubMenu, SubMenuProps } from '@szhsin/react-menu';

export default styled(({ ...p }: SubMenuProps) => (
  <SubMenu {...p} className={`text-nowrap ${p.className ?? ''}`} />
))(() => ({
  '.szh-menu__item': {
    fontFamily: 'SourceHanSansCN-Normal',
    height: '0.5rem',
    fontSize: '0.34rem',
    transition: 'background-color .3s',
    color: '#fff',
    padding: '0.2rem 0.4rem',
    '&:hover': {
      backgroundColor: '#333',
    },
    '&::after': {
      right: '.4rem',
    },
  },
}));
