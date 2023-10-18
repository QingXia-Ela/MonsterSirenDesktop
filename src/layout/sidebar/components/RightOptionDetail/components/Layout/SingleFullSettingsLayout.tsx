import Split from "@/components/Split";
import { FunctionComponent, PropsWithChildren } from "react";

interface SingleFullSettingsLayoutProps extends PropsWithChildren {
  title?: string;
}

const SingleFullSettingsLayout: FunctionComponent<
  SingleFullSettingsLayoutProps
> = ({ title, children }) => {
  return (
    <div className="w-full flex flex-col">
      <div className="mb-1 text-[.48rem]">{title || "设置"}</div>
      <span className="mb-2 text-[.3rem] font-['SourceHanSansCN-Bold']">
        所有选项都将在下次重新启动时生效
      </span>
      <Split className="mb-2" />
      {children}
    </div>
  );
};

export default SingleFullSettingsLayout;
