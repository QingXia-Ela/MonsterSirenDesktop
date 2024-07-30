import styled from '@emotion/styled';
import { MenuItem, MenuItemProps } from '@szhsin/react-menu';

export default styled(({ ...p }: MenuItemProps) => (
  <MenuItem {...p} className={`text-nowrap ${p.className ?? ''}`} />
))(() => ({
  fontFamily: 'SourceHanSansCN-Normal !important',
  height: '0.56rem !important',
  fontSize: '0.34rem !important',
  transition: 'background-color .3s !important',
  color: '#fff !important',
  padding: '0.2rem 0.4rem !important',
  '&:hover': {
    backgroundColor: '#333 !important',
  },
}));
