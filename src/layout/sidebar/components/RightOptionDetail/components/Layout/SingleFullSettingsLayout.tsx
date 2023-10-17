import { FunctionComponent, PropsWithChildren } from "react";

interface SingleFullSettingsLayoutProps extends PropsWithChildren {
  title?: string
}

const SingleFullSettingsLayout: FunctionComponent<SingleFullSettingsLayoutProps> = ({ title, children }) => {
  return (
    <div className="w-full">
      <div className="mb-2 text-[.6rem]">{title || "设置"}</div>
      {children}
    </div>
  );
}

export default SingleFullSettingsLayout;