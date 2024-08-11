import { FunctionComponent } from 'react';
import DownloadedList from './components/DownloadedList';

interface DownloadRightDetailsProps {}

const DownloadRightDetails: FunctionComponent<
  DownloadRightDetailsProps
> = () => {
  return (
    <div className='flex-1 h-full pl-4'>
      <DownloadedList />
    </div>
  );
};

export default DownloadRightDetails;
