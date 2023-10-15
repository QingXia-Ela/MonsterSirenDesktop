import { FunctionComponent, Suspense, useEffect, useState } from "react";
import { appWindow } from "@tauri-apps/api/window";
import "@/assets/fonts/basic/iconfont.css";
import Styles from "./index.module.scss";
import SideBar from "./sidebar";
import { isTauri } from "@/hooks/getPlatform";

interface InjectLayoutProps {
  children: React.ReactNode;
}

const InjectLayout: FunctionComponent<InjectLayoutProps> = ({ children }) => {
  const [min, setMin] = useState(true);

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
        className={`w-full ${Styles.titlebar_wrapper} flex justify-between items-center px-2`}
      >
        <div className={`text-[.24rem] font-["Geometos"]`}>
          Monster Siren Desktop App(v0.0.1)
        </div>
        <div className="flex gap-[.65rem]">
          <i
            className={`iconfont icon-24gl-minimization ${Styles.iconfont}`}
            onClick={() => appWindow.minimize()}
          ></i>
          <Suspense>
            <i
              className={`iconfont icon-24gl-${min ? "minimize" : "square"} ${
                Styles.iconfont
              }`}
              onClick={changeWindowSize}
            ></i>
          </Suspense>
          <i
            className={`iconfont icon-24gl-cross ${Styles.iconfont}`}
            onClick={() => appWindow.close()}
          ></i>
        </div>
      </div>
      <div className={Styles.sidebar_wrapper}>
        <SideBar />
      </div>
      {children}
    </>
  );
};

export default InjectLayout;
