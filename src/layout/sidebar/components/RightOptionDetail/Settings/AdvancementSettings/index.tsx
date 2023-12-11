import Button from '@/components/Button';
import { FunctionComponent } from 'react';
import SubTitle from '../../components/SubTitle';
import StyledTooltip from '@/components/mui/Tooltip';
import { invoke } from '@tauri-apps/api';
import { useStore } from '@nanostores/react';
import $settingAdvancement, {
  changeAllowContextMenu,
  changeLogStore,
} from '@/store/models/settings/advancement';
import Checkbox from '@/components/Checkbox';
import HoverWhiteBg from '@/components/HoverWhiteBg';

interface AdvancementSettingsProps {}

const AdvancementSettings: FunctionComponent<AdvancementSettingsProps> = () => {
  const { logStore, allowContextMenu } = useStore($settingAdvancement);
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
      <StyledTooltip title='塞壬唱片使用 DvaJs 作为状态管理框架，启用此项后会在控制台打印执行的action'>
        <HoverWhiteBg>
          <Checkbox checked={logStore} onChange={changeLogStore} theme='config'>
            监听塞壬唱片原生Store状态变化
          </Checkbox>
        </HoverWhiteBg>
      </StyledTooltip>
      <SubTitle>右键菜单</SubTitle>
      <HoverWhiteBg>
        <Checkbox
          checked={allowContextMenu}
          onChange={changeAllowContextMenu}
          theme='config'
        >
          允许按下鼠标右键弹出浏览器右键菜单
        </Checkbox>
      </HoverWhiteBg>
    </div>
  );
};

export default AdvancementSettings;
