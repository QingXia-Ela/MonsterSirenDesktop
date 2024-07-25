const fs = require('fs')
const path = require('path')
const tmpPath = require('os').tmpdir()
const homePath = require('os').homedir()
const { cookieToJson } = require('NeteaseCloudMusicApi/util/index')
const UserPlaylist = require('NeteaseCloudMusicApi/module/user_playlist')
const serverModule = require('NeteaseCloudMusicApi/server')

let user_uid = process.env.NETEASE_USER_UID || null

fs.readFile(
  path.resolve(homePath, '.ncm_uid'),
  'utf-8',
  (err, data) => {
    if (!err) {
      user_uid = data
    }
  }
)

const parseRoute = (/** @type {string} */ fileName) => `/${fileName.replace(/\.js$/i, '').replace(/_/g, '/')}`
// module import
const collect = {
  /** 用户歌单 */
  "user_playlist": async (query, request) => {
    if (user_uid) {
      query.uid = user_uid
    }
    return UserPlaylist(query, request)
  },
  /** 获取歌单详情 */
  "playlist_detail": require('NeteaseCloudMusicApi/module/playlist_detail'),
  /** 获取歌单所有歌曲 */
  "playlist_track_all": require("NeteaseCloudMusicApi/module/playlist_track_all"),
  /** 歌曲详情 */
  "song_detail": require("NeteaseCloudMusicApi/module/song_detail"),
  /** 歌词 */
  "lyric": require("NeteaseCloudMusicApi/module/lyric"),
  /** 检查 */
  "check_music": require("NeteaseCloudMusicApi/module/check_music"),
  // 1: require("NeteaseCloudMusicApi/module/song"),
  /** 歌曲url @deprecated */
  "song_url": require("NeteaseCloudMusicApi/module/song_url"),
  /** 新版歌曲url */
  "song_url_v1": require("NeteaseCloudMusicApi/module/song_url_v1"),
  /** 新版歌曲下载url */
  "song_download_url": require("NeteaseCloudMusicApi/module/song_download_url"),
  /** 游客token注册 */
  "register_anonimous": require("NeteaseCloudMusicApi/module/register_anonimous"),
  /** 刷新cookie */
  "login_refresh": require("NeteaseCloudMusicApi/module/login_refresh"),
  /** 登陆状态 */
  "login_status": require("NeteaseCloudMusicApi/module/login_status"),
  /** 手机号登录 */
  "login_cellphone": require("NeteaseCloudMusicApi/module/login_cellphone"),
  /** 手机验证码发送 */
  "captcha_sent": require("NeteaseCloudMusicApi/module/captcha_sent"),
  /** 验证验证码与手机号是否正确 */
  "captcha_verify": require("NeteaseCloudMusicApi/module/captcha_verify"),
  // 以下为自定义api
  /** 设置用户UID */
  "uid_set": async (query) => {
    if (!query.uid) {
      return {
        status: 400,
        body: {
          message: 'uid is required',
        }
      }
    }
    user_uid = query.uid
    fs.writeFileSync(
      path.resolve(homePath, '.ncm_uid'),
      user_uid,
      'utf-8',
    )
    return {
      status: 200,
      body: {
        message: 'ok',
      }
    }
  },
  "uid_get": async () => {
    if (!user_uid) {
      return {
        code: 400,
        body: {
          message: 'uid is not set',
        }
      }
    }
    return {
      code: 200,
      body: {
        uid: user_uid
      }
    }
  },
  /** ping pong */
  "ping": async () => {
    return {
      status: 200,
      body: {
        message: 'pong',
      }
    }
  },
}

async function generateConfig() {
  const request = require('NeteaseCloudMusicApi/util/request')
  try {
    const res = await collect.register_anonimous({ cookie: {} }, request)
    const cookie = res.body.cookie ?? {}
    if (cookie) {
      const cookieObj = cookieToJson(cookie)
      fs.writeFileSync(
        path.resolve(tmpPath, 'anonymous_token'),
        cookieObj.MUSIC_A,
        'utf-8',
      )
    }
  } catch (error) {
    console.log(error)
  }
}

/**
 * @param {Record<string, any>} collect 
 */
function parseCollect(collect) {
  return Object.entries(collect).map(([identifier, module]) => ({
    identifier, route: parseRoute(identifier), module
  }))
}

async function start() {
  // 检测是否存在 anonymous_token 文件,没有则生成
  if (!fs.existsSync(path.resolve(tmpPath, 'anonymous_token'))) {
    fs.writeFileSync(path.resolve(tmpPath, 'anonymous_token'), '', 'utf-8')
  }
  // 启动时更新anonymous_token
  await generateConfig()
  let server = await serverModule.serveNcmApi({
    // todo!: 支持外部自定义端口
    port: 53753,
    checkVersion: true,
    moduleDefs: parseCollect(collect),
  })
  // server.use("/login-page", () => require("../src-login/index.html"))
}
start()