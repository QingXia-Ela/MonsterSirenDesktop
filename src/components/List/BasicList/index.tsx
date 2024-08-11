import { FunctionComponent } from 'react';
import Scrollbar from '@/components/Scrollbar';

interface BasicListProps { }

const BasicList: FunctionComponent<BasicListProps> = () => {
  return (
    <div className='w-full'>
      <Scrollbar />
    </div>
  );
};

export default BasicList;
