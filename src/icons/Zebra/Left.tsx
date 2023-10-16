import { FunctionComponent } from "react";
import Styles from './index.module.scss'

interface ZebraLeftProps {

}

const ZebraLeft: FunctionComponent<ZebraLeftProps> = () => {
  return (
    <i className={`${Styles.icon} ${Styles.slashLeft}`}><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 37 7"><path fillRule="evenodd" fill="rgb(100, 101, 104)" d="M34.703,6.692 L30.703,0.692 L32.703,0.692 L36.703,6.692 L34.703,6.692 ZM29.703,6.692 L25.703,0.692 L27.703,0.692 L31.703,6.692 L29.703,6.692 ZM24.703,6.692 L20.703,0.692 L22.703,0.692 L26.703,6.692 L24.703,6.692 ZM19.703,6.692 L15.703,0.692 L17.703,0.692 L21.703,6.692 L19.703,6.692 ZM14.703,6.692 L10.703,0.692 L12.703,0.692 L16.703,6.692 L14.703,6.692 ZM9.703,6.692 L5.703,0.692 L7.703,0.692 L11.703,6.692 L9.703,6.692 ZM4.703,6.692 L0.703,0.692 L2.703,0.692 L6.703,6.692 L4.703,6.692 Z"></path></svg></i>
  );
}

export default ZebraLeft;
