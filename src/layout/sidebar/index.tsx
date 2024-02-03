import { useEffect, useState } from 'react';
import getSirenCtx from '@/hooks/getSirenCtx';
import Styles from './index.module.css';
import { Portal } from '@mui/material';
import SidebarLeftOptionList from './components/LeftOptionList';
import { OptionList } from './constants/config';
import RightOptionDetail from './components/RightOptionDetail';
import { saveSettings } from '@/store/models/settings';

// SirenStore["default"].
// SirenStore.dispatch({type: ""})
// SirenStore["default"].
interface SideBarProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}
function SideBar({ open, setOpen }: SideBarProps) {
  const [selectedValue, setSelectedValue] = useState(OptionList[0].value);
  const rootApp = getSirenCtx();
  const layout = rootApp.querySelector('#layout') as HTMLDivElement;

  const closeFn = () => {
    setOpen(false);
    layout.style.filter = '';
    layout.style.pointerEvents = '';
    saveSettings().then(() => {});
  };

  if (open) {
    layout.style.filter = 'blur(10px)';
    layout.style.pointerEvents = 'none';
  }

  return (
    <>
      <Portal>
        {open && <div className={Styles.sidebar_cover} onClick={closeFn}></div>}
      </Portal>
      <div
        className={`${Styles.sidebar_main} px-2 py-1`}
        style={{
          transform: open ? 'translateX(1.7rem)' : 'translateX(-100%)',
          opacity: open ? 1 : 0,
        }}
      >
        <RightOptionDetail value={selectedValue} optionList={OptionList} />
      </div>
      <div
        className={Styles.sidebar_buttons}
        style={{
          transform: open ? 'translateX(0)' : 'translateX(-100%)',
        }}
      >
        <SidebarLeftOptionList
          value={selectedValue}
          onValueChange={setSelectedValue}
          optionList={OptionList}
        />
      </div>
    </>
  );
}

export default SideBar;
