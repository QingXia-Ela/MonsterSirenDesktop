/**
 * @deprecated
 */
import SirenStore from "@/store/SirenStore"
import routes from ".."
import { throttle } from "lodash"
import SirenRouter from "../SirenRouter"
import getSirenCtx from "@/hooks/getSirenCtx"
import { CUSTOM_ROUTER_CONTAINER_ID } from "./constants"

// create custom router container
const CustomRouterContainer = document.createElement("div")
CustomRouterContainer.id = CUSTOM_ROUTER_CONTAINER_ID
getSirenCtx()?.querySelector("#layout")?.append(CustomRouterContainer)

const TAIL_PATH = "/contact"

const addedRoutes = routes.filter(({ addToNav }) => addToNav)
const hiddenRoutes = routes.filter(({ addToNav }) => !addToNav)

const activateSet = new Set<string>()

let custom_routing = false, current_pos = -1, can_route = true

function pushState(path: string, duration = 0) {
  if (!activateSet.has(path)) {
    SirenStore.dispatch({ type: "section/initPage", path })
    activateSet.add(path)
  }
  else {
    SirenStore.dispatch({ type: "section/activatePage", path })
  }
  SirenRouter.push(path)
  can_route = false
  setTimeout(() => {
    SirenStore.dispatch({ type: "section/pageEntered", path })
    can_route = true
  }, duration);
}

const onPageScroll = throttle((e: WheelEvent) => {
  if (!addedRoutes.length || !can_route) return
  const firstAddedPath = addedRoutes[0].path
  const state = SirenStore.getState()
  const currentPath = window.location.pathname

  const goNext = e.deltaY > 0

  if (goNext) {
    // enter first page
    if (currentPath === TAIL_PATH && state.section.canRoute) {
      custom_routing = true
      current_pos++
      const { duration, path } = addedRoutes[current_pos]
      // vanilla router will not work if path are not vanilla path
      pushState(path, duration)
    }
    else if (custom_routing) {
      if (current_pos >= 0 && current_pos < addedRoutes.length - 1) {
        current_pos++
        const { duration, path } = addedRoutes[current_pos]
        pushState(path, duration)
      }
    }
  } else {
    if (custom_routing) {
      current_pos--
      const { duration, path } = addedRoutes[current_pos]
      // back to vanilla router
      if (currentPath === firstAddedPath) {
        custom_routing = false
        SirenRouter.push(TAIL_PATH)
      }
      // keep custom routing
      else {
        pushState(path, duration)
      }
    }
  }

  // dom change
}, 20)

window.addEventListener("wheel", onPageScroll)