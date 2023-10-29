import getSirenCtx from "@/hooks/getSirenCtx";
import Styles from './index.module.scss';
import BackgroundStore from '../';
import { CONFIG_TYPE } from "../../types";
import SirenStore from "@/store/SirenStore";

const INJECT_BACKGROUND_ID = "inject-app__bg"
let initialized = false

const NameRouteMap = [
  ["/", "index"],
  ["/about", "about"],
  ["/music", "albums"],
  ["/info", "info"],
  ["/contact", "contact"],
  ["/music/:id", "music"],
  ["/playlist", "playlist"],
]

const default_bg_val = {
  pageName: "index",
  opacity: 45,
  blur: 0
}

let unsubscrible: ReturnType<typeof SirenStore.subscribe>
let currentActiveRoute = "/"

function getEncodedUrl(url: string) {
  return encodeURI(`http://localhost:11453/?path=${url}`)
}

function changeBackgroundStyle({ opacity, blur }: CONFIG_TYPE["background"]["backgroundOptions"][0]) {
  const bgElement = document.querySelector(`#${INJECT_BACKGROUND_ID}`) as HTMLDivElement || document.createElement("div")
  if (!bgElement) return
  bgElement.style.opacity = `${opacity / 100}`
  bgElement.style.filter = `blur(${blur}px)`
}

function changeBackgroundImage(url: string) {
  const bgElement = document.querySelector(`#${INJECT_BACKGROUND_ID}`) as HTMLDivElement || document.createElement("div")
  if (!bgElement) return
  bgElement.style.backgroundImage = `url(${url})`
}

function getOptionByName(name?: string) {
  if (!name) return
  return BackgroundStore.get().backgroundOptions.find((item) => item.pageName === name)
}

function getNameByPath(path: string) {
  const arr = path.split("/")
  return NameRouteMap.find(([p]) => {
    const cur = p.split("/")

    if (arr.length !== cur.length) return false
    for (let i = 0; i < arr.length; i++) {
      if (cur[i].startsWith(":")) continue
      if (arr[i] !== cur[i]) return false
    }
    return true
  })?.[1]
}

function onHistoryChange() {
  const option = getOptionByName(getNameByPath(window.location.pathname))
  changeBackgroundStyle(option ?? default_bg_val)
}

function initBackground(url: string) {
  const root = getSirenCtx()
  const layout = root.querySelector("#layout") as HTMLDivElement
  layout.classList.add("background__instead")

  const bgElement = document.querySelector(`#${INJECT_BACKGROUND_ID}`) as HTMLDivElement || document.createElement("div")

  bgElement.id = INJECT_BACKGROUND_ID
  bgElement.className = Styles.bg
  layout.append(bgElement)
  changeBackgroundImage(url)
  changeBackgroundStyle(default_bg_val)

  window.addEventListener("popstate", onHistoryChange)
  unsubscrible = SirenStore.subscribe(() => {
    if (window.location.pathname !== currentActiveRoute) {
      currentActiveRoute = window.location.pathname
      onHistoryChange()
    }
  })

  initialized = true
}

function destroyBackground() {
  const root = getSirenCtx()
  const layout = root.querySelector("#layout") as HTMLDivElement
  layout?.classList.remove("background__instead")
  layout.style.removeProperty("background-image")

  layout.querySelector(`#${INJECT_BACKGROUND_ID}`)?.remove()

  window.removeEventListener("popstate", onHistoryChange)

  unsubscrible?.()

  initialized = false
}

const onStateChange = ({ enable, url }: CONFIG_TYPE["background"]) => {
  if (!initialized && enable) {
    initBackground(getEncodedUrl(url))
  } else if (initialized && enable) {
    // no effect when other page change because current page value is not changed
    changeBackgroundImage(getEncodedUrl(url))
    onHistoryChange()
  } else if (!enable) {
    destroyBackground()
  }
}

export default function init(background: typeof BackgroundStore) {
  background.listen(onStateChange)
  onStateChange(background.get())
}