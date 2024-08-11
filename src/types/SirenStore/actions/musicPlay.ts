import { AnyAction } from '@reduxjs/toolkit';
import { SirenStoreState } from '..';

export interface SirenMusicPlayType {
  musicPlay: {
    albumDetail: {
      cid: string;
      name: string;
      intro: string;
      belong: string;
      coverUrl: string | null;
      coverDeUrl: string | null;
      songs: SirenStoreState['player']['list'];
    };
  };
}

export interface musicPlayGetAlbumDetail extends AnyAction {
  type: 'musicPlay/getAlbumDetail';
  cid: string;
}

export interface musicPlaySetCurrent extends AnyAction {
  type: 'musicPlay/setCurrent';
  data: SirenStoreState['musicPlay']['albumDetail'];
}

export interface musicPlayToAlbum extends AnyAction {
  type: 'musicPlay/toAlbum';
  cid: string;
}

export interface musicPlaySetAlbumDetail extends AnyAction {
  type: 'musicPlay/setAlbumDetail';
  data: SirenStoreState['musicPlay']['albumDetail'];
}

export type MusicPlayActions =
  | musicPlayGetAlbumDetail
  | musicPlayToAlbum
  | musicPlaySetAlbumDetail;
