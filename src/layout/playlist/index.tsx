import getSirenCtx from "@/hooks/getSirenCtx";
import { FunctionComponent, useEffect, useState } from "react";
import { Portal } from "@mui/material";
import Styles from './index.module.scss'
import PlayListHeader from "./components/header";

interface PlayListProps {

}

let globalShowList = false

const injectElement = document.querySelector("#inject-app") as HTMLDivElement

const PlayList: FunctionComponent<PlayListProps> = () => {

  const [showList, setShowList] = useState(false);

  useEffect(() => {
    const root = getSirenCtx();
    const nav = root.querySelector("header")
      ?.querySelector("nav") as HTMLDivElement;

    nav.querySelector("div[class*='userGroup']")
      ?.remove()

    const showListButton = document.createElement("div");
    showListButton.className = nav.querySelector("a")?.className ?? ""
    showListButton.innerHTML = "播放列表"
    showListButton.style.cssText = `cursor: pointer;`

    nav.appendChild(showListButton)

    showListButton.addEventListener("click", () => {
      globalShowList = !globalShowList
      setShowList(globalShowList)
    })

    return () => {
      nav.removeChild(showListButton);
    }
  }, [])

  return (
    <Portal container={injectElement}>
      <div className="fixed top-0 right-0 h-full">
        <div
          className={Styles.playlist}
          // don't know why tailwind doesn't work
          style={{
            transform: `translateY(-50%) translateX(${showList ? "-10%" : "130%"})`,
          }}
        >
          <PlayListHeader />
        </div>
      </div>
    </Portal>
  );
}

export default PlayList;