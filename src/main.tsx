import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './styles.scss';
import 'tdesign-react/es/style/index.css';

ReactDOM.createRoot(
  document.getElementById('inject-app') as HTMLElement,
).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
