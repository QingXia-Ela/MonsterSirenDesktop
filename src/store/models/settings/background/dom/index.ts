import useSirenCtx from "@/hooks/useSirenCtx";
import Styles from './index.module.scss'
import type BackgroundStore from '../'

const INJECT_BACKGROUND_ID = "inject-app__bg"
// let DomContentLoaded = false

function getEncodedUrl(url: string) {
  return encodeURI(`http://localhost:11453/?path=${url}`)
}

function initBackground(url: string, maskOpacity = 0.45) {
  const root = useSirenCtx()
  const layout = root.querySelector("#layout") as HTMLDivElement
  layout.classList.add("background__instead")

  const bgElement = document.querySelector(`#${INJECT_BACKGROUND_ID}`) as HTMLDivElement || document.createElement("div")

  bgElement.addEventListener("error", () => {

  })

  bgElement.id = INJECT_BACKGROUND_ID
  bgElement.className = Styles.bg
  bgElement.style.backgroundImage = `url(${url})`
  bgElement.style.opacity = `${maskOpacity}`
  layout.append(bgElement)
}

function destroyBackground() {
  const root = useSirenCtx()
  const layout = root.querySelector("#layout") as HTMLDivElement
  layout?.classList.remove("background__instead")
  layout.style.removeProperty("background-image")

  layout.querySelector(`#${INJECT_BACKGROUND_ID}`)?.remove()
}

const onStateChange = ({ enable, maskOpacity, url }) => {
  if (enable) {
    initBackground(getEncodedUrl(url), maskOpacity)
  } else {
    destroyBackground()
  }
}

export default function init(background: typeof BackgroundStore) {
  background.listen(onStateChange)
  onStateChange(background.get())
  requestAnimationFrame(() => {
  })
}