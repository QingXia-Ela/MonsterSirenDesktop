import Scrollbar from '@/components/Scrollbar';
import { FunctionComponent, useState } from 'react';
import SingleItem from './SingleItem';
import { useStore } from '@nanostores/react';
import $PlayListState from '@/store/pages/playlist';
import EmptyTips from '../EmptyTips';
import BlackMenu from '@/components/ContextMenu/BlackMenuV2';
import { useMenuState } from '@szhsin/react-menu';
import RetryTips from '../RetryTips';
import PendingTips from '../PendingTips';
import useInjectorMetadata, {
  InjectorMetadata,
} from '@/hooks/useInjectorMetadata';
import { SirenStoreState } from '@/types/SirenStore';

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
    },
  };

  return {
    event,
    contextProps,
    menuProps: {
      ...menuProps,
      anchorPoint,
      onClose: () => toggleMenu(false),
    },
    operation: {
      close: () => toggleMenu(false),
    },
  };
};

function parseU64Duration2Time(duration: number) {
  const minute = Math.floor(duration / 60000);
  const second = Math.floor((duration % 60000) / 1000);
  return `${minute < 10 ? '0' + minute : minute}:${
    second < 10 ? '0' + second : second
  }`;
}

function getTagsBySong(
  song: SirenStoreState['player']['list'][0],
  data: InjectorMetadata[],
) {
  return data
    .filter((item) => {
      return (
        /** see #[brief_song::custom_data("sourceNamespace")] */ song.customData
          ?.sourceNamespace === item.namespace ??
        song.cid.includes(`${item.namespace}:`)
      );
    })
    .map((data) => {
      return {
        content: data.cnNamespace,
        color: data.color,
      };
    });
}

const RightDetailsBottomList: FunctionComponent<
  RightDetailsBottomListProps
> = ({ ContextMenu }) => {
  const {
    currentAlbumData: list,
    currentAlbumInfo: info,
    status,
  } = useStore($PlayListState);
  const { event, contextProps, menuProps, operation } = useControlledMenu({
    transition: true,
  });

  const { data: injectorData } = useInjectorMetadata();

  if (status === 'error') {
    return <RetryTips />;
  } else if (status === 'pending') {
    return <PendingTips />;
  }

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
                time={
                  list[idx].duration
                    ? parseU64Duration2Time(list[idx].duration!)
                    : ''
                }
                tags={getTagsBySong(list[idx], injectorData)}
              />
            ),
          },
        }}
      />
      {ContextMenu && (
        <BlackMenu {...menuProps} theming='dark'>
          <ContextMenu popupState={operation} event={event} />
        </BlackMenu>
      )}
    </>
  ) : (
    <EmptyTips />
  );
};

export default RightDetailsBottomList;
