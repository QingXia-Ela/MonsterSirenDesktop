import type { Store } from '@reduxjs/toolkit';
import { Actions } from './action';
import { SirenSectionType } from './actions/section';
import { SirenPlayerType } from './actions/player';
import { SirenGlobalType } from './actions/global';
import { SirenMusicType } from './actions/music';
import { SirenMusicPlayType } from './actions/musicPlay';

const initalProps = {
  router: {
    location: {
      pathname: '\u002F',
      search: '',
      hash: '',
      query: {},
      state: 'undefined',
      key: 'ch8xbu',
    },
    action: 'POP',
  },
  logo: {
    visible: true,
    animation: true,
  },
  news: {
    visible: false,
    detail: {
      cid: '',
      title: '',
      cate: 0,
      author: '',
      content: '',
      date: '',
    },
  },
  player: {
    list: [
      {
        cid: '125079',
        name: 'Settle Into Ash (Instrumental)',
        albumCid: '6664',
        artists: ['塞壬唱片-MSR'],
      },
    ],
    autoplay: null,
    mode: 'list',
    // current: null,
    volume: 50,
    isPlaying: false,
    isMute: false,
    songDetail: {
      cid: '',
      albumCid: '',
      mvUrl: null,
      lyricUrl: null,
      sourceUrl: null,
      name: '',
      artists: [],
    },
    initial: true,
  },
  section: {
    layoutStatus: {
      layoutStatus: {},
      canRoute: false,
      pageStatus: {},
      Layout: {
        initiated: true,
        active: false,
      },
    },
    canRoute: false,
    pageStatus: {
      '\u002F': {
        initiated: true,
        active: false,
      },
    },
    firstInitial: true,
  },
  user: {
    userInfo: {
      isLogin: false,
      uid: null,
    },
  },
  index: {
    searchResultVisible: false,
    albums: {
      list: [],
      end: true,
    },
    news: {
      list: [],
      end: true,
    },
  },
  info: {
    recommends: [],
    newsList: [],
    newsEnd: false,
  },
  music: {
    keyword: '',
    albumList: [],
    currentPage: 0,
    albumDetailVisible: false,
    currentAlbum: null,
  },
  musicPlay: {
    albumDetail: {
      cid: '',
      name: '',
      intro: '',
      belong: '',
      coverUrl: '',
      coverDeUrl: null,
      songs: [],
    },
  },
  loading: {
    global: false,
    models: {
      global: false,
      player: false,
    },
    effects: {
      'global\u002FgetFontSet': false,
      'player\u002FgetPlayList': false,
    },
  },
};

export type SirenStoreState = typeof initalProps &
  SirenGlobalType &
  SirenPlayerType &
  SirenSectionType &
  SirenMusicType &
  SirenMusicPlayType;

interface SirenStoreCollect {
  getState: () => SirenStoreState;
}

// todo! add saga type
export type SirenStore = Store<SirenStoreState, Actions> & SirenStoreCollect;
