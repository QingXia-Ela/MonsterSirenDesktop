import { FunctionComponent, PropsWithChildren, Suspense, useEffect, useState } from "react";
import { appWindow } from "@tauri-apps/api/window";
import "@/assets/fonts/basic/iconfont.css";
import Styles from "./index.module.scss";
import SideBar from "./sidebar";
import { isTauri } from "@/hooks/getPlatform";
import PlayList from "./playlist";

interface InjectLayoutProps extends PropsWithChildren {

}

const InjectLayout: FunctionComponent<InjectLayoutProps> = ({ children }) => {
  const [min, setMin] = useState(true);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (isTauri()) {
      appWindow.isMaximized().then((v) => setMin(v));
      appWindow.onResized((e) => {
        appWindow.isMaximized().then((v) => setMin(v));
      });
    }
  }, []);

  function changeWindowSize() {
    if (!isTauri()) return;
    setMin(!min);
    min ? appWindow.unmaximize() : appWindow.maximize();
  }

  return (
    <>
      <div
        data-tauri-drag-region
        className={`w-full ${Styles.titlebar_wrapper} ${open && "bg-black"
          } transition-[background-color] duration-500 flex justify-between items-center px-2`}
      >
        <div className={`text-[.3rem] font-["Geometos"]`}>
          Monster Siren Desktop App(v0.0.1)
        </div>
        <div className="flex gap-[.65rem]">
          <a
            className={`iconfont icon-24gl-gear4 ${Styles.iconfont}`}
            onClick={() => setOpen(true)}
          ></a>
          <a
            className={`iconfont icon-24gl-minimization ${Styles.iconfont}`}
            onClick={() => appWindow.minimize()}
          ></a>
          <Suspense>
            <a
              className={`iconfont icon-24gl-${min ? "minimize" : "square"} ${Styles.iconfont
                }`}
              onClick={changeWindowSize}
            ></a>
          </Suspense>
          <a
            className={`iconfont icon-24gl-cross ${Styles.iconfont}`}
            onClick={() => appWindow.close()}
          ></a>
        </div>
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
