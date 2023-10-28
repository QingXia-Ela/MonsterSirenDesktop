import { AnyAction } from "@reduxjs/toolkit";
import { sectionActivatePage, sectionInitPage, sectionPageEntered } from "./actions/section";
import { logoShowLogo, logoHideLogo } from "./actions/logo";

export interface globalGetFontset extends AnyAction {
  type: "global/getFontSet";
}

export interface playerGetPlayList extends AnyAction {
  type: "player/getPlayList";
}

export interface playerSetVolume extends AnyAction {
  type: "player/setVolume";
  volume: number;
}

export interface playerSelectSong extends AnyAction {
  type: "player/selectSong";
  cid: string;
}


export type Actions =
  | globalGetFontset
  | playerGetPlayList
  | playerSetVolume
  | playerSelectSong
  | sectionActivatePage
  | sectionInitPage
  | sectionPageEntered
  | logoShowLogo
  | logoHideLogo


