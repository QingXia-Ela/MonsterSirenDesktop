import { AnyAction } from '@reduxjs/toolkit';
import { SirenStoreState } from '..';

export interface SirenPlayerType {
  player: {
    list: Array<{
      cid: string;
      name: string;
      albumCid: string;
      artists: string[];
      duration: number | null;
      customData: Record<string, string> | null;
    }>;
    mode: 'list' | 'album' | 'loop' | 'random';
    current: string | null;
    songDetail: {
      cid: string;
      albumCid: string;
      mvUrl: string | null;
      lyricUrl: string | null;
      sourceUrl: string | null;
      name: string;
      artists: string[];
      songCoverUrl: string | null;
    };
  };
}

export interface playerGetPlayList extends AnyAction {
  type: 'player/getPlayList';
}

export interface playerSetVolume extends AnyAction {
  type: 'player/setVolume';
  volume: number;
}

export interface playerSelectSong extends AnyAction {
  type: 'player/selectSong';
  cid: string;
}

export interface playerSetMode extends AnyAction {
  type: 'player/setMode';
  mode: 'list' | 'album' | 'loop' | 'random';
}

export interface playerSetSongDetail extends AnyAction {
  type: 'player/setSongDetail';
  song: SirenStoreState['player']['songDetail'];
}

export interface playerSetCurrent extends AnyAction {
  type: 'player/setCurrent';
  cid: string;
}

export interface playerSetIsPlaying extends AnyAction {
  type: 'player/setIsPlaying';
  isPlaying: boolean;
}

export interface playerChangeSong extends AnyAction {
  type: 'player/changeSong';
  /**
   * -1: 上一首
   *
   * 1: 下一首
   */
  direction: number;
}

export interface playerSetPlayList extends AnyAction {
  type: 'player/setPlayList';
  data: {
    autoplay: boolean | null;
    list: Array<{
      cid: string;
      name: string;
      albumCid: string;
      artists: string[];
    }>;
  };
}

export type PlayerActions =
  | playerGetPlayList
  | playerSetVolume
  | playerSelectSong
  | playerSetMode
  | playerSetSongDetail
  | playerSetCurrent
  | playerSetIsPlaying
  | playerSetPlayList
  | playerChangeSong;
