import { FunctionComponent, HTMLAttributes } from "react";
import '@/assets/fonts/menu/iconfont.css'
import SingleOptionItem from "./SingleOptionItem";

interface SidebarLeftOptionListProps extends HTMLAttributes<HTMLDivElement> {

}

const SidebarLeftOptionList: FunctionComponent<SidebarLeftOptionListProps> = ({ ...props }) => {
  return (
    <div className="h-full flex flex-col justify-between" {...props}>
      <div>
        <SingleOptionItem
          iconClass="icon-24gl-gear4"
          title="基本设置"
        />
        <SingleOptionItem
          iconClass="icon-24gl-musicAlbum"
          title="本地音乐"
        />
        <SingleOptionItem
          iconClass="icon-24gl-download"
          title="下载设置"
        />
        <SingleOptionItem
          iconClass="icon-adobe-lightroom"
          title="桌面歌词"
        />
      </div>
      <div>
        <SingleOptionItem
          iconClass="icon-tool"
          title="高级设置"
        />
        <SingleOptionItem
          iconClass="icon-24gl-infoCircle"
          title="关于"
        />
      </div>
    </div>
  );
}

export default SidebarLeftOptionList;