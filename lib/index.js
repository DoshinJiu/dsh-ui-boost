// dsh-ui-boost —— DSH 界面增强（node 半端）
// 职责：设置持久化 —— GET/POST /ui-boost/settings.json，读写 $DSH_HOME/ui-boost.json
// 浏览器半端通过 package.json 的 dsh.client 声明 + exports["./client"] 提供。
import fs from 'node:fs'
import path from 'node:path'
import os from 'node:os'

const DSH_HOME = process.env.DSH_HOME || path.join(os.homedir(), '.dsh')
const SETTINGS_FILE = path.join(DSH_HOME, 'ui-boost.json')

const JSON_HEADERS = { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' }

const DEFAULTS = {
  dockOn: true,         // 输入区状态条
  tintOn: true,         // RGB 调色开关（常驻开启）
  tintR: 120,           // 调色 R
  tintG: 120,           // 调色 G
  tintB: 255,           // 调色 B
  tintA: 0.35,          // 调色强度 0–0.6
}

function readSettings() {
  try {
    const raw = JSON.parse(fs.readFileSync(SETTINGS_FILE, 'utf8'))
    return { ...DEFAULTS, ...raw }
  } catch {
    return { ...DEFAULTS }
  }
}

function writeSettings(next) {
  const merged = { ...readSettings(), ...next }
  fs.mkdirSync(path.dirname(SETTINGS_FILE), { recursive: true })
  fs.writeFileSync(SETTINGS_FILE, JSON.stringify(merged, null, 2), 'utf8')
  return merged
}

function readBody(req, limit) {
  return new Promise((resolve, reject) => {
    const chunks = []
    req.on('data', (c) => {
      chunks.push(c)
      if (chunks.reduce((n, x) => n + x.length, 0) > limit) {
        reject(new Error('body too large'))
        req.destroy()
        return
      }
    })
    req.on('end', () => resolve(Buffer.concat(chunks)))
    req.on('error', reject)
  })
}

function apply(ctx) {
  // webServer 通过 inject 声明为硬依赖：loader 会等它就绪后才激活本行，
  // 避免提前激活导致 ctx.get('webServer') 为 undefined 而静默跳过注册。
  const webServer = ctx.webServer

  // 设置读写 API（路由放在 /api 之外，避免与网关的 /api 前缀互扰）
  ctx.effect(() => webServer.register({
    kind: 'exact',
    path: '/ui-boost/settings.json',
    handler: async (req, res) => {
      try {
        if (req.method === 'POST' || req.method === 'PUT') {
          const body = JSON.parse((await readBody(req, 65536)).toString('utf8'))
          const settings = writeSettings(typeof body === 'object' && body !== null ? body : {})
          res.writeHead(200, JSON_HEADERS)
          res.end(JSON.stringify({ ok: true, settings }))
          return
        }
        res.writeHead(200, JSON_HEADERS)
        res.end(JSON.stringify({ ok: true, settings: readSettings() }))
      } catch (err) {
        res.writeHead(400, JSON_HEADERS)
        res.end(JSON.stringify({ ok: false, error: String((err && err.message) || err) }))
      }
    },
  }), 'dsh-ui-boost: settings api')
}

const name = 'dsh-ui-boost'
const inject = ['webServer']

export { name, inject, apply }
