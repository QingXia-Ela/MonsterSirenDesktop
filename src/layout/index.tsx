import {
  FunctionComponent,
  PropsWithChildren,
  Suspense,
  useEffect,
  useState,
} from 'react';
import '@/assets/fonts/basic/iconfont.css';
import Styles from './index.module.scss';
import SideBar from './sidebar';
import PlayList from './playlist';
import AppOperation from './components/AppOperation';

interface InjectLayoutProps extends PropsWithChildren {}

const InjectLayout: FunctionComponent<InjectLayoutProps> = ({ children }) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div
        data-tauri-drag-region
        className={`w-full ${Styles.titlebar_wrapper} ${
          open && 'bg-black'
        } transition-[background-color] duration-500 flex justify-between items-center px-2`}
      >
        <div className={`text-[.3rem] font-["Geometos"]`}>
          Monster Siren Desktop App(v0.0.1)
        </div>
        <AppOperation open={open} setOpen={setOpen} />
      </div>
      <div className={Styles.sidebar_wrapper}>
        <SideBar open={open} setOpen={setOpen} />
      </div>
      <PlayList />
      {children}
    </>
  );
};

export default InjectLayout;
