import { useEffect, useState } from "react";
import useSirenCtx from "@/hooks/useSirenCtx";
import Styles from "./index.module.css";
import { useStore } from "@nanostores/react";
import $settingBasic, { changeAutoPlay } from "@/store/models/settings/basic";
import { Portal } from "@mui/material";
import SirenStore from "@/store/SirenStore";
import SidebarLeftOptionList from "./components/LeftOptionList";

// SirenStore["default"].
// SirenStore.dispatch({type: ""})
// SirenStore["default"].
function SideBar() {
  SirenStore;
  const [open, setOpen] = useState(false);
  const rootApp = useSirenCtx();
  const homeBtn = rootApp
    .querySelector("header")
    ?.querySelector("a[class*='home']") as HTMLElement;
  const layout = rootApp.querySelector("#layout") as HTMLDivElement;
  const { closeAutoPlay } = useStore($settingBasic);

  const closeFn = () => {
    setOpen(false);
    layout.style.filter = "";
    layout.style.pointerEvents = "";
  };

  useEffect(() => {
    if (homeBtn) {
      homeBtn.onclick = (e) => {
        e.preventDefault();
      };

      homeBtn.addEventListener("click", () => {
        setOpen(true);
        layout.style.filter = "blur(10px)";
        layout.style.pointerEvents = "none";
      });
    }
  }, []);
  return (
    <>
      <Portal>
        {open && <div className={Styles.sidebar_cover} onClick={closeFn}></div>}
      </Portal>
      <div
        className={`${Styles.sidebar_main} p-1`}
        style={{
          transform: open ? "translateX(1.7rem)" : "translateX(-100%)",
          opacity: open ? 1 : 0,
        }}
      >
        test
      </div>
      <div
        className={Styles.sidebar_buttons}
        style={{
          transform: open ? "translateX(0)" : "translateX(-100%)",
        }}
      >
        <SidebarLeftOptionList />
      </div>
    </>
  );
}

export default SideBar;
