/**
 * @QingXia-Ela
 * 
 * This init is use for update vanilla songs in redux store
 */

import SirenStore from "@/store/SirenStore";

SirenStore.dispatch({
  type: "player/getPlayList"
})