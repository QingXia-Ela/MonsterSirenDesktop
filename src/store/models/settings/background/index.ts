import { SettingsManager } from "../";
import { CONFIG_TYPE } from "../types";
import init from "./dom";

const background =
  SettingsManager.getAtom<CONFIG_TYPE["background"]>("background");

export function changeBackgroundEnabled(enable: boolean) {
  background.set({ ...background.get(), enable });
}

export function changeBackgroundImage(url: string) {
  background.set({ ...background.get(), url });
}

export function changeBackgroundOpacity(pageName: string, opacity: number) {
  const source = background.get()

  background.set({
    ...source,
    backgroundOptions: source.backgroundOptions.map((item) => {
      if (item.pageName === pageName) {
        return { ...item, opacity };
      }
      return item;
    }),
  });
}

export function changeBackgroundBlur(pageName: string, blur: number) {
  const source = background.get()

  background.set({
    ...source,
    backgroundOptions: source.backgroundOptions.map((item) => {
      if (item.pageName === pageName) {
        return { ...item, blur };
      }
      return item;
    }),
  })
}

init(background)

export default background;
