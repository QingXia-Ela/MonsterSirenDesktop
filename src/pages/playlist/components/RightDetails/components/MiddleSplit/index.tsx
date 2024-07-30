import RowZebraDivider from '@/components/Split';
import SilverBorderButton from '@/components/SilverBorderButton';
import { FunctionComponent, memo, useEffect, useState } from 'react';
import Styles from './index.module.scss';
import NavSearch from '@/components/Input';
import { useStore } from '@nanostores/react';
import $PlayListState from '@/store/pages/playlist';
import SirenStore from '@/store/SirenStore';

interface RightDetailsMiddleSplitProps {
  onSearch?: (keyword: string) => void;
}

const RightDetailsMiddleSplit: FunctionComponent<
  RightDetailsMiddleSplitProps
> = ({ onSearch }) => {
  const [searchValue, setSearchValue] = useState('');
  const store = useStore($PlayListState);

  useEffect(() => {
    setSearchValue('');
  }, [store.currentAlbumId]);

  useEffect(() => {
    let timer = setTimeout(() => {
      onSearch?.(searchValue);
    }, 500);

    return () => {
      clearTimeout(timer);
    };
  }, [searchValue]);

  const play = () => {
    SirenStore.dispatch({
      type: 'musicPlay/toAlbum',
      cid: store.currentAlbumInfo.cid!,
    });
  };
  return (
    <div className={Styles.middle_control}>
      <SilverBorderButton className={Styles.button} onClick={play}>
        {/* todo!: move these static node to another component */}
        <i className={Styles.icon}>
          <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 -5 28 35'>
            <line
              x1='3'
              y1='5'
              x2='3'
              y2='19'
              strokeLinecap='round'
              strokeWidth='4'
              stroke='#fff'
              fill='none'
            ></line>
            <line
              x1='10.3'
              y1='2'
              x2='10.3'
              y2='16'
              strokeLinecap='round'
              strokeWidth='4'
              stroke='#fff'
              fill='none'
            ></line>
            <line
              x1='17.6'
              y1='9'
              x2='17.6'
              y2='23'
              strokeLinecap='round'
              strokeWidth='4'
              stroke='#fff'
              fill='none'
            ></line>
            <line
              x1='25'
              y1='5'
              x2='25'
              y2='19'
              strokeLinecap='round'
              strokeWidth='4'
              stroke='#fff'
              fill='none'
            ></line>
          </svg>
        </i>
        <span className={Styles.text}>PLAY</span>
      </SilverBorderButton>
      <div className={Styles.divider}>
        <RowZebraDivider />
      </div>
      <NavSearch
        value={searchValue}
        onChange={(e) => setSearchValue(e.target.value)}
        placeholder='搜索歌单歌曲...'
        className={`${Styles.search} w-20 h-3`}
      />
    </div>
  );
};

export default memo(RightDetailsMiddleSplit);
