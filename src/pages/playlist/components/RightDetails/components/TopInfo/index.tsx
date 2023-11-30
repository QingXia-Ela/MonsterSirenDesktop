import { FunctionComponent } from 'react';
import Styles from './index.module.scss';
interface RightDetailsTopInfoProps {
  ImgPath?: string;
  ListInfo?: {
    name: string;
    author?: string[];
    intro?: string;
  };
}

const EmptyListInfo = {
  name: '主播U的专享占位符',
  author: ['塞壬唱片-MSR'],
  intro:
    '没给主播U点关注的XDM点点关注家人们\n什么？为什么要点关注？我也不知道\n总之就是点点关注',
};

const RightDetailsTopInfo: FunctionComponent<RightDetailsTopInfoProps> = ({
  ImgPath = '/UAlbum.jpg',
  ListInfo = EmptyListInfo,
}) => {
  return (
    <div className={Styles.top_info}>
      <div className={Styles.left_img_wrapper}>
        <img className={Styles.left_img} src={ImgPath} />
      </div>
      <div className={Styles.right_info}>
        <div className={Styles.title}>{ListInfo.name}</div>
        <div className={Styles.author}>{ListInfo.author}</div>
        <div className={`${Styles.intro} hide_scrollbar`}>
          {ListInfo.intro?.split('\n').map((s) => (
            <p className={Styles.block} key={s}>
              {s}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RightDetailsTopInfo;
