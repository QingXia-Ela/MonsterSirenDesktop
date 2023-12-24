import StyledTooltip from '@/components/mui/Tooltip';
import { FunctionComponent, createRef, useState } from 'react';
import SubTitle from '../../../components/SubTitle';
import Select from '@/components/Select';
import DisabledMark from '@/components/DisabledMark';
import HoverWhiteBg from '@/components/HoverWhiteBg';
import StyledSlider from '@/components/mui/Slider';
import $settingBackground, {
  throttleChangeBackgroundBlur,
  throttleChangeBackgroundOpacity,
} from '@/store/models/settings/background';

interface PageStyleChangeProps {}

const PAGE_OPTION_NAME_MAP = [
  {
    label: '首页',
    value: 'index',
  },
  {
    label: '关于',
    value: 'about',
  },
  {
    label: '音乐',
    value: 'albums',
  },
  {
    label: '动向',
    value: 'info',
  },
  {
    label: '联系我们',
    value: 'contact',
  },
  {
    label: '音乐播放页',
    value: 'music',
  },
  {
    label: '播放列表',
    value: 'playlist',
  },
  {
    label: '下载页',
    value: 'download',
  },
];
const PageStyleChange: FunctionComponent<PageStyleChangeProps> = () => {
  const [currentSelectPage, setCurrentSelectPage] = useState('');
  const [opacity, setOpacity] = useState(0);
  const [blur, setBlur] = useState(0);

  function handleOpacityChange(value: number) {
    setOpacity(value);
    throttleChangeBackgroundOpacity(currentSelectPage, value);
  }

  function handleBlurChange(value: number) {
    setBlur(value);
    throttleChangeBackgroundBlur(currentSelectPage, value);
  }

  function handleSelectChange(value: string) {
    const storeVal = $settingBackground
      .get()
      .backgroundOptions.find((o) => o.pageName === value);
    setOpacity(storeVal?.opacity ?? 0);
    setBlur(storeVal?.blur ?? 0);
    setCurrentSelectPage(value);
  }

  return (
    <>
      <StyledTooltip title='对每个页面设置不同的背景样式以增强背景融入效果，一般不需要手动设置'>
        <SubTitle>单页面背景模糊/透明度设置</SubTitle>
      </StyledTooltip>
      页面选择
      <Select
        placeholder='请选择'
        height='2.5rem'
        options={PAGE_OPTION_NAME_MAP}
        onChange={handleSelectChange}
      />
      <DisabledMark disabled={currentSelectPage.length === 0}>
        <StyledTooltip
          className='!h-fit text-[.3rem]'
          title='背景透明度，建议值在 45 左右'
        >
          <HoverWhiteBg className='flex justify-between items-center'>
            背景透明度 (当前:{opacity})
            <StyledSlider
              value={opacity}
              onChange={(_, v) => handleOpacityChange(v as number)}
              className='w-8 ml-2'
            />
          </HoverWhiteBg>
        </StyledTooltip>
        <StyledTooltip
          className='!h-fit text-[.3rem]'
          title='背景模糊度，建议在有文字需要阅览的页面设置较大的值(10~20)，非文字背景则设置为 0'
        >
          <HoverWhiteBg className='flex justify-between items-center'>
            背景模糊度 (当前:{blur})
            <StyledSlider
              value={blur}
              onChange={(_, v) => handleBlurChange(v as number)}
              className='w-8 ml-2'
            />
          </HoverWhiteBg>
        </StyledTooltip>
      </DisabledMark>
    </>
  );
};

export default PageStyleChange;
