// todo!: download in webview cannot work
export default function downloadByBrowser(url: string, filename: string) {
  const link = document.createElement('a');
  link.download = filename;
  link.href = url;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
