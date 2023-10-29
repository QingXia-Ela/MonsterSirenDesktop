import { FunctionComponent } from "react";
import ListLeftBottomDetails from "./components/BottomList";

interface LeftListProps {

}

const LeftList: FunctionComponent<LeftListProps> = () => {
  return (
    <div className="w-20 flex flex-col">
      <div className="text-[.6em] font-bold">播放列表</div>
      <ListLeftBottomDetails
        ListData={Array.from({ length: 100 }).map((v, i) => ({
          type: "icon",
          iconClass: "iconfont icon-24gl-musicAlbum",
          id: i.toString(),
          title: "新建播放器列表",
          subTitle: "共114首歌曲",
        }))} />
    </div>
  );
}

export default LeftList;