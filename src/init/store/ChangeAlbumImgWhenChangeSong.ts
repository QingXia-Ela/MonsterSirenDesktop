/**
 * @author @QingXia-Ela
 *
 * This init is use for change album img when change song.
 *
 * 塞壬唱片音乐界面的图片由 `store.musicPlay.albumDetail.coverUrl` 决定。
 */

import SirenStore from '@/store/SirenStore';

let currentSongCoverImg: string | null = null;

SirenStore.subscribe(() => {
  const {
    musicPlay: {
      albumDetail: { coverUrl },
    },
    player: {
      songDetail: { songCoverUrl },
    },
  } = SirenStore.getState();
  // todo!: 修复直接播放列表内某一首歌曲时首先展示专辑 url 的问题。因为是先获取 song url，然后再次获取 album 图像，因此导致了覆盖。可以用一个优先级处理一下
  if (currentSongCoverImg !== songCoverUrl) {
    currentSongCoverImg = songCoverUrl;

    SirenStore.dispatch({
      type: 'musicPlay/setAlbumDetail',
      data: {
        ...SirenStore.getState().musicPlay.albumDetail,
        coverUrl: currentSongCoverImg || coverUrl,
      },
    });
  }
});
