import { useEffect, useState } from "react";
import useSirenCtx from "@/hooks/useSirenCtx";
import Styles from './index.module.css'
import Drawer from '@mui/material/Drawer'
import { Portal } from "@mui/material";

function SideBar() {
  const [open, setOpen] = useState(false);
  const rootApp = useSirenCtx()
  // @ts-expect-error
  window._setOpen_ = setOpen
  const homeBtn = rootApp.querySelector('header')?.querySelector("a[class*='home']") as HTMLElement
  const layout = rootApp.querySelector("#layout") as HTMLDivElement

  let closeFn = () => {
    setOpen(false)
    layout.style.filter = ""
    layout.style.pointerEvents = ""
  }

  useEffect(() => {
    if (homeBtn) {
      homeBtn.onclick = (e) => {
        e.preventDefault()
      }

      homeBtn.addEventListener('click', () => {
        setOpen(true)
        layout.style.filter = "blur(10px)"
        layout.style.pointerEvents = "none"
      })
    }
  }, [])
  return (
    <>
      <Portal>
        {open && <div className={Styles.sidebar_cover} onClick={closeFn}></div>}
      </Portal>
      <div className={Styles.sidebar_main} style={{
        transform: open ? "translateX(1.2rem)" : "translateX(-100%)",
        opacity: open ? 1 : 0
      }}>
        main
      </div>
      <div className={Styles.sidebar_buttons} style={{
        transform: open ? "translateX(0)" : "translateX(-100%)",
      }}></div>
    </>
  );
}

export default SideBar;