import { throttle } from 'lodash';
import { SettingsManager } from '../';
import { CONFIG_TYPE } from '../types';
import init from './dom';

const background =
  SettingsManager.getAtom<CONFIG_TYPE['background']>('background');

export function changeBackgroundEnabled(enable: boolean) {
  background.set({ ...background.get(), enable });
}

export function changeBackgroundImage(url: string) {
  background.set({ ...background.get(), url });
}

export const throttleChangeBackgroundOpacity = throttle(
  function changeBackgroundOpacity(pageName: string, opacity: number) {
    const source = background.get();

    background.set({
      ...source,
      backgroundOptions: source.backgroundOptions.map((item) => {
        if (item.pageName === pageName) {
          return { ...item, opacity };
        }
        return item;
      }),
    });
  },
  500,
);

export const throttleChangeBackgroundBlur = throttle(
  function changeBackgroundBlur(pageName: string, blur: number) {
    const source = background.get();

    background.set({
      ...source,
      backgroundOptions: source.backgroundOptions.map((item) => {
        if (item.pageName === pageName) {
          return { ...item, blur };
        }
        return item;
      }),
    });
  },
  500,
);

init(background);

export default background;
