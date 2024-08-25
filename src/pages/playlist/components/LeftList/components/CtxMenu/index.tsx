import { getAlbumDetail } from '@/api/modules/album';
import Button from '@/components/Button';
import BlackMenuItem from '@/components/ContextMenu/BlackMenuV2/BlackMenuItem';
import Divider from '@/components/ContextMenu/BlackMenuV2/Divider';
import Dialog from '@/components/Dialog';
import GlobalNotifyChannel from '@/global_event/frontend_notify/channel';
import SirenStore from '@/store/SirenStore';
import { removePlaylist } from '@/store/models/customPlaylist';
import { useState } from 'react';
interface PlaylistLeftCtxMenuProps {
  cid: string;
  handleClose: () => void;
}

function DeleteDialog({
  open,
  close,
  confirm,
}: {
  open: boolean;
  confirm: () => void;
  close: () => void;
}) {
  return (
    <Dialog open={open} title='删除歌单'>
      <div className='text-center'>确定要删除该歌单吗</div>
      <div className='flex justify-end gap-2 mt-2'>
        <Button size='small' onClick={close}>
          取消
        </Button>
        <Button size='small' onClick={confirm}>
          确认
        </Button>
      </div>
    </Dialog>
  );
}

function ModifyInfoDialog({
  open,
  confirm,
  close,
}: {
  open: boolean;
  confirm: () => void;
  close: () => void;
}) {
  return (
    <Dialog open={open} title='修改歌单信息'>
      <span>未实现，先等等吧</span>
      <div className='flex justify-end gap-2 mt-2'>
        <Button size='small' onClick={close}>
          取消
        </Button>
        <Button size='small' onClick={confirm}>
          确认
        </Button>
      </div>
    </Dialog>
  );
}

async function removePlaylistWithNotice(cid: string) {
  try {
    await removePlaylist(cid);
    GlobalNotifyChannel.emit('notify', {
      severity: 'success',
      content: '删除成功',
    });
  } catch (e) {
    GlobalNotifyChannel.emit('notify', {
      severity: 'error',
      content: '删除歌单失败',
    });
  }
}

function PlaylistLeftCtxMenu({ cid, handleClose }: PlaylistLeftCtxMenuProps) {
  const [confirmDel, setConfirmDel] = useState(false);
  const [modifyInfo, setModifyInfo] = useState(false);
  const play = async () => {
    handleClose();
    const res = await (await getAlbumDetail(cid)).json();
    const songId = res.data.songs[0]?.cid
    if (songId) {
      SirenStore.dispatch({
        type: 'player/selectSong',
        cid: songId,
      });
      SirenStore.dispatch({
        type: 'player/setIsPlaying',
        isPlaying: true,
      });
    }
  };
  const callTauriDeletePlaylist = async () => {
    handleClose();
    await removePlaylistWithNotice(cid);
    // force refresh
    SirenStore.dispatch({
      type: 'music/getAlbumList',
    });
    setConfirmDel(false);
  };

  return (
    <>
      <BlackMenuItem style={{ paddingLeft: '.64rem' }} onClick={play}>
        播放该列表
      </BlackMenuItem>
      {cid.startsWith('custom:') && (
        <>
          <Divider />
          <DeleteDialog
            open={confirmDel}
            confirm={callTauriDeletePlaylist}
            close={() => setConfirmDel(false)}
          />
          <BlackMenuItem onClick={() => setConfirmDel(true)}>
            - 删除该歌单
          </BlackMenuItem>
          <ModifyInfoDialog
            open={modifyInfo}
            confirm={() => setModifyInfo(false)}
            close={() => setModifyInfo(false)}
          />
          <BlackMenuItem
            style={{ paddingLeft: '.64rem' }}
            onClick={() => setModifyInfo(true)}
          >
            编辑歌单信息
          </BlackMenuItem>
        </>
      )}
    </>
  );
}

export default PlaylistLeftCtxMenu;
