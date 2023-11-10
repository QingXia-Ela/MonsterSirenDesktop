import { FunctionComponent, useMemo } from "react";
import Styles from './index.module.scss'
import WhiteZebraScrollbars from "@/components/Scrollbar";
import { BottomListType } from "../constant";
import ListLeftBottomDetailItem from "./ListItem";

interface ListLeftBottomDetailsProps {
  ListData: Array<{
    title: string
    namespace: string
    data: BottomListType
  }>
  activeId?: string
  ScrollbarDegNum?: number
  onClickItem?: (id: string) => void
}

const ListLeftBottomDetails: FunctionComponent<ListLeftBottomDetailsProps> = ({ ListData, activeId, ScrollbarDegNum }) => {
  const [namespace, id] = activeId?.split("/") || []
  const ListDataNodes = useMemo(() => {
    return ListData.map(({ data, title, namespace: n }) => (
      <div key={n} className="w-full">
        <span className="mb-[.08rem] text-[.26rem] block">{title}</span>
        {
          data.map((v) => (
            <ListLeftBottomDetailItem item={v} key={v.id} active={namespace === n && id === v.id} />
          ))
        }
      </div>
    ))
  }, [ListData])

  return (
    <div className={Styles.list}>
      {
        ListData.length ? (
          <WhiteZebraScrollbars marginBarHeightLimit={3.1} ScrollbarDegNum={ScrollbarDegNum}>
            {/* 待优化伪列表 */}
            {ListDataNodes}
          </WhiteZebraScrollbars>
        ) : (
          <div className={Styles.empty}>
            <i className="iconfont icon-empty" style={{
              marginBottom: "1.2500rem",
              fontSize: "3.7500rem"
            }}></i>
            <div className={Styles.text}>啥都没有找到捏~(￣▽￣)~*</div>
          </div>
        )
      }
    </div>
  );
}

export default ListLeftBottomDetails;
