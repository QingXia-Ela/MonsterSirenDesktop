export interface basicConfig {
  closeAutoPlay?: boolean;
  volume?: number;
  closeMode?: 'minimize' | 'close' | 'tray' | '';
  /**
   * 音乐列表显示模式
   *
   * - hide: 隐藏
   * - show: 显示
   * - collect: 将所有歌曲打平为一个音乐列表
   *
   * @default "collect"
   */
  showSirenMusicListMode?: 'hide' | 'show' | 'collect' | '';
}

export interface backgroundConfig {
  enable?: boolean;
  url?: string;
  backgroundOptions?: Array<{
    pageName: string;
    opacity: number;
    blur: number;
  }>;
}

export interface localMusicConfig {
  enable?: boolean;
  paths?: string[];
}

export interface downloadConfig {
  path?: string;
  downloadLrc?: boolean;
  parseFileType?: string;
}

export interface outputDeviceConfig {}

export interface desktopLrcConfig {}

export interface advancementConfig {
  enable?: boolean;
  cdnProxyPort?: number;
  apiProxyPort?: number;
  logStore?: boolean;
  allowContextMenu?: boolean;
}

interface AppConfig {
  basic: basicConfig;
  background: backgroundConfig;
  localMusic: localMusicConfig;
  download: downloadConfig;
  outputDevice: outputDeviceConfig;
  desktopLrc: desktopLrcConfig;
  advancement: advancementConfig;
}

export default AppConfig;
