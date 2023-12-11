import { AnyAction } from '@reduxjs/toolkit';
import { SirenStoreState } from '..';

export interface SirenPlayerType {
  player: {
    list: Array<{
      cid: string;
      name: string;
      albumCid: string;
      artists: string[];
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

export type PlayerActions =
  | playerGetPlayList
  | playerSetVolume
  | playerSelectSong;
