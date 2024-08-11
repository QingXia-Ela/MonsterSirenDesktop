import { RouteItem } from './types';
import PlayList from '@/pages/playlist';
import Download from '@/pages/download';
/**
 * 路由只会往页面尾部追加
 */
const routes: RouteItem[] = [
  {
    type: 'path',
    path: '/playlist',
    component: PlayList,
    addToNav: true,
    name: '播放列表',
  },
  {
    type: 'path',
    path: '/download',
    component: Download,
    name: '下载',
  },
];

export default routes;
