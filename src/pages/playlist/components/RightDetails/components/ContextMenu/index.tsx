import React, { useState } from 'react';
import { useStore } from '@nanostores/react';
import $PlayListState, { setCurrentAlbumId } from '@/store/pages/playlist';
import { usePopupState } from 'material-ui-popup-state/hooks';
import BlackMenuItem from '@/components/ContextMenu/BlackMenuV2/BlackMenuItem';
import SirenStore from '@/store/SirenStore';
import navigate from '@/router/utils/navigate';
import Divider from '@/components/ContextMenu/BlackMenuV2/Divider';
import SubMenu from '@/components/ContextMenu/BlackMenuV2/SubMenu';
import $CustomPlaylist, {
  addSongToPlaylist,
  createPlaylist,
  removeSongFromPlaylist,
} from '@/store/models/customPlaylist';
import Dialog from '@/components/Dialog';
import Input from '@/components/Input';
import Button from '@/components/Button';
import GlobalNotifyChannel from '@/global_event/frontend_notify/channel';
import { getSong } from '@/api/modules/song';

const addSongToPlaylistByCid = async (pid: string, cid: string) => {
  const { data } = await (await getSong(cid)).json();
  await addSongToPlaylist(pid, data);
};

const addSongWithNotice = async (
  playlist_id: string,
  cid: string,
  callback?: Function,
) => {
  try {
    await addSongToPlaylistByCid(playlist_id, cid);
    GlobalNotifyChannel.emit('notify', {
      severity: 'success',
      content: '歌曲添加成功',
    });
    callback?.();
  } catch (e: any) {
    GlobalNotifyChannel.emit('notify', {
      severity: 'error',
      content: '歌曲添加失败: ' + e,
    });
  }
};

const removeSongWithNotice = async (
  playlist_id: string,
  cid: string,
  callback?: Function,
) => {
  try {
    await removeSongFromPlaylist(playlist_id, cid);
    GlobalNotifyChannel.emit('notify', {
      severity: 'success',
      content: '歌曲删除成功',
    });
    callback?.();
  } catch (e: any) {
    GlobalNotifyChannel.emit('notify', {
      severity: 'error',
      content: '歌曲删除失败: ' + e,
    });
  }
};

/**
 * Note: this component will refresh when ctx open.
 *
 * Just use params and operation.
 * @returns
 */
// todo!: make each injector has own context menu.
function CtxMenu({
  popupState,
  event,
}: {
  popupState: ReturnType<typeof usePopupState>;
  event: { e: React.MouseEvent<HTMLElement>; cid: string };
}) {
  const { currentAlbumId } = useStore($PlayListState);
  const { playlist } = useStore($CustomPlaylist);
  const handleClose = () => popupState.close();
  const [nameDialog, setNameDialog] = useState(false);
  const [name, setName] = useState('');

  // this method will also change current album.
  const play = () => {
    SirenStore.dispatch({
      type: 'player/selectSong',
      cid: event.cid,
    });
    // navigate will help to init route, it can make jump correctly.
    navigate(`/music/${event.cid}`);
    handleClose();
  };
  const openDialog = () => {
    setNameDialog(true);
    handleClose();
  };
  const closeDialog = () => {
    setName('');
    setNameDialog(false);
  };
  const callTauriCreatePlaylist = () => {
    createPlaylist(name)
      .then(async (playlist: any) => {
        GlobalNotifyChannel.emit('notify', {
          severity: 'success',
          content:
            // @ts-expect-error: __DEV__ define in vite
            '创建播放列表成功: ' + (__DEV__ ? `歌单ID: ${playlist.id}` : ''),
        });
        await addSongWithNotice(playlist.id, event.cid, handleClose);
        // 触发播放列表页更新
        siren_store.dispatch({
          type: 'music/getAlbumList',
        });
        closeDialog();
      })
      .catch((e) => {
        GlobalNotifyChannel.emit('notify', {
          severity: 'error',
          content: '创建播放列表失败: ' + e,
        });
        // console.error(e);
      });
  };

  const refreshAlbum = () => {
    // 原生 store 不适用，会有原生页面副作用
    handleClose();
    setCurrentAlbumId(currentAlbumId);
  };

  return (
    <>
      <Dialog open={nameDialog} title='新建播放列表'>
        <Input value={name} onChange={(e) => setName(e.target.value)} />
        <div className='flex justify-end gap-2 mt-1'>
          <Button size='small' onClick={closeDialog}>
            取消
          </Button>
          <Button size='small' onClick={callTauriCreatePlaylist}>
            确认
          </Button>
        </div>
      </Dialog>
      <BlackMenuItem onClick={play}>播放</BlackMenuItem>
      <Divider />
      {/* <BlackMenuItem onClick={handleClose}>下一首播放</BlackMenuItem> */}
      {/* <BlackMenuItem onClick={handleClose}>添加到播放列表</BlackMenuItem> */}
      {/* <MyDivider /> */}
      {/* <BlackMenuItem onClick={handleClose}>显示专辑</BlackMenuItem> */}
      {/* <BlackMenuItem onClick={handleClose}>删除</BlackMenuItem> */}
      {/* <MyDivider />
      <BlackMenuItem onClick={handleClose}>显示信息</BlackMenuItem>
      <BlackMenuItem onClick={handleClose}>编辑信息</BlackMenuItem> */}
      <SubMenu label='添加到播放列表'>
        <BlackMenuItem onClick={openDialog}>+ 新建播放列表</BlackMenuItem>
        {playlist.map((item) => (
          <BlackMenuItem
            style={{ paddingLeft: '.76rem' }}
            key={item.id}
            onClick={() => addSongWithNotice(item.id, event.cid, handleClose)}
          >
            {item.name}
          </BlackMenuItem>
        ))}
      </SubMenu>
      {currentAlbumId.startsWith('custom:') && (
        <BlackMenuItem
          onClick={() =>
            removeSongWithNotice(currentAlbumId, event.cid, refreshAlbum)
          }
        >
          从播放列表移除
        </BlackMenuItem>
      )}
      <Divider />
      <BlackMenuItem onClick={handleClose}>下载歌曲</BlackMenuItem>
    </>
  );
}

export default CtxMenu;