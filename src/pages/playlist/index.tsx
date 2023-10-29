import { RouterCombineProps } from "@/router/types";
import { FunctionComponent } from "react";
import Styles from './index.module.scss'
import LeftList from "./components/LeftList";

interface PlayListProps extends RouterCombineProps {

}

const PlayList: FunctionComponent<PlayListProps> = ({ active, ...props }) => {
  return (
    <div className={Styles.playlist} {...props}>
      <LeftList />
    </div>
  );
}

export default PlayList;
