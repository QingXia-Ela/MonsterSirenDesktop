import Button from '@/components/Button';
import { FunctionComponent } from 'react';
import SubTitle from '../../components/SubTitle';
import StyledTooltip from '@/components/mui/Tooltip';
import { invoke } from '@tauri-apps/api';

interface AdvancementSettingsProps {}

const AdvancementSettings: FunctionComponent<AdvancementSettingsProps> = () => {
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
    </div>
  );
};

export default AdvancementSettings;
