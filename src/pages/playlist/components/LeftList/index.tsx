import { FunctionComponent, useState } from 'react';
import ListLeftBottomDetails from './components/BottomList';
import SirenStore from '@/store/SirenStore';

interface LeftListProps { }

const namespaceReg = /(\w+):.+/

const namespaceTranslateMap: Record<string, string> = {
  "local": "本地音乐",
  "template": "模板",
  "siren": "塞壬唱片官方专辑",
}

function parseAlbumListToBottomList(list: {
  cid: string
  name: string
  coverUrl: string
  artists: string[]
}[]) {
  const map: Record<string, any> = {}

  for (let i = 0; i < list.length; i++) {
    const element = list[i];
    // custom playlist
    if (namespaceReg.test(element.cid)) {
      const [_, namespace] = namespaceReg.exec(element.cid)!

      if (!map[namespace]) {
        map[namespace] = {
          title: namespaceTranslateMap[namespace] || namespace,
          namespace,
          data: [],
        }
      }

      map[namespace].data.push({
        type: 'img',
        src: element.coverUrl,
        id: element.cid,
        title: element.name,
        subTitle: element.artists?.join(','),
      })
    }
    // official playlist
    // todo!: add classify mod
    // 第一种分类方法是展示所有专辑列表，第二种是将所有歌曲收录进当前列表
    else if (!isNaN(parseInt(element.cid))) {
      if (!map['siren']) {
        map['siren'] = {
          title: '塞壬唱片官方专辑',
          namespace: 'siren',
          data: [],
        }
      }

      map['siren'].data.push({
        type: 'img',
        src: element.coverUrl,
        id: element.cid,
        title: element.name,
        subTitle: element.artists?.join(','),
      })
    }
  }

  return Object.values(map)
}

const LeftList: FunctionComponent<LeftListProps> = () => {
  const [activeId, setActiveId] = useState('test/3');

  const playerList = parseAlbumListToBottomList(SirenStore.getState().music.albumList)

  return (
    <div className='w-20 flex flex-col'>
      <div className='text-[.6em] font-bold'>播放列表</div>
      <ListLeftBottomDetails
        activeId={activeId}
        ListData={playerList}
      />
    </div>
  );
};

export default LeftList;
