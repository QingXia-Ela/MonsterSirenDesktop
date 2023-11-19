import { appWindow } from "@tauri-apps/api/window";
import { FunctionComponent, Suspense, useState } from "react";
import Styles from './index.module.scss'
import { isTauri } from "@/hooks/getPlatform";
import CloseModeChoose from "./components/CloseModeChoose";

interface AppOperationProps {
  open: boolean;
  setOpen: (open: boolean) => void
}


const AppOperation: FunctionComponent<AppOperationProps> = ({
  open,
  setOpen
}) => {
  const [min, setMin] = useState(true);
  const [showModeDialog, setShowModeDialog] = useState(false);

  function changeWindowSize() {
    if (!isTauri()) return;
    setMin(!min);
    min ? appWindow.unmaximize() : appWindow.maximize();
  }

  function handleClose() {
    setShowModeDialog(true)
  }

  return (
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
        onClick={handleClose}
      ></a>
      <CloseModeChoose open={showModeDialog} setOpen={setShowModeDialog} />
    </div>
  );
}

export default AppOperation;