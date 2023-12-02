import Scrollbar from '@/components/Scrollbar';
import Tag from '@/components/Tag';
import React, { FunctionComponent } from 'react';
import { Progress } from 'tdesign-react';

const SingleItem: React.FC<{
  name: string;
  status: {
    text: string;
    precentage?: number;
  };
  tags?: string[] | string;
}> = ({ name, status: { text, precentage }, tags = [] }) => (
  <a
    className='flex w-full py-1 px-2 mb-1 bg-white bg-opacity-0 hover:bg-opacity-10 rounded-sm 
    items-center transition-[background-color,opacity] font-[SourceHanSansCN-Bold]
    duration-300 text-[.36rem] active:opacity-60 select-none box-border'
  >
    <div className='w-[30%]'>{name}</div>
    <div className='flex-1 flex gap-1 items-center'>
      <span className='mr-1'>{text}</span>
      <div className='w-[50%] text-[#ccc]'>
        {typeof precentage === 'number' && (
          <Progress
            style={{
              // @ts-expect-error: declare css variable
              '--td-text-color-primary': '#ccc',
              '--td-comp-margin-s': '.4rem',
              fontSize: '.3rem',
            }}
            color={'#fff'}
            trackColor='rgba(255, 255, 255, 0.2)'
            percentage={precentage}
          />
        )}
      </div>
    </div>
    <div className='w-[15%]'>
      {Array.isArray(tags) ? tags?.map((v, i) => <Tag key={i}>{v}</Tag>) : tags}
    </div>
  </a>
);

interface DownloadingListProps {}

const DownloadingList: FunctionComponent<DownloadingListProps> = () => {
  return (
    <div className='w-full h-full flex flex-col'>
      <div className='w-[98%]'>
        <SingleItem
          name='歌曲名'
          status={{ text: '下载状态' }}
          tags={'音频来源'}
        />
      </div>
      <div className='flex-1'>
        <Scrollbar
          marginBarHeightLimit={2}
          VirtuosoOptions={{
            VirtuosoProps: {
              style: {
                height: '100%',
              },
              itemContent: (i) => (
                <SingleItem
                  key={i}
                  name={`${i}歌曲`}
                  status={{ text: '下载中', precentage: 50 }}
                  tags={['塞壬唱片']}
                />
              ),
              data: Array.from({ length: 100 }),
            },
          }}
        />
      </div>
    </div>
  );
};

export default DownloadingList;
