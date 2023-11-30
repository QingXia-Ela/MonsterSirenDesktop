import Tag from "@/components/Tag";
import { FunctionComponent } from "react";
import Styles from './index.module.scss'

export interface TagProps {
  content: string
  color?: string
}

interface SingleItemProps {
  name: string
  author?: string
  album?: string
  time?: string
  tags?: TagProps[]
  operation?: any
}

const SingleItem: FunctionComponent<SingleItemProps> = ({ name, author, album, time, tags, operation }) => {
  return (
    <div className={Styles.single_item}>
      <div className="w-[30%] text_nowrap" title={name}>{name}</div>
      <div className="w-[18%] text_nowrap">{author}</div>
      <div className="w-[18%] text_nowrap">{album}</div>
      <div className={Styles.tags}>{tags?.map((v, i) => <Tag key={i} style={{ color: v.color, borderColor: v.color }}>{v.content}</Tag>)}</div>
      <div className="w-[5%] text_nowrap">{time}</div>
      <div className="w-[15%] text_nowrap">{operation}</div>
    </div>
  );
}

export default SingleItem;