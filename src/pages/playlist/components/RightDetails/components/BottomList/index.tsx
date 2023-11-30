import BasicList from "@/components/List/BasicList";
import Scrollbar from "@/components/Scrollbar";
import { FunctionComponent } from "react";
import SingleItem from "./SingleItem";
import SirenStore from "@/store/SirenStore";

interface RightDetailsBottomListProps {

}

const RightDetailsBottomList: FunctionComponent<RightDetailsBottomListProps> = () => {
  const list = SirenStore.getState().player.list
  return (
    // <BasicList />
    <Scrollbar
      marginBarHeightLimit={1.2}
      VirtuosoOptions={
        {
          className: "scrollbar__hidden",
          VirtuosoProps: {
            totalCount: 200,
            itemContent: (idx) => <SingleItem
              key={idx}
              name={list[idx].name}
              author={list[idx].artists.join(",")}
              album={"危机合约"}
              time={"01:14"}
              tags={[
                {
                  content: "塞壬唱片",
                  color: "#eee"
                }
              ]}
            />
          }
        }
      }
    />
  );
}

export default RightDetailsBottomList;