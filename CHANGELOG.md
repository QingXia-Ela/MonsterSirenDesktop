# Changelog

## [0.2.0](https://github.com/QingXia-Ela/MonsterSirenDesktop/compare/0.1.0...0.2.0) (2024-08-11)


### ✨ Feat

* 关闭点击播放时的页面跳转行为 ([ad5d747](https://github.com/QingXia-Ela/MonsterSirenDesktop/commit/ad5d7476ca0baefc6576640d9cc54b5aa2a3e81f))
* 增加软件使用手册 ([4c1769e](https://github.com/QingXia-Ela/MonsterSirenDesktop/commit/4c1769ea693fcadc5cac1168e1639aaa7ca4b0ae))


### 🐛 Bug Fixes

* 修复播放列表播放时没有等到歌曲切换完毕后播放的问题 ([e8518e1](https://github.com/QingXia-Ela/MonsterSirenDesktop/commit/e8518e10d738b1a2f1c7aa8d613225a2c33f7666))
* 修复不正确字体路径导致首页加载失败的问题 ([f736fe9](https://github.com/QingXia-Ela/MonsterSirenDesktop/commit/f736fe94d86a07c2ada647e3e2701ee454fd0f5d))
* 修复歌曲切换时导致自定义页面消失的问题 ([7998073](https://github.com/QingXia-Ela/MonsterSirenDesktop/commit/799807334fdce144b3d91b47898f2a527741885a))
* 修复软件首次页面展示时背景色彩不正确的问题 ([27774c5](https://github.com/QingXia-Ela/MonsterSirenDesktop/commit/27774c59f321edcd1f5ab2a21035c2b4b63ded96))
* 修复生产环境下按下 f12 可以打开开发者工具的问题 ([cd6d80d](https://github.com/QingXia-Ela/MonsterSirenDesktop/commit/cd6d80d967d1f7b889026ca26496326d745b4bc6))
* 修复生产环境右键菜单样式丢失的问题 ([4de2ba9](https://github.com/QingXia-Ela/MonsterSirenDesktop/commit/4de2ba992b07bbd2be25646e5358079bcf97f2b2))
* 再次修复歌曲切换时导致自定义页面消失的问题 ([fa98198](https://github.com/QingXia-Ela/MonsterSirenDesktop/commit/fa981980609794418ea5b4f425dc8ffc7ff72af1))


### 📝 Documentation

* 更新使用手册 ([a117d5f](https://github.com/QingXia-Ela/MonsterSirenDesktop/commit/a117d5f78ebb5cbd9b438a9d9adf8ee631b0fbd6))


### 🚩 Chore

* 移除一部分不必要的todo ([035e456](https://github.com/QingXia-Ela/MonsterSirenDesktop/commit/035e456fabf66e650d5e95eed1987be45439e879))
* cargo fix result ([6ed5edc](https://github.com/QingXia-Ela/MonsterSirenDesktop/commit/6ed5edc945bb7b22fe627d19c5f92bf1a1870ac0))
* lint ([4da9ee5](https://github.com/QingXia-Ela/MonsterSirenDesktop/commit/4da9ee5da3c8c9444b4cb50334a24c209e1946e5))
* lint ([9e909e5](https://github.com/QingXia-Ela/MonsterSirenDesktop/commit/9e909e5b42e6db1068ebc81c1b7765234720c197))
* try fix cargo warn ([5012dbb](https://github.com/QingXia-Ela/MonsterSirenDesktop/commit/5012dbba184cc0108dda367c1938136a77893e07))
* update readme ([cfe94b7](https://github.com/QingXia-Ela/MonsterSirenDesktop/commit/cfe94b7672ded238e83176a7dceaee66dc2cea34))

## [0.1.0](https://github.com/QingXia-Ela/MonsterSirenDesktop/compare/0.0.1-alpha.1...0.1.0) (2024-07-30)


### ✨ Feat

* 更新生产环境控制刷新页面选项 ([62b8ff3](https://github.com/QingXia-Ela/MonsterSirenDesktop/commit/62b8ff31af193a2f76d5dbdb9fb78b626fc53c25))
* 增加 song/url 请求 ([df791a4](https://github.com/QingXia-Ela/MonsterSirenDesktop/commit/df791a4d8ffa83508aabd70498f50136732fd4d5))
* 增加歌曲本地搜索功能 ([a80071c](https://github.com/QingXia-Ela/MonsterSirenDesktop/commit/a80071c530d3ec231c527ba8e75805da931d5c68))
* 增加歌曲标签与时长展示 ([ee91459](https://github.com/QingXia-Ela/MonsterSirenDesktop/commit/ee91459963fad77492baa3f9c3cb3c5d05f11375))
* 增加歌曲时长信息补全 ([039a964](https://github.com/QingXia-Ela/MonsterSirenDesktop/commit/039a964fe975bc9e337c9def8c58f89e562bf1b0))
* 增加可选的 cdn 内联代码块 ([bb0ef7b](https://github.com/QingXia-Ela/MonsterSirenDesktop/commit/bb0ef7b6879b658da259ce035948616e203f4308))
* 增加离线访问缓存框架 ([70463f8](https://github.com/QingXia-Ela/MonsterSirenDesktop/commit/70463f817b78f36a87d568d44c8a4abf30ba713c))
* 增加离线切换提示 ([4bdbc7c](https://github.com/QingXia-Ela/MonsterSirenDesktop/commit/4bdbc7cb378c8ce9916b2777f583910adb5f83d8))
* 增加自定义播放列表源命名空间数据段 ([82a9bf9](https://github.com/QingXia-Ela/MonsterSirenDesktop/commit/82a9bf9650c0b4eb0e8059b0edccc27a4ac6ff26))
* 增加ncm api匿名注册签名 ([07f5b21](https://github.com/QingXia-Ela/MonsterSirenDesktop/commit/07f5b21cbbd8909f1c0279288b438ccaf764bb3e))


### 🐛 Bug Fixes

* 修复 sdk 加载导致的页面无法正常进入的问题 ([0b026d7](https://github.com/QingXia-Ela/MonsterSirenDesktop/commit/0b026d7002cbc1656f8ad25bb1809997a240aaa2))
* 修复高级选项失效的问题 ([bb5123d](https://github.com/QingXia-Ela/MonsterSirenDesktop/commit/bb5123d6c6f14b4d8eb588892ff88fec2da082ce))
* 修复首次播放列表中歌曲时图片切换为专辑的问题 ([8c758e1](https://github.com/QingXia-Ela/MonsterSirenDesktop/commit/8c758e1fed77478d2e66d12a031b07011b5195e5))
* 修复字体 api 请求失败的问题 ([b9bd878](https://github.com/QingXia-Ela/MonsterSirenDesktop/commit/b9bd878ce7d7b1c145710ad9e2b4c1128494eb9a))


### 🚩 Chore

* 增加 release-it ([3139419](https://github.com/QingXia-Ela/MonsterSirenDesktop/commit/313941911cc8dadc9736c3b6428ff237ec2af778))
* lint ([09fd6e6](https://github.com/QingXia-Ela/MonsterSirenDesktop/commit/09fd6e6d8384134692ed1f687b07fe6d6db34b35))
* lint ([5f93cbc](https://github.com/QingXia-Ela/MonsterSirenDesktop/commit/5f93cbc49676517d2ef1e5d1b6bf6c1ad08e0f58))
* lint ([b5da4f4](https://github.com/QingXia-Ela/MonsterSirenDesktop/commit/b5da4f40aa0239d256852773d83917e095564e74))
