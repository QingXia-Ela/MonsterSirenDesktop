import once from 'lodash/once';
import SirenStore from '@/store/SirenStore';

const setImgLazy = once(function () {
  const imgs = document
    .querySelector('#layout')
    ?.querySelector('div[class^="pageMusic"]')
    ?.querySelectorAll('img');

  imgs?.forEach((img) => {
    img.setAttribute('loading', 'lazy');
  });
});

const unlisten = SirenStore.subscribe(() => {
  const init = SirenStore.getState().section.pageStatus['/music']?.initiated;

  if (init) {
    setImgLazy();
    unlisten();
  }
});
