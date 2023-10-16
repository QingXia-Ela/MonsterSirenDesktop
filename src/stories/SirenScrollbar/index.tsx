import Scrollbar from "@/components/Scrollbar";
import { FunctionComponent } from "react";

interface SirenScrollbarStoryProps {

}

const SirenScrollbarStory: FunctionComponent<SirenScrollbarStoryProps> = () => {
  return (
    <div style={{
      width: 1200,
      height: 500,
      backgroundColor: "#000",
      padding: 20,
    }}>
      <Scrollbar
        marginBarHeightLimit={2}
      >
        <div style={{
          height: 2000,
          color: "#fff",
        }}>test</div>
      </Scrollbar>
    </div>
  );
}

export default SirenScrollbarStory;