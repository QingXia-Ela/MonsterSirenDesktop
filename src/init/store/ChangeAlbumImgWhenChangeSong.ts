/**
 * @author @QingXia-Ela
 *
 * This init is use for change album img when change song.
 *
 * 塞壬唱片音乐界面的图片由 `store.musicPlay.albumDetail.coverUrl` 决定。
 */

import SirenStore from '@/store/SirenStore';
import throttle from 'lodash/throttle';

const setAlbumCover = throttle((finalCoverUrl: string) => {
  // 直接修改的原因是在切换歌曲时播放界面一定会发生组件更新，不需要响应式修改
  SirenStore.getState().musicPlay.albumDetail.coverUrl = finalCoverUrl;
}, 300);

SirenStore.subscribe(() => {
  const {
    musicPlay: {
      albumDetail: { coverUrl },
    },
    player: {
      songDetail: { songCoverUrl },
    },
  } = SirenStore.getState();
  const finalCoverUrl = songCoverUrl ?? coverUrl;
  setAlbumCover(finalCoverUrl);
});
