import Scrollbar from '@/components/Scrollbar';
import Tag from '@/components/Tag';
import { FunctionComponent } from 'react';
import DownloadingList from './components/DownloadingList';

interface DownloadRightDetailsProps {}

const DownloadRightDetails: FunctionComponent<
  DownloadRightDetailsProps
> = () => {
  return (
    <div className='flex-1 h-full pl-4'>
      <DownloadingList />
    </div>
  );
};

export default DownloadRightDetails;
