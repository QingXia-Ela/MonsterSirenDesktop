import { FunctionComponent, useEffect, useState } from 'react';
import ListLeftBottomDetails from './components/BottomList';
import SirenStore from '@/store/SirenStore';
import useSirenStore from '@/hooks/useSirenStore';
import { SirenStoreState } from '@/types/SirenStore';
import { setCurrentListId } from '@/store/pages/playlist';

interface LeftListProps { }

const namespaceReg = /(\w+):.+/;

// todo!: 增加插件转译
const namespaceTranslateMap: Record<string, string> = {
  local: '本地音乐',
  template: '模板',
  siren: '塞壬唱片官方专辑',
};

function parseAlbumListToBottomList(
  list: {
    cid: string;
    name: string;
    coverUrl: string;
    artists: string[];
  }[],
) {
  const map: Record<string, any> = {};

  for (let i = 0; i < list.length; i++) {
    const element = list[i];
    // custom playlist
    if (namespaceReg.test(element.cid)) {
      const [_, namespace] = namespaceReg.exec(element.cid)!;

      if (!map[namespace]) {
        map[namespace] = {
          title: namespaceTranslateMap[namespace] || namespace,
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
      if (!map['siren']) {
        map['siren'] = {
          title: '塞壬唱片官方专辑',
          namespace: 'siren',
          data: [],
        };
      }

      // todo!: 打平列表模式

      // 全部展示模式
      map['siren'].data.push({
        type: 'img',
        src: element.coverUrl,
        id: element.cid,
        title: element.name,
        subTitle: element.artists?.join(','),
      });
    }
  }

  return Object.values(map);
}

function filterStore(store: SirenStoreState) {
  return store.musicPlay.albumDetail.cid;
}

const LeftList: FunctionComponent<LeftListProps> = () => {
  const activeId = useSirenStore(filterStore);

  // get album list if list doesn't exist
  // this process will also trigger on vanilla page change to `music`

  // const playerList = parseAlbumListToBottomList(
  //   SirenStore.getState().music.albumList,
  // );
  const playerList = parseAlbumListToBottomList(useSirenStore((s) => s.music.albumList))

  const onSelect = (cid: string) => {
    // 原生 store 不适用，会有原生页面副作用
    // SirenStore.dispatch({
    //   type: "musicPlay/getAlbumDetail",
    //   cid
    // })
    // todo!: use $PlayListState to change the playlist
  }

  return (
    <div className='w-20 flex flex-col'>
      <div className='text-[.6em] font-bold'>播放列表</div>
      <ListLeftBottomDetails activeId={activeId} onClickItem={onSelect} ListData={playerList} />
    </div>
  );
};

export default LeftList;
