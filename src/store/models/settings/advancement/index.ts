import { SettingsManager } from "../";
import { CONFIG_TYPE } from "../types";

const advancement =
  SettingsManager.getAtom<(CONFIG_TYPE)["advancement"]>("advancement");

export function changeLogStore(logStore: boolean) {
  window.siren_config.logStore = logStore;
  advancement.set({ ...advancement.get(), logStore });
}

export default advancement;
