import { FunctionComponent } from 'react';
import $settingBasic, {
  CloseModeChooses,
  PlaylistModeChooses,
  changeAutoPlay,
  changeCloseMode,
  changeShowListMode,
} from '@/store/models/settings/basic';
import { useStore } from '@nanostores/react';
import Checkbox from '@/components/Checkbox';
import StyledTooltip from '@/components/mui/Tooltip';
import HoverWhiteBg from '@/components/HoverWhiteBg';
import SubTitle from '../../components/SubTitle';
import Select from '@/components/Select';

interface BasicSettingsProps { }

const SELECT_OPTIONS = CloseModeChooses.map(({ title, value }) => ({
  value,
  label: title,
}));

const PLAYLIST_OPTIONS = PlaylistModeChooses.map(({ title, value }) => ({
  value,
  label: title,
}));

const BasicSettings: FunctionComponent<BasicSettingsProps> = () => {
  const { closeAutoPlay, closeMode } = useStore($settingBasic);

  return (
    <div className='w-full flex flex-col gap-1'>
      <SubTitle>基本</SubTitle>
      <StyledTooltip title='当页面首次进行点击时，播放器会自动播放最新的专辑，可以通过这个选项关闭这个行为'>
        <HoverWhiteBg>
          <Checkbox
            checked={closeAutoPlay}
            onChange={changeAutoPlay}
            theme='config'
          >
            关闭页面自动播放
          </Checkbox>
        </HoverWhiteBg>
      </StyledTooltip>
      <StyledTooltip title='在播放列表页面中由于塞壬唱片的专辑数量过多，导致侧边专辑列表长度过长，影响体验，可以通过本设置进行修改'>
        <SubTitle className='my-1'>塞壬唱片播放列表信息细节</SubTitle>
      </StyledTooltip>
      <Select
        // TODO!: optimize it to auto generate, don't know why it can't auto generate when value is ""
        placeholder='将所有专辑打平为一个音乐列表'
        value={closeMode}
        height='2.5rem'
        options={PLAYLIST_OPTIONS}
        onChange={(v) => changeShowListMode(v)}
      />
      <SubTitle className='my-1'>关闭行为调整</SubTitle>
      <Select
        // TODO!: optimize it to auto generate, don't know why it can't auto generate when value is ""
        placeholder='每次关闭时询问'
        value={closeMode}
        height='2.5rem'
        options={SELECT_OPTIONS}
        onChange={(v) => changeCloseMode(v)}
      />
    </div>
  );
};

export default BasicSettings;
