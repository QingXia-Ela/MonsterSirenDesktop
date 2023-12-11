import { AnyAction } from '@reduxjs/toolkit';

export interface SirenSectionType {
  section: {
    pageStatus: Record<string, { active: boolean; initiated: boolean }>;
  };
}

export interface sectionInitLayout extends AnyAction {
  type: 'section/initLayout';
  path: string;
}

/**
 * 页面首次进入时调用，且只调用一次
 */
export interface sectionInitPage extends AnyAction {
  type: 'section/initPage';
  path: string;
}

/**
 * 页面被激活时调用
 */
export interface sectionActivatePage extends AnyAction {
  type: 'section/activatePage';
  path: string;
}

/**
 * 页面动画完成时调用
 */
export interface sectionPageEntered extends AnyAction {
  type: 'section/pageEntered';
  path: string;
}

export type SectionActions =
  | sectionInitPage
  | sectionActivatePage
  | sectionPageEntered
  | sectionInitLayout;
