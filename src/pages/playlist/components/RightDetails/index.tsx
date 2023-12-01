import { FunctionComponent } from 'react';
import EmptyTips from './components/EmptyTips';
import RightDetailsTopInfo from './components/TopInfo';
import RightDetailsMiddleSplit from './components/MiddleSplit';
import RightDetailsBottomList from './components/BottomList';

interface RightDetailsProps {}

const RightDetails: FunctionComponent<RightDetailsProps> = () => {
  return (
    <div className='flex-1 pl-2 flex flex-col'>
      <RightDetailsTopInfo />
      <RightDetailsMiddleSplit />
      <div className='flex-1'>
        <RightDetailsBottomList />
      </div>
    </div>
  );
};

export default RightDetails;
