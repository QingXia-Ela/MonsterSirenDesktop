import { FunctionComponent, useEffect } from "react";
import { appWindow } from '@tauri-apps/api/window'
import Styles from './index.module.css'
import SideBar from "./sidebar";

interface InjectLayoutProps {
  children: React.ReactNode
}

const InjectLayout: FunctionComponent<InjectLayoutProps> = ({ children }) => {

  useEffect(() => {
    // document.getElementById('titlebar-minimize')?.addEventListener('click', () => appWindow.minimize())
    // document.getElementById('titlebar-maximize')?.addEventListener('click', () => appWindow.toggleMaximize())
    // document.getElementById('titlebar-close')?.addEventListener('click', () => appWindow.close())
  }, [])
  return (
    <>
      <div data-tauri-drag-region className={`w-full ${Styles.titlebar_wrapper}`}>
        <div className="titlebar">

        </div>
      </div>
      <div className={Styles.sidebar_wrapper}>
        <SideBar />
      </div>
      {children}
    </>
  );
}

export default InjectLayout;