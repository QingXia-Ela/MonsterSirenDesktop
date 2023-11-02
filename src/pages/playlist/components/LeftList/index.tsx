import { FunctionComponent } from "react";
import ListLeftBottomDetails from "./components/BottomList";

interface LeftListProps {

}

const LeftList: FunctionComponent<LeftListProps> = () => {
  return (
    <div className="w-20 flex flex-col">
      <div className="text-[.6em] font-bold">播放列表</div>
      <ListLeftBottomDetails
        ListData={[
          {
            title: "测试",
            data: Array.from({ length: 10 }).map((v, i) => ({
              type: "icon",
              iconClass: "iconfont icon-24gl-musicAlbum",
              id: i.toString(),
              title: "新建播放器列表_我也不知道这是啥",
              subTitle: "共114首歌曲",
            }))
          }
        ]} />
    </div>
  );
}

export default LeftList;