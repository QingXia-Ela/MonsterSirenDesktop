import { useEffect, useState } from "react";
import useSirenCtx from "@/hooks/useSirenCtx";
import Styles from './index.module.css'
import Drawer from '@mui/material/Drawer'

function SideBar() {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const rootApp = useSirenCtx()
    // @ts-expect-error
    window._setOpen_ = setOpen
    // console.log(rootApp);
    const homeBtn = rootApp.querySelector('header')?.querySelector("a[class*='home']") as HTMLElement
    if (homeBtn) {
      homeBtn.onclick = (e) => {
        e.preventDefault()
      }
      homeBtn.addEventListener('click', (e) => {
        setOpen(!open)
        if (open) {
          rootApp.style.filter = ""
          rootApp.style.pointerEvents = ""
        } else {
          // rootApp.style.filter = "blur(10px)"
          // rootApp.style.pointerEvents = "none"
        }
      })
    }
  }, [])
  return (
    <>
      {/* <Drawer anchor="left" open={open} onClose={() => setOpen(false)} style={{
        zIndex: 100
      }} /> */}

      <div className={Styles.sidebar_main} style={{
        transform: open ? "translateX(0)" : "translateX(-100%)",
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