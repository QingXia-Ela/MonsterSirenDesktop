/**
 * @file
 *
 * 存储自定义播放列表的 store，会进行额外副作用操作
 */

import { invoke } from '@tauri-apps/api/tauri';
import { atom } from 'nanostores';

const $CustomPlaylist = atom<{
  playlist: Array<any>;
}>({
  playlist: [],
});

invoke('plugin:playlist|get_all_playlists', {
  forceRefresh: false,
}).then((data) => {
  $CustomPlaylist.set({ playlist: data });
});

export async function addSongToPlaylist(playlistId: string, song: any) {
  console.log(song);

  await invoke('plugin:playlist|add_song_to_playlist', {
    playlistId,
    song,
  });
}

export async function removeSongFromPlaylist(
  playlistId: string,
  songCid: string,
) {
  await invoke('plugin:playlist|remove_song_from_playlist', {
    playlistId,
    songCid,
  });
  $CustomPlaylist.set({
    playlist: $CustomPlaylist.get().playlist.map((x) => {
      if (x.id === playlistId) {
        x.songs = x.songs.filter((x: any) => x !== songCid);
      }
      return x;
    }),
  });
}

export async function createPlaylist(name: string) {
  let res = await invoke('plugin:playlist|add_playlist', { name });
  $CustomPlaylist.set({ playlist: [...$CustomPlaylist.get().playlist, res] });
  return res;
}

export async function removePlaylist(playlistId: string) {
  // todo!: 增加 invoke 值接受
  await invoke('plugin:playlist|remove_playlist', { playlistId });
  $CustomPlaylist.set({
    playlist: $CustomPlaylist.get().playlist.filter((x) => x.id !== playlistId),
  });
}

export default $CustomPlaylist;
