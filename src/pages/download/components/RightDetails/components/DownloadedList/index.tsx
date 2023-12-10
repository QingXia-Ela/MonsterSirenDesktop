import FlowText from '@/components/FlowText';
import Scrollbar from '@/components/Scrollbar';
import Tag from '@/components/Tag';
import SirenStore from '@/store/SirenStore';
import React, { FunctionComponent } from 'react';
import TopDownloadDir from './components/TopDownloadDir';

interface TagType {
  content: string;
  color?: string;
}

const SingleItem: React.FC<{
  name: string;
  artists?: string[];
  album?: string;
  size?: string;
  tags?: TagType[];
  downloadTime?: string;
}> = ({ name, artists = [], album, size, tags = [], downloadTime }) => (
  <a
    className='flex w-full py-1 px-2 bg-white bg-opacity-0 hover:bg-opacity-10 rounded-sm 
    items-center transition-[background-color,opacity,transform] font-[SourceHanSansCN-Bold]
    duration-300 text-[.28rem] rotate-0 translate-x-0 translate-y-0 skew-x-0 skew-y-0
     active:scale-[.98] active:opacity-60 select-none box-border group'
  >
    <div className='w-[25%] pr-[.2rem] overflow-hidden'>
      <FlowText>{name}</FlowText>
    </div>
    <div className='w-[20%] pr-[.2rem] overflow-hidden'>
      {artists.join(' / ')}
    </div>
    <div className='w-[20%] pr-[.2rem] overflow-hidden'>{album}</div>
    <div className='w-[10%]'>{size}</div>
    <div className='w-[12%]'>
      {tags.map((v, i) => (
        <Tag key={i} color={v.color}>
          {v.content}
        </Tag>
      ))}
    </div>
    <div className='w-[18%]'>{downloadTime}</div>
  </a>
);

interface DownloadingListProps {}

const DownloadedList: FunctionComponent<DownloadingListProps> = () => {
  const list = SirenStore.getState().player.list;
  return (
    <div className='w-full h-full flex flex-col'>
      <TopDownloadDir />
      <div
        className='w-[98%] flex py-1 px-2 rounded-sm 
    items-center font-[SourceHanSansCN-Bold]
     text-[.28rem] select-none box-border'
      >
        <div className='w-[25%] pr-[.2rem] overflow-hidden'>歌曲名</div>
        <div className='w-[20%] pr-[.2rem] overflow-hidden'>歌手</div>
        <div className='w-[20%] pr-[.2rem] overflow-hidden'>专辑</div>
        <div className='w-[10%]'>大小</div>
        <div className='w-[12%]'>音频来源</div>
        <div className='w-[18%]'>下载时间</div>
      </div>
      <div className='flex-1'>
        <Scrollbar
          marginBarHeightLimit={2}
          VirtuosoOptions={{
            VirtuosoProps: {
              style: {
                height: '100%',
              },
              itemContent: (i, data: (typeof list)[0]) => (
                <SingleItem
                  key={i}
                  name={data.name}
                  tags={[
                    {
                      content: '塞壬唱片',
                    },
                  ]}
                  downloadTime='2022-12-12 11:45:14'
                  artists={data.artists}
                  size='3.3MB'
                  album={data.albumCid}
                />
              ),
              data: list,
            },
          }}
        />
      </div>
    </div>
  );
};

export default DownloadedList;
