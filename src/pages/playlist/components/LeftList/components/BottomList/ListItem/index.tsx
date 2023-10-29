import NormalListItem from "@/components/NormalListItem";
import { FunctionComponent } from "react";
import { BottomListIconItemType, BottomListImgItemType, SingleBottomListItemType } from "../../constant";
import Styles from './index.module.scss'

interface ListLeftBottomDetailItemProps extends React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  item: SingleBottomListItemType
}


const getInnerContent = (i: SingleBottomListItemType) => {
  // @ts-expect-error: empty type will get default val
  switch (i.type) {
    case "img":
      return <img className={Styles.img} src={(i as BottomListImgItemType).src} referrerPolicy="no-referrer" loading="lazy" />

    case "icon":
      return <i className={`${Styles.img} ${(i as BottomListIconItemType).iconClass}`} />

    default:
      break;
  }
  return <></>
}

const getDescriptionStyle = (t: SingleBottomListItemType) => {
  // @ts-expect-error: empty type will get default val
  switch (t.type) {
    case "img":
      return Styles.img
    case "icon":
      return Styles.icon
  }
}

const ListLeftBottomDetailItem: FunctionComponent<ListLeftBottomDetailItemProps> = ({ item, ...p }) => {
  return (
    <NormalListItem {...p} className={Styles.list_item} selected={item.selected} SmallScaleNum={0.97}>
      {getInnerContent(item)}
      <div className={`${Styles.item_description} ${getDescriptionStyle(item)}`}>
        <div className={`${Styles.title} text_nowrap`} title={item.title}>{item.title}</div>
        <div className={`${Styles.description} text_nowrap`}>{item.subTitle}</div>
      </div>
    </NormalListItem>
  );
}

export default ListLeftBottomDetailItem;
