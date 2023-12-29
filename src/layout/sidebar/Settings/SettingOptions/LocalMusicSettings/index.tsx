import { FunctionComponent, useCallback, useEffect, useState } from 'react';
import SubTitle from '../../components/SubTitle';
import ListWrapper from '@/components/List/ListWrapper';
import ListItem from '@/components/List/ListItem';
import Button from '@/components/Button';
import { invoke } from '@tauri-apps/api';
import { open } from '@tauri-apps/api/dialog';
import Dialog from '@/components/Dialog';

interface LocalMusicSettingsProps { }

const GET_FOLDERS = 'plugin:local|get_folders';
const ADD_FOLDER = 'plugin:local|add_folder';
const REMOVE_FOLDER = 'plugin:local|remove_folder';

const LocalMusicSettings: FunctionComponent<LocalMusicSettingsProps> = () => {
  const [list, setList] = useState<string[]>([]);
  const [path, setPath] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);

  const updateList = useCallback(() => {
    invoke<string[]>(GET_FOLDERS).then((res) => {
      setList(res);
    });
  }, []);

  useEffect(() => {
    updateList();
  }, []);

  const addFolder = async () => {
    const path = await open({
      directory: true,
      multiple: false,
      title: '选择文件夹',
      filters: [{ name: '文件夹', extensions: ['*'] }],
    });
    await invoke(ADD_FOLDER, {
      path,
    });
    // todo!: refresh vanilla albumlist for music page.
    updateList();
  };

  const removeFolder = async (path: string) => {
    await invoke(REMOVE_FOLDER, {
      path,
    });
    updateList();
    setDialogOpen(false);
  };

  const handleRemoveFolder = (path: string) => {
    setDialogOpen(true);
    setPath(path);
  };

  return (
    <div className='w-full flex flex-col gap-1 text-[.32rem]'>
      <SubTitle>本地音乐目录</SubTitle>
      可以通过点击列表项进行文件夹移除操作
      <br />
      <br />
      每次启动软件时会主动扫描一次文件夹下所有音乐以保持同步
      <ListWrapper>
        {list.map((item) => (
          <ListItem onClick={() => handleRemoveFolder(item)} key={item}>
            {item}
          </ListItem>
        ))}
      </ListWrapper>
      <Button className='w-full' onClick={addFolder}>
        添加文件夹...
      </Button>
      <Dialog
        open={dialogOpen}
        title='移除文件夹'
        onClose={() => setDialogOpen(false)}
      >
        <div className='flex flex-col gap-1'>
          <div className='text-center text-white text-[.34rem]'>
            确认移除文件夹 {path} 吗
          </div>
          <div className='flex justify-end gap-2 mt-1'>
            <Button size='small' onClick={() => setDialogOpen(false)}>
              取消
            </Button>
            <Button size='small' onClick={() => removeFolder(path)}>
              确认
            </Button>
          </div>
        </div>
      </Dialog>
    </div>
  );
};

export default LocalMusicSettings;
