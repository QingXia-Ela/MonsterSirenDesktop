import SirenStore from '@/store/SirenStore';
import { listen } from '@tauri-apps/api/event';

// todo!: ctx need to init thought user doesn't click the page
listen<number>('store:change_song', ({ payload: direction }) => {
  SirenStore.dispatch({
    type: 'player/changeSong',
    direction,
  });
});
