import { FunctionComponent } from "react";
import $settingBasic, { changeAutoPlay } from "@/store/models/settings/basic";
import { useStore } from "@nanostores/react";
import Checkbox from "@/components/Checkbox";
import StyledTooltip from "@/components/mui/Tooltip";
import HoverWhiteBg from "@/components/HoverWhiteBg";
import SubTitle from "../../components/SubTitle";

interface BasicSettingsProps { }

const BasicSettings: FunctionComponent<BasicSettingsProps> = () => {
  const { closeAutoPlay } = useStore($settingBasic);

  return (
    <div className="w-full flex flex-col gap-1">
      <SubTitle>基本</SubTitle>
      <StyledTooltip
        title="当页面首次进行点击时，播放器会自动播放最新的专辑，可以通过这个选项关闭这个行为"
      >
        <HoverWhiteBg>
          <Checkbox
            checked={closeAutoPlay}
            onChange={changeAutoPlay}
            theme="config"
          >
            关闭页面自动播放
          </Checkbox>
        </HoverWhiteBg>
      </StyledTooltip>
    </div>
  );
};

export default BasicSettings;
