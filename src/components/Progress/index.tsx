import { FunctionComponent } from "react";
import { Progress as TDProgress, ProgressProps as TDProgressProps } from 'tdesign-react'

type ProgressProps = TDProgressProps

const Progress: FunctionComponent<ProgressProps> = ({ ...props }) => {
  return (
    <TDProgress label={false} trackColor="transparent" color="#c6c9ce" {...props} />
  );
}

export default Progress;