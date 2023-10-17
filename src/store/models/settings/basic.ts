import { DEFAULT_CONFIG, SettingsManager } from ".";

const basic = SettingsManager.getAtom<typeof DEFAULT_CONFIG["basic"]>("basic")

export function changeAutoPlay(closeAutoPlay: boolean) {
  basic.set({ ...basic.get(), closeAutoPlay });
}

export function changeVolume(volume: number) {
  basic.set({ ...basic.get(), volume });
}

export default basic