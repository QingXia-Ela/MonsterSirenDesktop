import { FunctionComponent } from "react";
import $settingBasic, { changeAutoPlay } from "@/store/models/settings/basic";
import { useStore } from "@nanostores/react";
import Checkbox from "@/components/Checkbox";
import StyledTooltip from "@/components/mui/Tooltip";

interface BasicSettingsProps {

}

const BasicSettings: FunctionComponent<BasicSettingsProps> = () => {
  const { closeAutoPlay, volume } = useStore($settingBasic);

  return (
    <div className="w-full">
      <StyledTooltip title="当页面首次进行点击时，播放器会自动播放最新的专辑，可以通过这个选项关闭这个行为" followCursor placement="bottom-start" leaveDelay={120000}>
        <div>
          <Checkbox checked={closeAutoPlay} onChange={changeAutoPlay}>
            关闭页面自动播放
          </Checkbox>
        </div>
      </StyledTooltip>
    </div>
  );
}

export default BasicSettings;