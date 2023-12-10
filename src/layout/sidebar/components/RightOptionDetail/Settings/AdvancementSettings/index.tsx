import Button from '@/components/Button';
import { FunctionComponent } from 'react';
import SubTitle from '../../components/SubTitle';
import StyledTooltip from '@/components/mui/Tooltip';
import { invoke } from '@tauri-apps/api';
import { useStore } from '@nanostores/react';
import $settingAdvancement, {
  changeLogStore,
} from '@/store/models/settings/advancement';
import Checkbox from '@/components/Checkbox';
import HoverWhiteBg from '@/components/HoverWhiteBg';

interface AdvancementSettingsProps {}

const AdvancementSettings: FunctionComponent<AdvancementSettingsProps> = () => {
  const { logStore } = useStore($settingAdvancement);
  return (
    <div className='w-full flex flex-col gap-1'>
      <SubTitle>开发者工具</SubTitle>
      <StyledTooltip title='启动浏览器控制台'>
        <Button
          decorate
          className='w-full'
          onClick={() => invoke('open_devtools')}
        >
          启动开发者工具
        </Button>
      </StyledTooltip>
      <SubTitle>全局状态管理</SubTitle>
      <StyledTooltip title='在控制台打印执行的action'>
        <HoverWhiteBg>
          <Checkbox checked={logStore} onChange={changeLogStore} theme='config'>
            监听塞壬唱片原生Store状态变化
          </Checkbox>
        </HoverWhiteBg>
      </StyledTooltip>
    </div>
  );
};

export default AdvancementSettings;
