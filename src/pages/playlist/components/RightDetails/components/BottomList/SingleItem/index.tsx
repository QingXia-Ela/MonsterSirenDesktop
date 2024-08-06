import Tag from '@/components/Tag';
import { FunctionComponent } from 'react';
import Styles from './index.module.scss';
import FlowText from '@/components/FlowText';

export interface TagProps {
  content: string;
  color?: string;
}

interface SingleItemProps {
  name: string;
  author?: string;
  album?: string;
  time?: string;
  tags?: TagProps[];
  operation?: any;
  [key: string]: any;
  active?: boolean;
}

const SingleItem: FunctionComponent<SingleItemProps> = ({
  name,
  author,
  album,
  time,
  tags,
  operation,
  active,
  ...props
}) => {
  return (
    <div
      {...props}
      className={`${Styles.single_item} ${active && Styles.active}`}
    >
      <div className='w-[40%] text_nowrap pr-1' title={name}>
        <FlowText>{name}</FlowText>
      </div>
      <div className='w-[18%] text_nowrap pr-1'>{author}</div>
      <div className='w-[18%] text_nowrap pr-1'>{album}</div>
      <div className={Styles.tags}>
        {tags?.map((v, i) => (
          <Tag key={i} style={{ color: v.color, borderColor: v.color }}>
            {v.content}
          </Tag>
        ))}
      </div>
      <div className='w-[5%] text_nowrap pr-1'>{time}</div>
      <div className='w-[15%] text_nowrap pr-1'>{operation}</div>
    </div>
  );
};

export default SingleItem;
