import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './styles.scss';
import 'tdesign-react/es/style/index.css';
import $settingAdvancement from './store/models/settings/advancement';

if (!window.siren_config) {
  window.siren_config = {};
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
