import { FunctionComponent } from "react";

interface SingleOptionItemProps {
  iconClass: string;
  title: string;
  selected?: boolean;
  onClick?: () => void;
}

const SingleOptionItem: FunctionComponent<SingleOptionItemProps> = ({
  iconClass,
  title,
  selected,
  onClick,
}) => {
  return (
    <div
      onClick={onClick}
      className={`flex flex-col gap-[.2rem] p-1 justify-center items-center cursor-pointer transition-colors hover:bg-black ${
        selected ? "bg-black" : ""
      }`}
    >
      <i className={`iconfont ${iconClass} text-[.56rem]`}></i>
      <span className="text-[.3rem]">{title}</span>
    </div>
  );
};

export default SingleOptionItem;
