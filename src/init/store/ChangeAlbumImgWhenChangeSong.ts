/**
 * @author @QingXia-Ela
 *
 * This init is use for change album img when change song.
 *
 * 塞壬唱片音乐界面的图片由 `store.musicPlay.albumDetail.coverUrl` 决定。
 */

import SirenStore from '@/store/SirenStore';
import throttle from 'lodash/throttle';

let currentSongCoverImg: string | null = null;

const setAlbumCover = throttle((finalCoverUrl: string) => {
  // todo!: 修复播放新列表时列表图片替代歌曲图片的问题
  if (currentSongCoverImg !== finalCoverUrl) {
    currentSongCoverImg = finalCoverUrl;

    SirenStore.dispatch({
      type: 'musicPlay/setAlbumDetail',
      data: {
        ...SirenStore.getState().musicPlay.albumDetail,
        coverUrl: currentSongCoverImg,
      },
    });
  }
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
