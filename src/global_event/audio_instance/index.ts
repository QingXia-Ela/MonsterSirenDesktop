import { listen } from '@tauri-apps/api/event';

listen('audio_instance:play_and_pause', () => {
  if (!window.siren_audio_instance._ctx) {
    window.siren_audio_instance._ctx = new (window.AudioContext ||
      // @ts-expect-error: webkit audio ctx will use in other browser
      window.webkitAudioContext)();
    window.siren_audio_instance.initCtx();
  }
  window.siren_audio_instance.togglePlay();
});
