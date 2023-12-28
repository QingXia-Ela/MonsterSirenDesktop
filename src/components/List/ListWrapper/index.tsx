import { FunctionComponent, HTMLAttributes } from 'react';

interface ListWrapperProps extends HTMLAttributes<HTMLUListElement> { }

const ListWrapper: FunctionComponent<ListWrapperProps> = ({
  children,
  className = '',
  ...props
}) => {
  return (
    <ul
      className={`${className} w-full flex flex-col shadow-lg shadow-gray-800`}
      {...props}
    >
      {children}
    </ul>
  );
};

export default ListWrapper;
