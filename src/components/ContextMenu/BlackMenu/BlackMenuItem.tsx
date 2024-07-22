import styled from '@emotion/styled';
import MenuItem, { MenuItemProps } from '@mui/material/MenuItem';

/**
 * @deprecated - use V2 instead
 */
export default styled(({ ...p }: MenuItemProps) => (
  <MenuItem {...p} className={`text-nowrap ${p.className ?? ''}`} />
))(() => ({
  fontFamily: 'SourceHanSansCN-Normal',
  fontSize: '0.3rem',
  transition: 'background-color .3s',
  color: '#fff',
  padding: '0.16rem 0.3rem',
  '&:hover': {
    backgroundColor: '#333',
  },
}));
