/**
 * 缩略播放列表，目前暂时没启用
 * 
 * 因为在工具栏顶部有直接跳转播放页面的快捷方式，所以暂时不用这个
 */
import { FunctionComponent } from 'react';
import { Portal } from '@mui/material';

interface PlayListProps { }

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
