import Slider from "@mui/material/Slider";
import Styles from './index.module.scss'

const StyledSlider = ({ orientation = "horizontal", ...props }: any) => {
  return <Slider
    valueLabelDisplay="off"
    className={`${Styles.slider} ${Styles[orientation]}`}
    classes={{
      track: Styles.track,
      rail: Styles.rail,
      thumb: Styles.thumb
    }}
    {...props}
  />;
}

export default StyledSlider;