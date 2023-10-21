import Split from "@/components/Split";
import { FunctionComponent, PropsWithChildren } from "react";

interface SingleFullSettingsLayoutProps extends PropsWithChildren {
  title?: string;
}

const SingleFullSettingsLayout: FunctionComponent<
  SingleFullSettingsLayoutProps
> = ({ title, children }) => {
  return (
    <div className="w-full flex flex-col text-[.8rem]">
      <div className="mb-1 text-[.48rem]">{title || "设置"}</div>
      <Split className="mb-2" />
      {children}
    </div>
  );
};

export default SingleFullSettingsLayout;
