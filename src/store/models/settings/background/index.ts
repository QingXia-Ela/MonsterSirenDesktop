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

init(background)

export default background;
