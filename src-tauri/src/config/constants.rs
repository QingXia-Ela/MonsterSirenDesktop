/// sync with `src/constant/json/init_config.json`
pub const INIT_CONFIG: &str = r#"{
  "basic": {
    "closeAutoPlay": true,
    "volume": 20
  },
  "background": {
    "enable": false,
    "url": "",
    "backgroundOptions": [
      {
        "pageName": "index",
        "opacity": 45,
        "blur": 0
      },
      {
        "pageName": "about",
        "opacity": 45,
        "blur": 0
      },
      {
        "pageName": "albums",
        "opacity": 35,
        "blur": 0
      },
      {
        "pageName": "info",
        "opacity": 25,
        "blur": 10
      },
      {
        "pageName": "contact",
        "opacity": 35,
        "blur": 0
      },
      {
        "pageName": "music",
        "opacity": 30,
        "blur": 10
      },
      {
        "pageName": "playlist",
        "opacity": 30,
        "blur": 10
      },
      {
        "pageName": "download",
        "opacity": 30,
        "blur": 10
      }
    ]
  },
  "localMusic": {
    "enable": false,
    "paths": []
  },
  "download": {
    "path": "",
    "downloadLrc": false,
    "parseFileType": "none"
  },
  "outputDevice": {},
  "desktopLrc": {},
  "advancement": {
    "enable": false,
    "cdnProxyPort": 0,
    "apiProxyPort": 0,
    "logStore": false
  }
}"#;
