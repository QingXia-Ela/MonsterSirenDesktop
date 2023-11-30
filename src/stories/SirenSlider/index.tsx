import Slider from '@/components/mui/Slider';

function SirenSlider({ ...props }) {
  return (
    <div className='w-72 h-48'>
      <Slider {...props} />
    </div>
  );
}

export default SirenSlider;
