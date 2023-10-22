import SirenStore from "@/store/SirenStore";
import { atom } from "nanostores";

const playerState = atom(SirenStore.getState().player)


export default playerState