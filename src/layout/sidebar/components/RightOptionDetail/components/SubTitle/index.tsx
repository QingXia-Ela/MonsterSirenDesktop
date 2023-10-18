import { FunctionComponent, PropsWithChildren } from "react";

interface SubTitleProps extends PropsWithChildren {

}

const SubTitle: FunctionComponent<SubTitleProps> = ({ children }) => {
  return (
    <span className="block text-[.34rem] font-['SourceHanSansCN-Bold']">{children}</span>
  );
}

export default SubTitle;