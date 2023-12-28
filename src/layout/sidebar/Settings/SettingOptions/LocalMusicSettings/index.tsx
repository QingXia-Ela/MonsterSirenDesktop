import { FunctionComponent, useCallback, useEffect, useState } from 'react';
import SubTitle from '../../components/SubTitle';
import ListWrapper from '@/components/List/ListWrapper';
import ListItem from '@/components/List/ListItem';
import Button from '@/components/Button';
import { invoke } from '@tauri-apps/api';
import { open } from '@tauri-apps/api/dialog';

interface LocalMusicSettingsProps { }

const GET_FOLDERS = "plugin:local|get_folders"
const ADD_FOLDER = "plugin:local|add_folder"

const LocalMusicSettings: FunctionComponent<LocalMusicSettingsProps> = () => {
  const [list, setList] = useState<string[]>([]);

  const updateList = useCallback(() => {
    invoke<string[]>(GET_FOLDERS).then((res) => {
      setList(res)
    })
  }, [])

  useEffect(() => {
    updateList()
  }, [])

  const addFolder = async () => {
    const path = await open({
      directory: true,
      multiple: false,
      title: '选择文件夹',
      filters: [{ name: '文件夹', extensions: ['*'] }],
    })
    await invoke(ADD_FOLDER, {
      path
    })
    updateList()
  }

  return (
    <div className='w-full flex flex-col gap-1 text-[.32rem]'>
      <SubTitle>本地音乐目录</SubTitle>
      可以通过点击列表项进行文件夹移除操作
      <ListWrapper>
        {list.map((item) => (
          <ListItem key={item}>{item}</ListItem>
        ))}
      </ListWrapper>
      <Button className='w-full' onClick={addFolder}>添加文件夹...</Button>
    </div>
  );
};

export default LocalMusicSettings;
