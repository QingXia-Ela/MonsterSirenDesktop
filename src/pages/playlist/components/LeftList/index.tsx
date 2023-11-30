import { FunctionComponent, useState } from 'react';
import ListLeftBottomDetails from './components/BottomList';

interface LeftListProps {}

const LeftList: FunctionComponent<LeftListProps> = () => {
  const [activeId, setActiveId] = useState('test/3');
  return (
    <div className='w-20 flex flex-col'>
      <div className='text-[.6em] font-bold'>播放列表</div>
      <ListLeftBottomDetails
        activeId={activeId}
        ListData={[
          {
            title: '测试',
            namespace: 'test',
            data: Array.from({ length: 10 }).map((v, i) => ({
              type: 'icon',
              iconClass: 'iconfont icon-24gl-musicAlbum',
              id: i.toString(),
              title: '新建播放器列表',
              subTitle: '共114首歌曲',
            })),
          },
        ]}
      />
    </div>
  );
};

export default LeftList;
