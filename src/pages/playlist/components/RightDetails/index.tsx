import { FunctionComponent } from 'react';
import RightDetailsTopInfo from './components/TopInfo';
import RightDetailsMiddleSplit from './components/MiddleSplit';
import RightDetailsBottomList from './components/BottomList';
import { useStore } from '@nanostores/react';
import $PlayListState from '@/store/pages/playlist';
import { usePopupState } from 'material-ui-popup-state/hooks';
import BlackMenuItem from '@/components/ContextMenu/BlackMenu/BlackMenuItem';
import Divider from '@mui/material/Divider';

interface RightDetailsProps { }

const MyDivider: FunctionComponent<{ children?: string }> = ({ children = "" }) => <Divider
  sx={{
    borderColor: "#ffffff88",
    width: "80%",
    margin: "0.1250rem auto",
    fontSize: "0.1875rem",
    "&::before, &::after": {
      borderColor: "#ffffff88",
    }
  }}>{children}</Divider>

function CtxMenu({
  popupState
}: {
  popupState: ReturnType<typeof usePopupState>
}) {
  const handleClose = () => popupState.close();
  return <>
    <BlackMenuItem onClick={handleClose}>播放</BlackMenuItem>
    <BlackMenuItem onClick={handleClose}>下一首播放</BlackMenuItem>
    <BlackMenuItem onClick={handleClose}>添加到播放列表</BlackMenuItem>
    <MyDivider />
    <BlackMenuItem onClick={handleClose}>显示专辑</BlackMenuItem>
    <BlackMenuItem onClick={handleClose}>删除</BlackMenuItem>
    <MyDivider />
    <BlackMenuItem onClick={handleClose}>显示信息</BlackMenuItem>
    <BlackMenuItem onClick={handleClose}>编辑信息</BlackMenuItem>
    <MyDivider />
    <BlackMenuItem onClick={handleClose}>下载歌曲</BlackMenuItem>
  </>
}

const RightDetails: FunctionComponent<RightDetailsProps> = () => {
  const { currentAlbumInfo: info } = useStore($PlayListState);
  return (
    <div className='flex-1 pl-2 flex flex-col'>
      <RightDetailsTopInfo
        ListInfo={info}
        ImgPath={info.coverUrl ?? '/siren.png'}
      />
      <RightDetailsMiddleSplit />
      <div className='flex-1'>
        <RightDetailsBottomList ContextMenu={CtxMenu} />
      </div>
    </div>
  );
};

export default RightDetails;
