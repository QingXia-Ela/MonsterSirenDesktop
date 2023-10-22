import { FunctionComponent } from "react";
import SirenLogoBg from "@/icons/SirenLogoBg";
import Styles from './index.module.scss'

interface PlayListHeaderProps {

}

const PlayListHeader: FunctionComponent<PlayListHeaderProps> = () => {
  return (
    <div className={Styles.header}>
      <div className="flex justify-center items-center w-full h-full text-[.4rem]">
        播放列表
      </div>
      <div className="absolute w-full top-0 -z-10">
        <SirenLogoBg svgHeight="1rem" />
      </div>
    </div>
  );
}

export default PlayListHeader;
