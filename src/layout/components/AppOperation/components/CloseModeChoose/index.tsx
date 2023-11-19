import Checkbox from "@/components/Checkbox";
import Dialog from "@/components/Dialog";
import { CONFIG_TYPE } from "@/store/models/settings/types";
import { FunctionComponent, useState } from "react";

type OptionType = CONFIG_TYPE["basic"]["closeMode"]

interface CloseModeChooseProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const Chooses: Array<{
  title: string;
  value: OptionType
}> = [
    {
      title: "最小化到菜单",
      value: "minimize"
    },
    {
      title: "直接退出",
      value: "close"
    }
  ]

const CheckboxList = () => {
  const [type, setType] = useState<OptionType>("minimize")
  return (
    <>
      {Chooses.map(({ title, value }) => (
        <Checkbox key={value} checked={type === value} onChange={() => setType(value)}>{title}</Checkbox>
      ))}
    </>
  )
}

const CloseModeChoose: FunctionComponent<CloseModeChooseProps> = ({
  open,
  setOpen
}) => {
  return (
    <Dialog open={open} onClose={() => setOpen(false)} title="选择关闭模式">
      <div className="flex flex-col gap-1 mb-1">
        <CheckboxList />
      </div>
      <div className="flex justify-end">
        <Checkbox theme="config">记住我的选择</Checkbox>
      </div>
    </Dialog>
  );
}

export default CloseModeChoose;