import { appWindow } from '@tauri-apps/api/window';
import { FunctionComponent, Suspense, useState } from 'react';
import Styles from './index.module.scss';
import { isTauri } from '@/hooks/getPlatform';
import CloseModeChoose from './components/CloseModeChoose';
import $settingBasic from '@/store/models/settings/basic';
import navigate from '@/router/utils/navigate';
import SirenStore from '@/store/SirenStore';

interface AppOperationProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const AppOperation: FunctionComponent<AppOperationProps> = ({ setOpen }) => {
  const [min, setMin] = useState(false);
  const [showModeDialog, setShowModeDialog] = useState(false);

  function changeWindowSize() {
    if (!isTauri()) return;
    setMin(!min);
    min ? appWindow.unmaximize() : appWindow.maximize();
  }

  function handleClose() {
    const { closeMode } = $settingBasic.get();
    switch (closeMode) {
      case 'close':
        appWindow.close();
        break;
      case 'minimize':
        appWindow.minimize();
        break;
      default:
        setShowModeDialog(true);
        break;
    }
  }

  function gotoCurrentMusicPage() {
    const cur = SirenStore.getState().player.current;
    if (cur) {
      SirenStore.dispatch({
        type: 'player/selectSong',
        cid: cur,
      });
      navigate(`/music/${cur}`);
    }
  }

  return (
    <div className='flex gap-[.65rem]'>
      <a
        className={`iconfont icon-24gl-play ${Styles.iconfont}`}
        onClick={gotoCurrentMusicPage}
        title='播放详情'
      ></a>
      {/* settings */}
      <a
        className={`iconfont icon-24gl-gear4 ${Styles.iconfont}`}
        onClick={() => setOpen(true)}
      ></a>
      {/* minimize */}
      <a
        className={`iconfont icon-24gl-minimization ${Styles.iconfont}`}
        onClick={() => appWindow.minimize()}
      ></a>
      {/* window maximize */}
      <Suspense>
        <a
          className={`iconfont icon-24gl-${min ? 'minimize' : 'square'} ${
            Styles.iconfont
          }`}
          onClick={changeWindowSize}
        ></a>
      </Suspense>
      {/* window close */}
      <a
        className={`iconfont icon-24gl-cross ${Styles.iconfont}`}
        onClick={handleClose}
      ></a>
      <CloseModeChoose open={showModeDialog} setOpen={setShowModeDialog} />
    </div>
  );
};

export default AppOperation;
