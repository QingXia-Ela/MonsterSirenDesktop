/**
 * @file
 *
 * 存储自定义播放列表的 store，会进行额外副作用操作
 */

import { invoke } from '@tauri-apps/api/tauri';
import { atom } from 'nanostores';

const $CustomPlaylist = atom({
  playlist: [],
});

invoke('plugin:playlist|get_all_playlists', {}).then((data) => {
  $CustomPlaylist.set({ playlist: data });
});

export default $CustomPlaylist;
