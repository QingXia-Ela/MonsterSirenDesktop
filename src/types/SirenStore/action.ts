import { AnyAction } from "@reduxjs/toolkit";

export interface globalGetFontset extends AnyAction {
  type: "global/getFontSet";
}

export interface playerGetPlayList extends AnyAction {
  type: "player/getPlayList";
}

export type Actions = globalGetFontset | playerGetPlayList;
