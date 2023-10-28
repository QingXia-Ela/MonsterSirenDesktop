import { atom } from "nanostores";
import SirenStore from "@/store/SirenStore";
import SirenRouter from "@/router/SirenRouter";

const $customRouter = atom({
  path: "",
  pageEntered: true,
  canRoute: true
})

const activedPathSet = new Set()

let path = ""
// listen path change
SirenStore.subscribe(() => {
  // setPageEntered($customRouter.get().pageEntered)
  // if ()
  // SirenStore.getState().section
  const currentPath = SirenRouter.location.pathname
  if (path !== currentPath) {
    path = currentPath
    $customRouter.set({ ...$customRouter.get(), path })
  }
})

export function setRouterPath(path: string) {
  SirenRouter.push(path)
  $customRouter.set({ ...$customRouter.get(), path })
  if (activedPathSet.has(path)) {
    SirenStore.dispatch({ type: "section/activatePage", path })
  }
  else {
    activedPathSet.add(path)
    SirenStore.dispatch({ type: "section/initPage", path })
  }
}

export function setPageEntered(pageEntered: boolean) {
  $customRouter.set({ ...$customRouter.get(), pageEntered })
}

export function setCanRoute(canRoute: boolean) {
  $customRouter.set({ ...$customRouter.get(), canRoute })
  SirenStore.dispatch({ type: "section/pageEntered", path: $customRouter.get().path })
}

export default $customRouter