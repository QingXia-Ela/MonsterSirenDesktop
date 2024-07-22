import { FunctionComponent, useMemo, useRef } from 'react';
import Styles from './index.module.scss';
import WhiteZebraScrollbars from '@/components/Scrollbar';
import { BottomListType } from '../constant';
import ListLeftBottomDetailItem from './ListItem';

interface ListLeftBottomDetailsProps {
  ListData: Array<{
    title: string;
    namespace: string;
    data: BottomListType;
  }>;
  /**
   * Active id format like this: `namespace:id`
   */
  activeId?: string;
  ScrollbarDegNum?: number;
  onClickItem?: (e: React.MouseEvent, id: string) => void;
  onCtxMenuOnItem?: (e: React.MouseEvent, id: string) => void;
}

function findDOMNode(root: HTMLElement, cb: (dom: HTMLElement) => boolean) {
  let t: HTMLElement | null = root;

  while (t) {
    if (cb(t)) {
      return t;
    }
    t = t.parentElement;
  }
}

const ListLeftBottomDetails: FunctionComponent<ListLeftBottomDetailsProps> = ({
  ListData,
  activeId,
  ScrollbarDegNum,
  onClickItem,
  onCtxMenuOnItem,
}) => {
  const rootDom = useRef<HTMLDivElement | null>();

  const onClick = (e: React.MouseEvent) => {
    if (!onClickItem) return;
    let t: HTMLElement | null = e.target as HTMLElement;

    let target = findDOMNode(t, (dom) => {
      return !!dom.getAttribute('data-id');
    });
    if (target) {
      const albumId = target.getAttribute('data-id');
      if (albumId) {
        onClickItem(e, albumId);
        return;
      }
    }
  };

  const onCtxMenu = (e: React.MouseEvent) => {
    if (!onCtxMenuOnItem) return;
    e.preventDefault();
    let t: HTMLElement | null = e.target as HTMLElement;

    let target = findDOMNode(t, (dom) => {
      return !!dom.getAttribute('data-id');
    });
    if (target) {
      const albumId = target.getAttribute('data-id');
      if (albumId) {
        onCtxMenuOnItem(e, albumId);
        return;
      }
    }
  };

  return (
    <div
      className={Styles.list}
      onClick={onClick}
      onContextMenu={onCtxMenu}
      ref={(v) => (rootDom.current = v)}
    >
      {ListData.length ? (
        <WhiteZebraScrollbars
          marginBarHeightLimit={3.1}
          ScrollbarDegNum={ScrollbarDegNum}
        >
          {/* 待优化伪列表 */}
          {ListData.map(({ data, title, namespace: n }) => (
            <div key={n} className='w-full'>
              <span className='mb-[.1rem] mt-[.2rem] text-[.3rem] block'>
                {title}
              </span>
              {data.map((v) => (
                <ListLeftBottomDetailItem
                  item={v}
                  key={v.id}
                  data-id={v.id}
                  active={activeId === v.id}
                />
              ))}
            </div>
          ))}
        </WhiteZebraScrollbars>
      ) : (
        <div className={Styles.empty}>
          <div className={Styles.text}>啥都没有找到捏~(￣▽￣)~*</div>
        </div>
      )}
    </div>
  );
};

export default ListLeftBottomDetails;
