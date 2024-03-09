import Scrollbar from '@/components/Scrollbar';
import { FunctionComponent } from 'react';
import SingleItem from './SingleItem';
import useSirenStore from '@/hooks/useSirenStore';

interface RightDetailsBottomListProps { }

const RightDetailsBottomList: FunctionComponent<
  RightDetailsBottomListProps
> = () => {
  const list = useSirenStore((s) => s.player.list);

  return (
    <Scrollbar
      marginBarHeightLimit={1.2}
      VirtuosoOptions={{
        className: 'scrollbar__hidden',
        VirtuosoProps: {
          totalCount: list.length,
          itemContent: (idx) => (
            <SingleItem
              key={idx}
              name={list[idx].name}
              author={list[idx].artists?.join(',')}
              album={'危机合约'}
              time={'01:14'}
              tags={[
                {
                  content: '塞壬唱片',
                  color: '#eee',
                },
              ]}
            />
          ),
        },
      }}
    />
  );
};

export default RightDetailsBottomList;
