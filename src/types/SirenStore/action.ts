import { AnyAction } from "@reduxjs/toolkit";

export interface globalGetFontset extends AnyAction {
  type: "global/getFontSet";
}

export interface playerGetPlayList extends AnyAction {
  type: "player/getPlayList";
}

export interface playerSetVolume extends AnyAction {
  type: "player/setVolume", volume: number
}

export interface playerSelectSong extends AnyAction {
  type: "player/selectSong", cid: string
}

export type Actions =
  globalGetFontset |
  playerGetPlayList |
  playerSetVolume |
  playerSelectSong;
