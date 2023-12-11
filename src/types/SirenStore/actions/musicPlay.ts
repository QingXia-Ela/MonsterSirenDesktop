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
      songs: Array<Omit<SirenStoreState['player']['list'][0], 'albumCid'>>;
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

export type MusicPlayActions = musicPlayGetAlbumDetail;
