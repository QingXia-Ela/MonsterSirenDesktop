import { FunctionComponent } from 'react';
import ListLeftBottomDetails from './components/BottomList';
import useSirenStore from '@/hooks/useSirenStore';
import $PlayListState, { setCurrentAlbumId } from '@/store/pages/playlist';
import { useStore } from '@nanostores/react';
import $settingBasic from '@/store/models/settings/basic';
import { basicConfig } from '@/types/Config';
import $DummyPlaylist from '@/store/models/dummyPlaylist';
import $settingLocalMusic from '@/store/models/settings/localMusic';
import SirenStore from '@/store/SirenStore';
import { SettingsManager } from '@/store/models/settings';

interface LeftListProps {}

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

$settingLocalMusic.subscribe(() => {
  SirenStore.dispatch({
    type: 'music/getAlbumList',
  });
});

// todo!: 当本地文件夹被移除时需要检查当前页选择的文件夹是否为被移除的文件夹，如果是则需要清空激活状态
const LeftList: FunctionComponent<LeftListProps> = () => {
  const { currentAlbumId: activeId } = useStore($PlayListState);
  const { showSirenMusicListMode } = useStore($settingBasic);
  // const dummyPlayListInfo = useStore($DummyPlaylist)
  const albumList = useSirenStore((s) => s.music.albumList);

  // get album list if list doesn't exist
  // this process will also trigger on vanilla page change to `music`

  // todo!: change player list fetch by tauri event, not network transform
  // network transform is slow if some inject is slow, the network needs to wait all inject finish
  const playerList = parseAlbumListToBottomList(
    albumList,
    showSirenMusicListMode,
  );

  const onSelect = (cid: string) => {
    // 原生 store 不适用，会有原生页面副作用
    setCurrentAlbumId(cid);
  };

  return (
    <div className='w-20 flex flex-col'>
      <div className='text-[.6em] font-bold'>播放列表</div>
      <ListLeftBottomDetails
        activeId={activeId}
        onClickItem={onSelect}
        ListData={playerList}
      />
    </div>
  );
};

export default LeftList;
