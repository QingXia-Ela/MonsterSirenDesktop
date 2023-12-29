import { listen } from '@tauri-apps/api/event';
import GlobalNotifyChannel from './channel';

listen<string>('notify:error', ({ payload }) => {
  GlobalNotifyChannel.emit('notify', {
    severity: 'error',
    title: '错误',
    content: payload,
  });
});

listen<string>('notify:success', ({ payload }) => {
  GlobalNotifyChannel.emit('notify', {
    severity: 'success',
    title: '成功',
    content: payload,
  });
});

listen<string>('notify:info', ({ payload }) => {
  GlobalNotifyChannel.emit('notify', {
    severity: 'info',
    title: '提示',
    content: payload,
  });
});

listen<string>('notify:warning', ({ payload }) => {
  GlobalNotifyChannel.emit('notify', {
    severity: 'warning',
    title: '警告',
    content: payload,
  });
});
