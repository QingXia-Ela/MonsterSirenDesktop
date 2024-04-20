import { FunctionComponent } from 'react';
import ListLeftBottomDetails from './components/BottomList';
import useSirenStore from '@/hooks/useSirenStore';
import $PlayListState, { setCurrentAlbumId } from '@/store/pages/playlist';
import { useStore } from '@nanostores/react';
import $settingBasic from '@/store/models/settings/basic';
import { basicConfig } from '@/types/Config';
import $DummyPlaylist from '@/store/models/dummyPlaylist';

interface LeftListProps {}

const namespaceReg = /(\w+):.+/;

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
    // todo!: 增加隐藏塞壬唱片音乐处理
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

        // todo!: 打平模式，需要做额外设计，需要有一个特殊 id 可以获取所有的歌曲
        case 'collect':
          break;
      }
    }
  }

  return Object.values(map);
}

const LeftList: FunctionComponent<LeftListProps> = () => {
  const { currentAlbumId: activeId } = useStore($PlayListState);
  // const dummyPlayListInfo = useStore($DummyPlaylist)
  const albumList = useSirenStore((s) => s.music.albumList);

  // get album list if list doesn't exist
  // this process will also trigger on vanilla page change to `music`

  // todo!: change player list fetch by tauri event, not network transform
  // network transform is slow if some inject is slow, the network needs to wait all inject finish
  const playerList = parseAlbumListToBottomList(
    [
      // dummyPlayListInfo.metadata,
      ...albumList,
    ],
    $settingBasic.get().showSirenMusicListMode,
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
