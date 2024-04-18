import Scrollbar from '@/components/Scrollbar';
import { FunctionComponent } from 'react';
import SingleItem from './SingleItem';
import { useStore } from '@nanostores/react';
import $PlayListState from '@/store/pages/playlist';
import EmptyTips from '../EmptyTips';
import {
  usePopupState,
  bindTrigger,
  bindMenu,
  bindContextMenu
} from 'material-ui-popup-state/hooks';
import BlackMenu from '@/components/ContextMenu/BlackMenu';

interface RightDetailsBottomListProps {
  ContextMenu?: (...args: any) => JSX.Element;
}

const RightDetailsBottomList: FunctionComponent<
  RightDetailsBottomListProps
> = ({ ContextMenu }) => {
  const { currentAlbumData: list, currentAlbumInfo: info } =
    useStore($PlayListState);

  const popupState = usePopupState({
    variant: 'popover',
    popupId: 'playlistRightDetailSongList',
  });

  return list.length ? (
    <>
      <Scrollbar
        {...bindContextMenu(popupState)}
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
      {
        ContextMenu && <BlackMenu
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'left',
          }}
          {...bindMenu(popupState)}
        >
          <ContextMenu popupState={popupState} />
        </BlackMenu>
      }
    </>
  ) : (
    <EmptyTips />
  );
};

export default RightDetailsBottomList;
