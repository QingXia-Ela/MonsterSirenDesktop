/**
 * @file
 *
 * 虚拟播放列表
 *
 * 用于存储页面临时播放列表，仅提供给自定义页面使用
 */

import { atom } from 'nanostores';

/**
 * @deprecated
 */
// todo!: 实现这玩意
const $DummyPlaylist = atom<{
  metadata: {
    cid: string;
    cnNamespace: '虚拟播放列表';
    name: 'Dummy Playlist';
    coverUrl: string;
    artists: string[];
  };
}>({
  metadata: {
    cid: 'dummyPlaylist',
    cnNamespace: '虚拟播放列表',
    name: 'Dummy Playlist',
    coverUrl: '',
    artists: [],
  },
});

export default $DummyPlaylist;
