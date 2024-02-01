// note: this component will render isolated as a new app on page
import { useState } from "react";
import AppOperation from '../components/AppOperation';
import SideBar from './';
import Styles from './index.module.scss'

function SidebarWrapper() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <div
        data-tauri-drag-region
        className={`w-full ${Styles.titlebar_wrapper} ${open && 'bg-black'
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
    </>
  );
}

export default SidebarWrapper;