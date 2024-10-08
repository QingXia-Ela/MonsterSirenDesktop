/// <reference types="vite/client" />
/// <reference types="@monster-siren-desktop/types/bindings/invoke" />

declare module globalThis {
  import { NotifyMessageProps } from './global_event/frontend_notify/channel';
  import Channel from './tools/channel';
  import type { SirenRouter } from './types/SirenRouter';
  import type { SirenStore } from './types/SirenStore';

  const inject_notify: Channel<NotifyMessageProps>;
  // todo!: finish typescript type declaration
  const siren_config: Record<string, any>;
  const siren_store: SirenStore;
  const siren_router: SirenRouter;
  // todo!: finish typescript type declaration
  // this obj actually is a class that use `getInstance()` to get instance
  // it actually control the audio elem, not the store control
  // such as store action `player/setIsPlaying`, it just change the state and dom show and do not effect the real audio element
  // this instance may also can get the `AudioContext`? so that we can do some unbelievable things.
  const siren_audio_instance: any;
  export {
    siren_config,
    siren_store,
    siren_audio_instance,
    siren_router,
    inject_notify,
  };
}

declare const __DEV__: boolean;
// Use this type to extend tauri api
// declare module "@tauri-apps/api/tauri" {
//   function invoke(cmd: "test", args: { a: string }): Promise<number>
// }

declare module 'website-scraper' {
  const mod: any;
  export default mod;
}
