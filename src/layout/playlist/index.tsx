import getSirenCtx from '@/hooks/getSirenCtx';
import { FunctionComponent, useEffect, useState } from 'react';
import { Portal } from '@mui/material';
import Styles from './index.module.scss';
import PlayListHeader from './components/header';

interface PlayListProps {}

const injectElement = document.querySelector('#inject-app') as HTMLDivElement;

const PlayList: FunctionComponent<PlayListProps> = () => {
  return (
    <Portal container={injectElement}>
      {/* <div className="fixed top-0 right-0 h-full">
        <div
          className={Styles.playlist}
          // don't know why tailwind doesn't work
          style={{
            transform: `translateY(-50%) translateX(${showList ? "-10%" : "130%"})`,
          }}
        >
          <PlayListHeader />
        </div>
      </div> */}
    </Portal>
  );
};

export default PlayList;
