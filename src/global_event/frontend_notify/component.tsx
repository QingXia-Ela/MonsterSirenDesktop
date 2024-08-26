import Snackbar from '@/components/Snackbar';
import { FunctionComponent, useEffect, useState } from 'react';
import GlobalNotifyChannel, { NotifyMessageProps } from './channel';
import { IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

interface GlobalNotifyComponentProps { }

let queue: NotifyMessageProps[] = [];

let timer: any = null;

const GlobalNotifyComponent: FunctionComponent<
  GlobalNotifyComponentProps
> = () => {
  const [msgQueue, setMsgQueue] = useState<NotifyMessageProps[]>([]);
  const [curMsg, setCurMsg] = useState<NotifyMessageProps>();
  const [open, setOpen] = useState(false);

  // todo!: optimize this, seperate side effects
  useEffect(() => {
    // 当事件在同一帧被触发时 react 只会接受最后一个触发
    // 这个 channel 对于每个 key 只会有一个监听函数，新函数会替代旧函数，所以直接调用 listen api
    GlobalNotifyChannel.listen('notify', (msg) => {
      // 外部缓存队列用于处理同一帧内多次触发事件
      queue.push(msg);
      // 下一帧执行，此时队列内已经保存了上一帧所有同时获得的消息
      requestAnimationFrame(() => {
        // 设置新队列
        setMsgQueue([...msgQueue, ...queue]);
        // 延迟到下一帧执行，假如在同帧内更新 queue，react 在下一帧检查时会发现数组已经是空的而导致不触发渲染消息
        requestAnimationFrame(() => {
          queue = [];
        });
      });
    });
  }, [msgQueue]);

  if (msgQueue.length && !curMsg) {
    setCurMsg(msgQueue[0]);
    setMsgQueue(msgQueue.slice(1));
    setOpen(true);
    timer = setTimeout(() => {
      // close it and wait anime
      setOpen(false);
      setTimeout(() => {
        // remove msg, trigger rerender to next msg
        setCurMsg(undefined);
      }, 300);
    }, 6000);
  }

  const handleClose = (
    _event: React.SyntheticEvent | Event,
    reason?: string,
  ) => {
    if (reason === 'clickaway') {
      return;
    }
    // 相当于提前触发定时器内容，所以需要清理
    clearTimeout(timer);
    setOpen(false);
    setTimeout(() => {
      // remove msg, trigger rerender to next msg
      setCurMsg(undefined);
    }, 300);
  };

  const Action = (
    <IconButton
      size='small'
      aria-label='close'
      color='inherit'
      onClick={handleClose}
    >
      <CloseIcon
        style={{
          fontSize: '.4rem',
        }}
      />
    </IconButton>
  );

  return (
    <Snackbar {...(curMsg as NotifyMessageProps)} action={Action} open={open} />
  );
};

export default GlobalNotifyComponent;
