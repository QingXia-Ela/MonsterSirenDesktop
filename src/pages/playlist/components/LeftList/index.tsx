import { FunctionComponent, useState } from 'react';
import ListLeftBottomDetails from './components/BottomList';
import useSirenStore from '@/hooks/useSirenStore';
import $PlayListState, {
  clearCurrentAlbum,
  setCurrentAlbumId,
} from '@/store/pages/playlist';
import { useStore } from '@nanostores/react';
import $settingBasic from '@/store/models/settings/basic';
import { basicConfig } from '@/types/Config';
import $settingLocalMusic from '@/store/models/settings/localMusic';
import SirenStore from '@/store/SirenStore';
import BlackMenuV2 from '@/components/ContextMenu/BlackMenuV2';
import PlaylistLeftCtxMenu from './components/CtxMenu';
import { useMenuState } from '@szhsin/react-menu';

interface LeftListProps {}

$settingLocalMusic.subscribe(() => {
  SirenStore.dispatch({
    type: 'music/getAlbumList',
  });
});
const namespaceReg = /(\w+):.+/;

// todo!: refactor this and improve performance
function parseAlbumListToBottomList(
  list: {
    cid: string;
    cnNamespace?: string;
    name: string;
    coverUrl: string;
    artists: string[];
  }[],
  sirenListMode: basicConfig['showSirenMusicListMode'],
) {
  const map: Record<string, any> = {};

  for (let i = 0; i < list.length; i++) {
    const element = list[i];
    // custom playlist
    if (namespaceReg.test(element.cid)) {
      const [_, namespace] = namespaceReg.exec(element.cid)!;

      if (!map[namespace]) {
        map[namespace] = {
          title: element.cnNamespace || namespace,
          namespace,
          data: [],
        };
      }

      map[namespace].data.push({
        type: 'img',
        src: element.coverUrl,
        id: element.cid,
        title: element.name,
        subTitle: element.artists?.join(','),
      });
    }
    // official playlist
    // request id `siren:all`
    else if (sirenListMode === 'collect') {
      // 有打平列表了，直接跳过
      if (map['siren']?.data.length) continue;
      // 没有打平列表，直接把所有歌曲塞进去
      map['siren'] = {
        title: '塞壬唱片官方专辑',
        namespace: 'siren',
        data: [
          {
            type: 'img',
            src: '/siren.png',
            id: 'siren:all',
            title: '全歌曲播放列表',
            subTitle: 'Ciallo～(∠・ω< )⌒★',
          },
        ],
      };
    }
    // 第一种分类方法是展示所有专辑列表，第二种是将所有歌曲收录进当前列表
    else if (!isNaN(parseInt(element.cid))) {
      if (sirenListMode !== 'hide' && !map['siren']) {
        map['siren'] = {
          title: '塞壬唱片官方专辑',
          namespace: 'siren',
          data: [],
        };
      }

      switch (sirenListMode) {
        // 全部展示模式
        case 'show':
          map['siren'].data.push({
            type: 'img',
            src: element.coverUrl,
            id: element.cid,
            title: element.name,
            subTitle: element.artists?.join(','),
          });
          break;
      }
    }
  }

  return Object.values(map);
}

let timer: any = null;
// todo!: 当本地文件夹被移除时需要检查当前页选择的文件夹是否为被移除的文件夹，如果是则需要清空激活状态
const LeftList: FunctionComponent<LeftListProps> = () => {
  const [anchorPoint, setAnchorPoint] = useState<any>();
  const { currentAlbumId: activeId } = useStore($PlayListState);
  const { showSirenMusicListMode } = useStore($settingBasic);
  // 上方已经触发响应式更新，所以这里直接 useStore 即可
  const albumList = useSirenStore((s) => s.music.albumList);
  const [ctxCid, setCtxCid] = useState<string>('');
  const [menuProps, toggleMenu] = useMenuState({
    transition: true,
  });

  // 当前激活id不在播放列表中时，清空当前播放列表信息
  if (activeId.length && !albumList.some((item) => item.cid === activeId)) {
    clearCurrentAlbum();
  }

  // todo!: change player list fetch by promise event, and combine with tauri
  // network transform is slow if some inject is slow, the network needs to wait all inject finish
  const playerList = parseAlbumListToBottomList(
    albumList,
    showSirenMusicListMode,
  );

  const onSelect = (_e: any, cid: string) => {
    // 原生 store 不适用，会有原生页面副作用
    setCurrentAlbumId(cid);
  };
  const onCtxMenu = (e: React.MouseEvent, cid: string) => {
    setCtxCid(cid);
    setAnchorPoint({ x: e.clientX, y: e.clientY });
    toggleMenu(true);
    clearTimeout(timer);
  };
  const closeCtxMenu = () => {
    toggleMenu(false);
  };

  return (
    <div className='w-20 flex flex-col'>
      <div className='text-[.6em] font-bold'>播放列表</div>
      <BlackMenuV2
        {...menuProps}
        onClose={closeCtxMenu}
        anchorPoint={anchorPoint}
        theming='dark'
      >
        <PlaylistLeftCtxMenu handleClose={closeCtxMenu} cid={ctxCid} />
      </BlackMenuV2>
      <ListLeftBottomDetails
        activeId={activeId}
        onClickItem={onSelect}
        onCtxMenuOnItem={onCtxMenu}
        ListData={playerList}
      />
    </div>
  );
};

export default LeftList;
