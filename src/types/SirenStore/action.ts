import { AnyAction } from '@reduxjs/toolkit';
import { SectionActions } from './actions/section';
import { LogoActions } from './actions/logo';
import { PlayerActions } from './actions/player';
import { IndexActions } from './actions';
import { UserActions } from './actions/user';

export interface globalGetFontset extends AnyAction {
  type: 'global/getFontSet';
}

export type Actions =
  | globalGetFontset
  | PlayerActions
  | SectionActions
  | LogoActions
  | IndexActions
  | UserActions;
