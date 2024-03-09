import Scrollbar from '@/components/Scrollbar';
import { FunctionComponent } from 'react';
import SingleItem from './SingleItem';
import { useStore } from '@nanostores/react';
import $PlayListState from '@/store/pages/playlist';
import EmptyTips from '../EmptyTips';

interface RightDetailsBottomListProps { }

const RightDetailsBottomList: FunctionComponent<
  RightDetailsBottomListProps
> = () => {
  const {
    currentAlbumData: list,
    currentAlbumInfo: info
  } = useStore($PlayListState);

  return (
    list.length ? (
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
                album={info.name}
                time={""}
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
    ) : (
      <EmptyTips />
    )
  );
};

export default RightDetailsBottomList;
