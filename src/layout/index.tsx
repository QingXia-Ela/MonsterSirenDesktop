import { FunctionComponent, useEffect } from "react";
import { appWindow } from '@tauri-apps/api/window'

interface InjectLayoutProps {
  children: React.ReactNode
}

const InjectLayout: FunctionComponent<InjectLayoutProps> = ({ children }) => {

  useEffect(() => {
    document.getElementById('titlebar-minimize')?.addEventListener('click', () => appWindow.minimize())
    document.getElementById('titlebar-maximize')?.addEventListener('click', () => appWindow.toggleMaximize())
    document.getElementById('titlebar-close')?.addEventListener('click', () => appWindow.close())
  }, [])
  return (
    <div className="w-full h-full">
      <div data-tauri-drag-region className="titlebar">
        <div className="titlebar-button" id="titlebar-minimize">
          <img
            src="https://api.iconify.design/mdi:window-minimize.svg"
            alt="minimize"
          />
        </div>
        <div className="titlebar-button" id="titlebar-maximize">
          <img
            src="https://api.iconify.design/mdi:window-maximize.svg"
            alt="maximize"
          />
        </div>
        <div className="titlebar-button" id="titlebar-close">
          <img src="https://api.iconify.design/mdi:close.svg" alt="close" />
        </div>
      </div>
      {children}
    </div>
  );
}

export default InjectLayout;