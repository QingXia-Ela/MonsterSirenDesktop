import SirenStore from "@/store/SirenStore";
import { invoke } from "@tauri-apps/api/tauri";

let currentSongId: string

SirenStore.subscribe(() => {
  const current = SirenStore.getState().player.songDetail

  if (current.cid !== currentSongId) {
    currentSongId = current.cid
    invoke('change_tray_tooltip', {
      tooltip: `正在播放: ${current.name} - ${current.artists.join(' / ')}`
    })
  }
})