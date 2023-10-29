import { RouterCombineProps } from "@/router/types";
import { FunctionComponent } from "react";
import Styles from './index.module.scss'

interface PlayListProps extends RouterCombineProps {

}

const PlayList: FunctionComponent<PlayListProps> = ({ active, ...props }) => {
  return (
    <div className={Styles.playlist} {...props}>test</div>
  );
}

export default PlayList;
