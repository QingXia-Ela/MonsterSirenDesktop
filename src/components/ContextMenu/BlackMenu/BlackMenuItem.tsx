import styled from '@emotion/styled';
import MenuItem, {
  MenuItemProps,
  MenuItemClasses,
} from '@mui/material/MenuItem';

export default styled(({ ...p }: MenuItemProps) => (
  <MenuItem {...p} className={`text-nowrap ${p.className ?? ''}`} />
))(() => ({
  fontFamily: 'SourceHanSansCN-Normal',
  fontSize: '0.26rem',
  transition: 'background-color .3s',
  color: '#fff',
  '&:hover': {
    backgroundColor: '#333',
  },
}));
