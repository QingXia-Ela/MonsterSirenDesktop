import { FunctionComponent } from "react";

interface LeftListProps {

}

const LeftList: FunctionComponent<LeftListProps> = () => {
  return (
    <div className="w-20">
      <div className="text-[.6em] font-bold mb-2">播放列表</div>
    </div>
  );
}

export default LeftList;