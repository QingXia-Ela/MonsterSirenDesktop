import { FunctionComponent } from 'react';
import EmptyTips from './components/EmptyTips';
import RightDetailsTopInfo from './components/TopInfo';
import RightDetailsMiddleSplit from './components/MiddleSplit';
import RightDetailsBottomList from './components/BottomList';
import { useStore } from '@nanostores/react';
import $PlayListState from '@/store/pages/playlist';

interface RightDetailsProps {}

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
        <RightDetailsBottomList />
      </div>
    </div>
  );
};

export default RightDetails;
