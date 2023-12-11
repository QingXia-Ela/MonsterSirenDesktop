import Button from '@/components/Button';
import Checkbox from '@/components/Checkbox';
import Dialog from '@/components/Dialog';
import $settingBasic, {
  CloseModeChooses,
  changeCloseMode,
} from '@/store/models/settings/basic';
import { CONFIG_TYPE } from '@/store/models/settings/types';
import { useStore } from '@nanostores/react';
import { appWindow } from '@tauri-apps/api/window';
import { FunctionComponent, useEffect, useState } from 'react';

type OptionType = CONFIG_TYPE['basic']['closeMode'];

interface CloseModeChooseProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const CheckboxList = ({
  type,
  setType,
}: {
  type: OptionType;
  setType: (type: OptionType) => void;
}) => {
  return (
    <>
      {CloseModeChooses.map(
        ({ title, value }) =>
          value != '' && (
            <Checkbox
              key={value}
              checked={type === value}
              onChange={() => setType(value)}
            >
              {title}
            </Checkbox>
          ),
      )}
    </>
  );
};

const CloseModeChoose: FunctionComponent<CloseModeChooseProps> = ({
  open,
  setOpen,
}) => {
  const { closeMode } = useStore($settingBasic);
  const [remember, setRemember] = useState(!!closeMode);
  const [type, setType] = useState<OptionType>(
    closeMode?.length ? closeMode : 'tray',
  );

  useEffect(() => {
    changeCloseMode(remember ? type : '');
  }, [remember, type]);

  const handleClose = (type: OptionType) => {
    switch (type) {
      case 'minimize':
        appWindow.minimize();
        break;
      case 'tray':
        appWindow.hide();
        break;
      default:
        appWindow.close();
        break;
    }
    setOpen(false);
  };

  return (
    <Dialog open={open} onClose={() => setOpen(false)} title='选择关闭模式'>
      <div className='flex flex-col gap-1'>
        <div className='flex flex-col gap-1 mb-1'>
          <CheckboxList type={type} setType={setType} />
        </div>
        <div className='flex justify-end mb-1'>
          <Checkbox
            theme='config'
            checked={remember}
            onChange={() => setRemember(!remember)}
          >
            记住我的选择
          </Checkbox>
        </div>
        <div className='flex justify-end gap-2'>
          <Button size='small' onClick={() => setOpen(false)}>
            取消
          </Button>
          <Button size='small' onClick={() => handleClose(type)}>
            确认
          </Button>
        </div>
      </div>
    </Dialog>
  );
};

export default CloseModeChoose;
