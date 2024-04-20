import GlobalNotifyChannel from "@/global_event/frontend_notify/channel";


// todo!: download in webview cannot work
export default function downloadByBrowser(url: string, filename: string) {
  GlobalNotifyChannel.emit("notify", {
    severity: "info",
    title: "下载提示",
    content: `该方法仍在实现中，等以后再来试试吧`,
  })
  return
  const link = document.createElement('a');
  link.download = filename;
  link.href = url;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
