import DEFAULT_CONFIG from '@/constant/json/init_config.json' assert { type: 'json' };

interface AdditionConfig {
  basic: {
    closeMode?: 'minimize' | 'close' | 'tray' | '';
  };
}

export type CONFIG_TYPE = typeof DEFAULT_CONFIG & AdditionConfig;
