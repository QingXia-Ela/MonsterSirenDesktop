import { AnyAction } from '@reduxjs/toolkit';
import { SirenStoreState } from '..';

export interface SirenMusicType {
  music: {
    keyword: string;
    albumList: Array<{
      cid: string;
      cnNamespace: string;
      name: string;
      coverUrl: string;
      artists: string[];
    }>;
    currentPage: number;
    albumDetailVisible: boolean;
    currentAlbumDetail: null;
  };
}

export interface musicGetAlbumList extends AnyAction {
  type: 'music/getAlbumList';
}

export interface musicSetAlbumList extends AnyAction {
  type: 'music/setAlbumList';
  payload: SirenStoreState['music']['albumList'];
}

export interface musicSetCurrentPage extends AnyAction {
  type: 'music/setCurrentPage';
  payload: number;
}

export type MusicActions = musicGetAlbumList;
