import { atom } from "nanostores";

const basic = atom({
  closeAutoPlay: false,
  volume: 20,
});

export function changeAutoPlay(closeAutoPlay: boolean) {
  basic.set({ ...basic.get(), closeAutoPlay });
}

export function changeVolume(volume: number) {
  basic.set({ ...basic.get(), volume });
}

export default basic;
