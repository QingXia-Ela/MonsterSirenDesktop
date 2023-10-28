import { useEffect } from "react";
import routes from "..";
import getSirenCtx from "@/hooks/getSirenCtx";
import { RouteItem } from "../types";
import Styles from "./index.module.scss"
import $customRouter, { setCanRoute, setRouterPath } from "@/store/models/router";

const addToNavRoutes = routes.filter(route => route.addToNav)

let navClassName: string

function createButton({ path, name = "", duration }: Omit<RouteItem, "component">) {
  const button = document.createElement("a");
  button.className = navClassName
  button.innerHTML = name

  const toggleActive = (active = false) => {
    active ? button.classList.add(Styles.navActive) : button.classList.remove(Styles.navActive)
  }

  $customRouter.listen(() => {
    path === $customRouter.get().path ? toggleActive(true) : toggleActive(false)
  })

  button.addEventListener("click", () => {
    const { canRoute } = $customRouter.get()
    if (canRoute) {
      setRouterPath(path)
      setCanRoute(false)

      setTimeout(() => {
        setCanRoute(true)
      }, duration)
    }
  })

  return button
}

const addedSet = new Set()
const buttons: string[] = []
export function createNav() {
  useEffect(() => {
    const root = getSirenCtx();
    const nav = root.querySelector("header")
      ?.querySelector("nav") as HTMLDivElement;

    nav.querySelector("div[class*='userGroup']")
      ?.remove()

    navClassName = nav.querySelector("a")?.className ?? Styles.navItem

    addToNavRoutes.forEach(({ path, name, duration = 500 }) => {
      if (!addedSet.has(path)) {
        addedSet.add(path)
        const button = createButton({ path, name, duration })
        if (!buttons.includes(path)) {
          nav.appendChild(button)
          buttons.push(path)
        }
      }
    })
  }, [])
}
