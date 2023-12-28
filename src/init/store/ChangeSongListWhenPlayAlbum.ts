/**
 * @author @QingXia-Ela
 * 
 * This init is use for change song list when play a album.
 * 
 * 原版塞壬唱片会展示所有的歌曲，该脚本用于控制歌曲列表。
 */
import SirenStore from "@/store/SirenStore";

let currentAlbumId: string

SirenStore.subscribe(() => {
  const state = SirenStore.getState();

  if (currentAlbumId !== state.musicPlay.albumDetail.cid) {
    currentAlbumId = state.musicPlay.albumDetail.cid
    SirenStore.dispatch({
      type: "player/setPlayList",
      data: {
        autoplay: null,
        list: state.musicPlay.albumDetail.songs
      }
    })
  }
})