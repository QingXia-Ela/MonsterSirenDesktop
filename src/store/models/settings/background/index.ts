import { DEFAULT_CONFIG, SettingsManager } from "../";
import init from "./dom";

const background =
  SettingsManager.getAtom<(typeof DEFAULT_CONFIG)["background"]>("background");

export function changeBackgroundEnabled(enable: boolean) {
  background.set({ ...background.get(), enable });
}

export function changeBackgroundImage(url: string) {
  background.set({ ...background.get(), url });
}

export function changeMaskOpacity(maskOpacity: number) {
  background.set({ ...background.get(), maskOpacity });
}

init(background)

export default background;
