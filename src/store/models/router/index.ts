import { atom } from 'nanostores';
import SirenStore from '@/store/SirenStore';
import SirenRouter from '@/router/SirenRouter';
import routes from '@/router';

// var a = require("@mui/material")

const $customRouter = atom({
  path: '',
  pageEntered: true,
  canRoute: true,
});

const activedPathSet = new Set();

let path = '';
const namespaceMusicPath = /\/music\/([\w|:]+)/g;
// listen path change
SirenStore.subscribe(() => {
  // get real location instead store inner path
  const currentPath = window.location.pathname;

  if (currentPath && path !== currentPath) {
    path = currentPath;
    // when user click return on music player page, and return to custom page.
    // the store `section/activePage` couldn't work correctly.
    // need to call manually to recover page animate.
    // todo!: 增加自定义页面路径判断
    if (currentPath === '/playlist') {
      setRouterPath(path);
    }
    // 音乐切换时，路由也会变化，会导致自定义路由页退出展示
    // 发生音乐切换时，路由变化为 `/last/route` -> `/music/cid`
    // 因此假如下一个跳转页面是音乐页面，且当前页面不是音乐详情页面，则需要拦截自定义路由跳转操作
    if (
      !currentPath.match(namespaceMusicPath) &&
      // @ts-expect-error: path always compareable
      !routes.some((route) => route.path === currentPath)
    ) {
      $customRouter.set({ ...$customRouter.get(), path });
    }
  }
});

export function setRouterPath(path: string) {
  SirenRouter.push(path);
  $customRouter.set({ ...$customRouter.get(), path });
  if (activedPathSet.has(path)) {
    SirenStore.dispatch({ type: 'section/activatePage', path });
  } else {
    activedPathSet.add(path);
    SirenStore.dispatch({ type: 'section/initPage', path });
  }
}

export function setPageEntered(pageEntered: boolean) {
  $customRouter.set({ ...$customRouter.get(), pageEntered });
}

export function setCanRoute(canRoute: boolean) {
  $customRouter.set({ ...$customRouter.get(), canRoute });
  SirenStore.dispatch({
    type: 'section/pageEntered',
    path: $customRouter.get().path,
  });
}

export default $customRouter;
