import getSirenCtx from "@/hooks/getSirenCtx";
import { FunctionComponent, useEffect, useState } from "react";
import { Portal } from "@mui/material";

interface PlayListProps {

}

let globalShowList = false

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
    showList ? (
      <Portal>
        <div>test</div>
      </Portal>
    ) : null
  );
}

export default PlayList;