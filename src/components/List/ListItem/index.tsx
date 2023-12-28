import { FunctionComponent, HTMLAttributes } from 'react';

interface ListItemProps extends HTMLAttributes<HTMLLIElement> {
  action?: React.ReactNode;
}

const ListItem: FunctionComponent<ListItemProps> = ({
  children,
  className = '',
  action,
  ...props
}) => {
  return (
    <li
      className={`${className} w-full px-2 py-1 flex justify-between items-center
      transition-[background-color] bg-opacity-0 hover:bg-opacity-5 bg-white`}
      {...props}
    >
      <div className='flex-1'>{children}</div>
      <div className='h-full'>{action}</div>
    </li>
  );
};

export default ListItem;
