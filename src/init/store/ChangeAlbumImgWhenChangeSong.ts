/**
 * @author @QingXia-Ela
 *
 * This init is use for change album img when change song.
 * 
 * 塞壬唱片音乐界面的图片由 `store.musicPlay.albumDetail.coverUrl` 决定。
 */

import SirenStore from "@/store/SirenStore";

let currentSongCoverImg: string;

SirenStore.subscribe(() => {
  const { musicPlay: { albumDetail: { coverUrl } }, player: { songDetail: { songCoverUrl } } } = SirenStore.getState();
  if (currentSongCoverImg !== songCoverUrl) {
    currentSongCoverImg = songCoverUrl ?? coverUrl;
    SirenStore.dispatch({
      type: "musicPlay/setAlbumDetail",
      data: {
        ...SirenStore.getState().musicPlay.albumDetail,
        coverUrl: currentSongCoverImg
      }
    });
  }
})