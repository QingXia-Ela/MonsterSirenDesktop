import createEffectManager from "../../manager/createEffectManager";
import { readTextFile, writeTextFile, BaseDirectory, createDir, exists } from "@tauri-apps/api/fs"
import basic from "./basic";
import { WritableAtom } from "nanostores";

const SETTINGS_PATH = "config\\settings.json"

await createDir('config', { dir: BaseDirectory.AppData, recursive: true })

if (!await exists(SETTINGS_PATH, { dir: BaseDirectory.AppData })) {
  await writeTextFile(SETTINGS_PATH, '{}', { dir: BaseDirectory.AppData })
}

const content = JSON.parse(await readTextFile(SETTINGS_PATH, { dir: BaseDirectory.AppData }));

const DEFAULT_CONFIG = {
  basic: {
    closeAutoPlay: false,
    volume: 20
  },
  background: {
    enable: false,
    url: "",
    blur: 0,
    maskOpacity: 0
  },
  localMusic: {
    enable: false,
    paths: []
  },
  download: {
    path: "",
    downloadLrc: false,
    parseFileType: "none"
  },
  outputDevice: {

  },
  desktopLrc: {},
  advanced: {
    enable: false,
    cdnProxyPort: 0,
    apiProxyPort: 0,
  },
}

const SettingsManager = createEffectManager(Object.assign({}, DEFAULT_CONFIG, content))

// SettingsManager.addAtom(basic)
const atomList: Array<[WritableAtom<any>, string]> = [
  [basic, "basic"]
]

atomList.forEach(([atom, key]) => {
  SettingsManager.addAtom(atom, key)
})

async function saveSettings() {
  await writeTextFile(SETTINGS_PATH, JSON.stringify(SettingsManager.getCombinedState()), { dir: BaseDirectory.AppData })
}

export { saveSettings, SettingsManager }