import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './styles.scss';
import 'tdesign-react/es/style/index.css';
import $settingAdvancement from './store/models/settings/advancement';

// init
import './init';
// event listen
import './global_event';
// optimize
import './optimize';

// action
if ($settingAdvancement.get().logStore) {
  window.siren_config.log_store = true;
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

ReactDOM.createRoot(
  document.getElementById('inject-app') as HTMLElement,
).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
