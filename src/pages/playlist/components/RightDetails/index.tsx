import { FunctionComponent, useState } from 'react';
import RightDetailsTopInfo from './components/TopInfo';
import RightDetailsMiddleSplit from './components/MiddleSplit';
import RightDetailsBottomList from './components/BottomList';
import { useStore } from '@nanostores/react';
import $PlayListState from '@/store/pages/playlist';
import CtxMenu from './components/ContextMenu';

interface RightDetailsProps {}

const RightDetails: FunctionComponent<RightDetailsProps> = () => {
  const { currentAlbumInfo: info } = useStore($PlayListState);
  const [searchKeyword, setSearchKeyword] = useState<string>('');
  return (
    <div className='flex-1 pl-2 flex flex-col'>
      <RightDetailsTopInfo
        ListInfo={info}
        ImgPath={info.coverUrl ?? '/siren.png'}
      />
      <RightDetailsMiddleSplit onSearch={setSearchKeyword} />
      <div className='flex-1'>
        <RightDetailsBottomList
          ContextMenu={CtxMenu}
          searchKeyword={searchKeyword}
        />
      </div>
    </div>
  );
};

export default RightDetails;
