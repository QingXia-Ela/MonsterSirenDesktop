import createEffectManager from "../../manager/createEffectManager";
import {
  readTextFile,
  writeTextFile,
  BaseDirectory,
  createDir,
  exists,
} from "@tauri-apps/api/fs";
import { WritableAtom, atom } from "nanostores";

const SETTINGS_PATH = "config\\settings.json";

await createDir("config", { dir: BaseDirectory.AppData, recursive: true });

const content = JSON.parse(
  await readTextFile(SETTINGS_PATH, { dir: BaseDirectory.AppData }),
);

/**
 * The default settings **DON'T CHANGE IT**
 */
export const DEFAULT_CONFIG = {
  basic: {
    closeAutoPlay: false,
    volume: 20,
  },
  background: {
    enable: false,
    url: "",
    maskOpacity: 0,
  },
  localMusic: {
    enable: false,
    paths: [],
  },
  download: {
    path: "",
    downloadLrc: false,
    parseFileType: "none",
  },
  outputDevice: {},
  desktopLrc: {},
  advanced: {
    enable: false,
    cdnProxyPort: 0,
    apiProxyPort: 0,
  },
};

const cfg: typeof DEFAULT_CONFIG = Object.assign({}, DEFAULT_CONFIG, content);

const SettingsManager = createEffectManager(cfg);

// SettingsManager.addAtom(basic)
const atomList: Array<[string, WritableAtom<typeof DEFAULT_CONFIG>]> = [
  ["basic", atom(cfg.basic)],
  ["background", atom(cfg.background)],
];

atomList.forEach(([key, atom]) => {
  SettingsManager.addAtom(key, atom);
});

async function saveSettings() {
  await writeTextFile(
    SETTINGS_PATH,
    JSON.stringify(SettingsManager.getCombinedState()),
    { dir: BaseDirectory.AppData },
  );
}

export { saveSettings, SettingsManager };
