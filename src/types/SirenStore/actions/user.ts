import { AnyAction } from '@reduxjs/toolkit';

export interface userGetUserInfo extends AnyAction {
  type: 'user/getUserInfo';
}

export interface userClearUserInfo extends AnyAction {
  type: 'user/clearUserInfo';
}

export type UserActions = userGetUserInfo;
