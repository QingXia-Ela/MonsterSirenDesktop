import Button from '@/components/Button';
import ListItem from '@/components/List/ListItem';
import ListWrapper from '@/components/List/ListWrapper';

function Action() {
  return (
    <div className='flex gap-1'>
      <Button>测试</Button>
      <Button>测试</Button>
    </div>
  );
}

function SirenList() {
  return (
    <ListWrapper className='  text-[16px]'>
      <ListItem className=' bg-red-600'>test</ListItem>
      <ListItem action={<Action />} className=' '>
        test
      </ListItem>
    </ListWrapper>
  );
}

export default SirenList;
