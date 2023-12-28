import { FunctionComponent, HTMLAttributes } from 'react';
import Styles from './index.module.scss';

interface ListWrapperProps extends HTMLAttributes<HTMLUListElement> {}

const ListWrapper: FunctionComponent<ListWrapperProps> = ({
  children,
  className = '',
  ...props
}) => {
  return (
    <ul className={`${className} ${Styles.list_wrapper} shadow-lg`} {...props}>
      {children}
    </ul>
  );
};

export default ListWrapper;
