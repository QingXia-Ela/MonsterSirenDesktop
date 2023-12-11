import { AnyAction } from '@reduxjs/toolkit';
import { SirenStoreState } from '..';

export interface SirenMusicType {
  music: {
    keyword: string,
    albumList: Array<{
      cid: string;
      name: string;
      coverUrl: string;
      artists: string[];
    }>,
    currentPage: number,
    albumDetailVisible: boolean,
    currentAlbumDetail: null,
  }
}

export interface musicGetAlbumList extends AnyAction {
  type: 'music/getAlbumList';
}

export type MusicActions = musicGetAlbumList