import once from 'lodash/once';
import SirenStore from '@/store/SirenStore';
import downloadByBrowser from '@/utils/download/downloadByBrowser';

const reg = /\/music\/([\w|:]+)/;
/** **Note**: you need to remove query (chara after and include `?`) first */
const fileExtensionReg = /(\.\w{2,4})$/;

function getExtensionByUrl(url: string) {
  return fileExtensionReg.exec(url)?.[1];
}

function isElementExist() {
  return !!document.querySelector('div[data-custom-download]');
}

function getControl() {
  return document
    .querySelector('div[class^="musicPlayPage__"]')
    ?.querySelector('div[class^="control__"]') as HTMLDivElement;
}

function getDownloadButton(wrapperClass: string, iconClass: string) {
  const root = document.createElement('div');
  const icon = document.createElement('i');

  root.setAttribute('data-custom-download', '');
  root.setAttribute('class', wrapperClass);
  root.setAttribute('title', '下载音频');
  icon.setAttribute('class', iconClass);
  icon.setAttribute('style', 'font-size: .62rem; font-weight: 700;');

  root.addEventListener('click', () => {
    const { sourceUrl, name } = SirenStore.getState().player.songDetail;
    if (getExtensionByUrl(sourceUrl || ''))
      downloadByBrowser(sourceUrl!, `${name}${getExtensionByUrl(sourceUrl!)}`);
  });

  root.appendChild(icon);

  return root;
}

let addDownloadButton = once(() => {
  if (isElementExist()) {
    return;
  }

  const control = getControl();

  if (!control) {
    return;
  }

  // get by user interface
  control.style.width = '95%';

  const prevButton = control.firstChild! as HTMLDivElement;
  const playlistButton = control.lastChild! as HTMLDivElement;

  const wrapperClass = prevButton.getAttribute('class')!,
    iconClass = (prevButton.firstChild as HTMLDivElement).getAttribute(
      'class',
    )!;

  const downloadButton = getDownloadButton(
    wrapperClass,
    `${iconClass} iconfont icon-24gl-download`,
  );
  control.insertBefore(downloadButton, playlistButton);
});

const unlisten = SirenStore.subscribe(() => {
  const init = location.pathname.match(reg);

  if (init && getControl()) {
    addDownloadButton();
    unlisten();
  }
});
