const { Deno } = require('@deno/shim-deno')
const fs = require('fs')
const path = require('path')
const tmpPath = require('os').tmpdir()

const parseRoute = (/** @type {string} */ fileName) => `/${fileName.replace(/\.js$/i, '').replace(/_/g, '/')}`
// module import
const collect = {
  /** 用户歌单 */
  "user_playlist": require('NeteaseCloudMusicApi/module/user_playlist'),
  /** 获取歌单详情 */
  "playlist_detail": require('NeteaseCloudMusicApi/module/playlist_detail'),
  /** 获取歌单所有歌曲 */
  "playlist_track_all": require("NeteaseCloudMusicApi/module/playlist_track_all"),
  /** 歌曲详情 */
  "song_detail": require("NeteaseCloudMusicApi/module/song_detail"),
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
  const generateConfig = require('NeteaseCloudMusicApi/generateConfig')
  await generateConfig()
  require('NeteaseCloudMusicApi/server').serveNcmApi({
    checkVersion: true,
    moduleDefs: parseCollect(collect),
  })
}
start()