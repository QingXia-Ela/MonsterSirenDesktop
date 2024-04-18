import Scrollbar from '@/components/Scrollbar';
import { FunctionComponent, createRef, useRef, useState } from 'react';
import SingleItem from './SingleItem';
import { useStore } from '@nanostores/react';
import $PlayListState from '@/store/pages/playlist';
import EmptyTips from '../EmptyTips';
import PopupState, {
  usePopupState,
  bindMenu,
  bindContextMenu,
} from 'material-ui-popup-state/hooks';
import BlackMenu from '@/components/ContextMenu/BlackMenu';

interface RightDetailsBottomListProps {
  ContextMenu?: (...args: any) => JSX.Element;
}

function findItemId(e: React.MouseEvent<HTMLElement>) {
  let current: HTMLElement | null = e.target as HTMLElement;

  while (current) {
    // sync with SingleItem
    if (current.getAttribute('data-item-id')) {
      return current.getAttribute('data-item-id');
    }
    current = current.parentElement;
  }
  return null;
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
  const ctxData = bindContextMenu(popupState);

  const [event, setEvent] = useState<{
    e: React.MouseEvent<HTMLElement>;
    // todo!: change cid to full song info
    cid: string;
  } | null>(null);

  // todo!: optimize this, it will trigger when ctx menu close
  const onContextMenu = (e: React.MouseEvent<HTMLElement>) => {
    const cid = findItemId(e);
    if (cid) {
      setEvent({ e, cid });
      ctxData.onContextMenu(e);
    }
  };

  return list.length ? (
    <>
      <Scrollbar
        {...ctxData}
        onContextMenu={onContextMenu}
        marginBarHeightLimit={1.2}
        VirtuosoOptions={{
          className: 'scrollbar__hidden',
          VirtuosoProps: {
            totalCount: list.length,
            itemContent: (idx) => (
              <SingleItem
                data-item-id={list[idx].cid}
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
      {ContextMenu && (
        <BlackMenu
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
          <ContextMenu popupState={popupState} event={event} />
        </BlackMenu>
      )}
    </>
  ) : (
    <EmptyTips />
  );
};

export default RightDetailsBottomList;
