import styled from '@emotion/styled';
import { MenuItem, MenuItemProps } from '@szhsin/react-menu';

export default styled(({ ...p }: MenuItemProps) => (
  <MenuItem {...p} className={`text-nowrap ${p.className ?? ''}`} />
))(() => ({
  fontFamily: 'SourceHanSansCN-Normal',
  height: '0.56rem',
  fontSize: '0.34rem',
  transition: 'background-color .3s',
  color: '#fff',
  padding: '0.2rem 0.4rem',
  '&:hover': {
    backgroundColor: '#333',
  },
}));
