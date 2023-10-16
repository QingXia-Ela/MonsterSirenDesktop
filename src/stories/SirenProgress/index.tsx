import { FunctionComponent } from "react";
import Progress from "@/components/Progress";

interface SirenProgressStoryProps {
  precentage?: number
}

const SirenProgressStory: FunctionComponent<SirenProgressStoryProps> = ({ precentage }) => {
  return (
    <Progress style={{
      width: 300,
    }} strokeWidth={3} percentage={precentage} />
  );
}

export default SirenProgressStory;
