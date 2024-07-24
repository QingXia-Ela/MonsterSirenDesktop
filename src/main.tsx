import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './styles.scss';
import 'tdesign-react/es/style/index.css';
// ctx menu animate
import '@szhsin/react-menu/dist/index.css';
import '@szhsin/react-menu/dist/transitions/slide.css';
import '@szhsin/react-menu/dist/theme-dark.css';

import $settingAdvancement from './store/models/settings/advancement';

// init
import './init';
// event listen
import './global_event';
// optimize
import './optimize';
import SidebarWrapper from './layout/sidebar/wrapper';
import SirenStore from './store/SirenStore';
import GlobalNotifyChannel from './global_event/frontend_notify/channel';

// action
if ($settingAdvancement.get().logStore) {
  window.siren_config.logStore = true;
}

// 禁用右键菜单
window.addEventListener('contextmenu', (e) => {
  if (process.env.NODE_ENV === 'production') {
    e.preventDefault();
  }
});

// 生产环境禁用F12
window.addEventListener('keydown', (e) => {
  if (
    process.env.NODE_ENV === 'production' &&
    e.key === 'F12' &&
    !$settingAdvancement.get().allowContextMenu
  ) {
    e.preventDefault();
  }
});

// 获取专辑列表
SirenStore.dispatch({
  type: 'music/getAlbumList',
});

// 捕获全局错误
window.addEventListener('error', (event) => {
  GlobalNotifyChannel.emit('notify', {
    severity: 'error',
    title: '全局错误',
    content: event.error.message,
  });
});

ReactDOM.createRoot(
  document.getElementById('inject-app') as HTMLElement,
).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);

ReactDOM.createRoot(
  document.getElementById('inject-sidebar') as HTMLElement,
).render(
  <React.StrictMode>
    <SidebarWrapper />
  </React.StrictMode>,
);
