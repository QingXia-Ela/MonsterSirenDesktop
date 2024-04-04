import { FunctionComponent, useEffect, useState } from 'react';
import ListLeftBottomDetails from './components/BottomList';
import SirenStore from '@/store/SirenStore';
import useSirenStore from '@/hooks/useSirenStore';
import { SirenStoreState } from '@/types/SirenStore';
import $PlayListState, { setCurrentAlbumId } from '@/store/pages/playlist';
import { useStore } from '@nanostores/react';
import $settingBasic from '@/store/models/settings/basic';
import { basicConfig } from '@/types/Config';

interface LeftListProps { }

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

function filterStore(store: SirenStoreState) {
  return store.musicPlay.albumDetail.cid;
}

const LeftList: FunctionComponent<LeftListProps> = () => {
  const { currentAlbumId: activeId } = useStore($PlayListState);

  // get album list if list doesn't exist
  // this process will also trigger on vanilla page change to `music`

  // const playerList = parseAlbumListToBottomList(
  //   SirenStore.getState().music.albumList,
  // );
  const playerList = parseAlbumListToBottomList(
    useSirenStore((s) => s.music.albumList),
    $settingBasic.get().showSirenMusicListMode,
  );

  const onSelect = (cid: string) => {
    // 原生 store 不适用，会有原生页面副作用
    // SirenStore.dispatch({
    //   type: "musicPlay/getAlbumDetail",
    //   cid
    // })
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
