import SirenStore from '@/store/SirenStore';

// todo!: optimize to really lazy load
// the album page show the img element with animate
// which means when you change to the last page, all img element to trigger load, not really lazy load
// we can listen `SirenStore -> music -> current page` change to make element lazy load
let setImgLazy: null | Function = function () {
  const imgs = document
    .querySelector('#layout')
    ?.querySelector('div[class^="pageMusic"]')
    ?.querySelectorAll('img');

  imgs?.forEach((img) => {
    img.setAttribute('loading', 'lazy');
  });
};

const unlisten = SirenStore.subscribe(() => {
  const init = SirenStore.getState().section.pageStatus['/music']?.initiated;

  if (init) {
    setImgLazy?.();
    unlisten();
    setImgLazy = null;
  }
});
