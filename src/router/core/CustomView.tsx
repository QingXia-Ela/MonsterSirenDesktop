import { FunctionComponent, PropsWithChildren } from "react";
import { Portal } from "@mui/material";
import { INJECT_ROUTER_VIEW } from "./constants";
import routes from "..";
import { createView } from "./index"
import { useStore } from "@nanostores/react";
import $customRouter from "@/store/models/router";
import { RouterCombineProps } from "../types";

interface SirenCustomViewProps extends PropsWithChildren {
}

const pathMap: Record<string, FunctionComponent<RouterCombineProps & any>> = {}
const pathSet = new Set<string>()

routes.forEach(route => {
  pathMap[route.path] = route.component
})

const SirenCustomView: FunctionComponent<SirenCustomViewProps> = () => {
  createView()
  const { path } = useStore($customRouter)

  const finalPath = path.length ? path : window.location.pathname

  if (!pathSet.has(finalPath)) {
    pathSet.add(finalPath)
  }

  return (
    <Portal container={document.getElementById(INJECT_ROUTER_VIEW)}>
      {
        Array.from(pathSet).map(path => {
          const Component = pathMap[path]
          return Component ? <Component style={{
            opacity: finalPath === path ? 1 : 0,
            transition: "all 0.5s",
            zIndex: finalPath === path ? 1 : 0
          }} path={path} active={path === finalPath} /> : null
        })
      }
    </Portal>
  );
}

export default SirenCustomView;
