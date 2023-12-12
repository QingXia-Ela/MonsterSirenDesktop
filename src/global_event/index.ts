import { listen } from '@tauri-apps/api/event';

listen('audio_instance:play_and_pause', () => {
  window.siren_audio_instance.togglePlay();
});
