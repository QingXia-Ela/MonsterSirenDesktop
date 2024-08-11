import { FunctionComponent, PropsWithChildren } from 'react';
import '@/assets/fonts/basic/iconfont.css';
import PlayList from './playlist';
import GlobalNotifyComponent from '@/global_event/frontend_notify/component';

interface InjectLayoutProps extends PropsWithChildren {}

const InjectLayout: FunctionComponent<InjectLayoutProps> = ({ children }) => {
  return (
    <>
      <PlayList />
      {children}
      <GlobalNotifyComponent />
    </>
  );
};

export default InjectLayout;
