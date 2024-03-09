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
  onClickItem?: (id: string) => void;
}

const ListLeftBottomDetails: FunctionComponent<ListLeftBottomDetailsProps> = ({
  ListData,
  activeId,
  ScrollbarDegNum,
  onClickItem,
}) => {
  const rootDom = useRef<HTMLDivElement | null>();

  const onClick = (e: React.MouseEvent) => {
    let t: HTMLElement | null = e.target as HTMLElement;

    while (t && t != rootDom.current) {
      const albumId = t.getAttribute('data-id');
      if (albumId) {
        onClickItem?.(albumId);
        return;
      }
      t = t.parentElement;
    }
  };

  return (
    <div
      className={Styles.list}
      onClick={onClick}
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
