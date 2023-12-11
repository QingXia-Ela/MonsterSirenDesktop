import { AnyAction } from '@reduxjs/toolkit';

export interface indexHideSearchResult extends AnyAction {
  type: 'index/hideSearchResult';
}

export type IndexActions = indexHideSearchResult;
