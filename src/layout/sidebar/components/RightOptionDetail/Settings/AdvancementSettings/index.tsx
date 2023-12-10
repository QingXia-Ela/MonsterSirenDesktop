import Button from '@/components/Button';
import { FunctionComponent } from 'react';
import SubTitle from '../../components/SubTitle';
import StyledTooltip from '@/components/mui/Tooltip';
import { invoke } from '@tauri-apps/api';
import { useStore } from '@nanostores/react';
import $settingAdvancement, { changeLogStore } from '@/store/models/settings/advancement';
import Checkbox from '@/components/Checkbox';

interface AdvancementSettingsProps { }

const AdvancementSettings: FunctionComponent<AdvancementSettingsProps> = () => {
  const { logStore } = useStore($settingAdvancement)
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
      <Checkbox
        checked={logStore}
        onChange={changeLogStore}
        theme='config'
      >
        监听全局Store状态变化
      </Checkbox>
    </div>
  );
};

export default AdvancementSettings;
