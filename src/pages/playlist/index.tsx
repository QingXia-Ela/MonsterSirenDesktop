import { RouterCombineProps } from "@/router/types";
import { FunctionComponent, useEffect, useState } from "react";
import Styles from './index.module.scss'
import LeftList from "./components/LeftList";

interface PlayListProps extends RouterCombineProps {

}

const PlayList: FunctionComponent<PlayListProps> = ({ active, ...props }) => {
  // first active always show
  const [cssActive, setcssActive] = useState(true)
  // delay css control show to next tick
  useEffect(() => {
    setcssActive(active)
  }, [active])

  return (
    <div className={`${Styles.playlist} ${cssActive && Styles.playlistShow}`} {...props}>
      <LeftList />
    </div>
  );
}

export default PlayList;

