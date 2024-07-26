import GlobalNotifyChannel from "@/global_event/frontend_notify/channel";

function onlineSwitchTip(online: boolean) {
  if (online) {
    GlobalNotifyChannel.emit('notify', {
      severity: 'success',
      title: '已连接网络',
      content: '网络连接成功，可以重启软件以启用官网和插件等联网功能。',
    });
  } else {
    GlobalNotifyChannel.emit('notify', {
      severity: 'info',
      title: '无网络',
      content: '无网络连接，部分在线功能已停用。',
    });
  }
}

window.addEventListener('online', () => onlineSwitchTip(true))
window.addEventListener('offline', () => onlineSwitchTip(false))

if (!window.navigator.onLine) {
  GlobalNotifyChannel.emit('notify', {
    severity: 'info',
    title: '无网络',
    content: '你似乎处于离线模式，部分在线功能已停用。',
  })
}