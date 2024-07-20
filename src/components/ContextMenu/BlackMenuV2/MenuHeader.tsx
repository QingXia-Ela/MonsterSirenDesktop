import styled from '@emotion/styled';
import { MenuHeader, MenuHeaderProps } from '@szhsin/react-menu';

// todo!: finish style
export default styled(({ ...p }: MenuHeaderProps) => (
  <MenuHeader {...p} className={`text-nowrap ${p.className ?? ''}`} />
))(() => ({
  // fontFamily: 'SourceHanSansCN-Normal',
  // fontSize: '0.3rem',
  // transition: 'background-color .3s',
  // color: '#fff',
  // padding: '0.16rem 0.3rem',
  // '&:hover': {
  //   backgroundColor: '#333',
  // },
}));
