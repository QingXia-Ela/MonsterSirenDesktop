import createEffectManager from '../../manager/createEffectManager';
import DEFAULT_CONFIG from '@/constant/json/init_config.json' assert { type: 'json' };
import {
  readTextFile,
  writeTextFile,
  BaseDirectory,
  createDir,
  exists,
} from '@tauri-apps/api/fs';
import { WritableAtom, atom } from 'nanostores';

const SETTINGS_PATH = 'config\\settings.json';

await createDir('config', { dir: BaseDirectory.AppData, recursive: true });

const content = JSON.parse(
  await readTextFile(SETTINGS_PATH, { dir: BaseDirectory.AppData }),
);

const cfg: typeof DEFAULT_CONFIG = Object.assign({}, DEFAULT_CONFIG, content);

const SettingsManager = createEffectManager(cfg);

const atomList: Array<[string, WritableAtom<typeof DEFAULT_CONFIG>]> = [
  ['basic', atom(cfg.basic)],
  ['background', atom(cfg.background)],
  ['advancement', atom(cfg.advancement)],
  ['download', atom(cfg.download)],
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
