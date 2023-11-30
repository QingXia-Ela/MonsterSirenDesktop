import { FunctionComponent } from 'react';
import EmptyTips from './components/EmptyTips';
import RightDetailsTopInfo from './components/TopInfo';
import RightDetailsMiddleSplit from './components/MiddleSplit';

interface RightDetailsProps {}

const RightDetails: FunctionComponent<RightDetailsProps> = () => {
  return (
    <div className='flex-1 pl-2'>
      <RightDetailsTopInfo />
      <RightDetailsMiddleSplit />
    </div>
  );
};

export default RightDetails;
