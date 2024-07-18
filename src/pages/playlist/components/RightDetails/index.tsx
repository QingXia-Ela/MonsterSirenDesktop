import React, { FunctionComponent } from 'react';
import RightDetailsTopInfo from './components/TopInfo';
import RightDetailsMiddleSplit from './components/MiddleSplit';
import RightDetailsBottomList from './components/BottomList';
import { useStore } from '@nanostores/react';
import $PlayListState from '@/store/pages/playlist';
import { usePopupState } from 'material-ui-popup-state/hooks';
import BlackMenuItem from '@/components/ContextMenu/BlackMenu/BlackMenuItem';
import Divider from '@mui/material/Divider';
import SirenStore from '@/store/SirenStore';
import navigate from '@/router/utils/navigate';

interface RightDetailsProps {}

// function find

const MyDivider: FunctionComponent<{ children?: string }> = ({
  children = '',
}) => (
  <Divider
    sx={{
      borderColor: '#ffffff88',
      width: '80%',
      margin: '0.1250rem auto',
      fontSize: '0.1875rem',
      '&::before, &::after': {
        borderColor: '#ffffff88',
      },
    }}
  >
    {children}
  </Divider>
);

/**
 * Note: this component will refresh when ctx open.
 *
 * Just use params and operation.
 * @returns
 */
function CtxMenu({
  popupState,
  event,
}: {
  popupState: ReturnType<typeof usePopupState>;
  event: { e: React.MouseEvent<HTMLElement>; cid: string };
}) {
  const handleClose = () => popupState.close();

  // this method will also change album.
  const play = () => {
    SirenStore.dispatch({
      type: 'player/selectSong',
      cid: event.cid,
    });
    // navigate will help to init route, it can make jump correctly.
    navigate(`/music/${event.cid}`);
    handleClose();
  };
  // todo!: add cid get info and control ctx menu
  return (
    <>
      <BlackMenuItem onClick={play}>播放</BlackMenuItem>
      {/* <BlackMenuItem onClick={handleClose}>下一首播放</BlackMenuItem> */}
      {/* <BlackMenuItem onClick={handleClose}>添加到播放列表</BlackMenuItem> */}
      {/* <MyDivider /> */}
      {/* <BlackMenuItem onClick={handleClose}>显示专辑</BlackMenuItem> */}
      {/* <BlackMenuItem onClick={handleClose}>删除</BlackMenuItem> */}
      {/* <MyDivider />
      <BlackMenuItem onClick={handleClose}>显示信息</BlackMenuItem>
      <BlackMenuItem onClick={handleClose}>编辑信息</BlackMenuItem> */}
      <MyDivider />
      <BlackMenuItem onClick={handleClose}>下载歌曲</BlackMenuItem>
    </>
  );
}

const RightDetails: FunctionComponent<RightDetailsProps> = () => {
  const { currentAlbumInfo: info } = useStore($PlayListState);
  return (
    <div className='flex-1 pl-2 flex flex-col'>
      <RightDetailsTopInfo
        ListInfo={info}
        ImgPath={info.coverUrl ?? '/siren.png'}
      />
      <RightDetailsMiddleSplit />
      <div className='flex-1'>
        <RightDetailsBottomList ContextMenu={CtxMenu} />
      </div>
    </div>
  );
};

export default RightDetails;
