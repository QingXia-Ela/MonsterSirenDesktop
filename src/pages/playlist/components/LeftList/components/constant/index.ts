export type BottomListItemType = 'icon' | 'img';

export interface BottomListIconBasicType {
  id: string;
  title: string;
  subTitle: string;
  selected?: boolean;
}

export interface BottomListIconItemType extends BottomListIconBasicType {
  type: 'icon';
  iconClass: string;
}

export interface BottomListImgItemType extends BottomListIconBasicType {
  type: 'img';
  src: string;
}

export type SingleBottomListItemType =
  | BottomListIconItemType
  | BottomListImgItemType
  | BottomListIconBasicType;

export type BottomListType = Array<SingleBottomListItemType>;

export type TopSelectItemKey = 'siren' | 'local' | 'myself';

export const defaultSort: Array<{
  key: TopSelectItemKey;
  value: string;
  active: boolean;
}> = [
  {
    key: 'siren',
    value: '塞壬唱片',
    active: false,
  },
  {
    key: 'local',
    value: '本地音乐',
    active: false,
  },
  {
    key: 'myself',
    value: '我的歌单',
    active: false,
  },
];
