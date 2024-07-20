import Scrollbar from '@/components/Scrollbar';
import { FunctionComponent, useState } from 'react';
import SingleItem from './SingleItem';
import { useStore } from '@nanostores/react';
import $PlayListState from '@/store/pages/playlist';
import EmptyTips from '../EmptyTips';
import BlackMenu from '@/components/ContextMenu/BlackMenuV2';
import { useMenuState } from '@szhsin/react-menu'

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

const useControlledMenu = (options: any) => {
  const [anchorPoint, setAnchorPoint] = useState<any>();
  const [menuProps, toggleMenu] = useMenuState(options);
  const [event, setEvent] = useState<{
    e: React.MouseEvent<HTMLElement>;
    // todo!: change cid to full song info
    cid: string;
  } | null>(null);

  const contextProps = {
    onContextMenu: (e: any) => {
      e.preventDefault();
      setAnchorPoint({ x: e.clientX, y: e.clientY });
      toggleMenu(true);

      let cid = findItemId(e);
      if (cid) {
        setEvent({ e, cid });
      }
    }
  };

  return {
    event,
    contextProps,
    menuProps: {
      ...menuProps,
      anchorPoint,
      onClose: () => toggleMenu(false)
    },
    operation: {
      close: () => toggleMenu(false)
    }
  };
};

const RightDetailsBottomList: FunctionComponent<
  RightDetailsBottomListProps
> = ({ ContextMenu }) => {
  const { currentAlbumData: list, currentAlbumInfo: info } =
    useStore($PlayListState);
  const { event, contextProps, menuProps, operation } = useControlledMenu({
    transition: true
  })

  return list.length ? (
    <>
      <Scrollbar
        {...contextProps}
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
          {...menuProps}
          theming='dark'
        >
          <ContextMenu popupState={operation} event={event} />
        </BlackMenu>
      )}
    </>
  ) : (
    <EmptyTips />
  );
};

export default RightDetailsBottomList;
