import { SettingsManager } from "../";
import { CONFIG_TYPE } from "../types";

const basic =
  SettingsManager.getAtom<(CONFIG_TYPE)["basic"]>("basic");

export function changeAutoPlay(closeAutoPlay: boolean) {
  basic.set({ ...basic.get(), closeAutoPlay });
}

export function changeVolume(volume: number) {
  basic.set({ ...basic.get(), volume });
}

export default basic;
