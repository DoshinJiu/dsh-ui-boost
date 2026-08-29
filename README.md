# dsh-ui-boost —— DSH Web 界面增强

DSH Web 界面的常驻优化插件（持久客户端插件，非会话动态插件，重启自动加载）。

## 功能

- **RGB 调色**：R/G/B 三通道独立滑杆 + 强度，对界面整体染色（`mix-blend-mode: color`，保留明度只改色相/饱和度），默认开启
- **Tool 卡片默认折叠**：工具调用默认只显示一行摘要，点击行展开详情（CSS 保险规则，基于 `data-open`）
- **输入区状态条**：运行状态、消息数、队列数、草稿字数、本次输入预计 token（估算）
- **悬浮美化面板**：从触发按钮（右下角 🎨 FAB 或侧栏底部「🎨 美化」）**向上展开**
- **设置持久化**：自动保存到 `$DSH_HOME/ui-boost.json`（`~/.dsh/ui-boost.json`）

## 安装 / 升级

```sh
# 本地开发安装（pnpm link 协议）
dsh plugin --profile web add link:D:\dsh\ui-boost

# 升级（代码改动后重新执行一次即可刷新链接内容）
dsh plugin --profile web add link:D:\dsh\ui-boost

# 卸载
dsh plugin --profile web remove dsh-ui-boost
```

装好后**重启 web 进程**生效。无需重建前端 bundle：浏览器半端由
`dsh-client-modules` 在运行时以 `/plugins/dsh-ui-boost/client.js` 提供。

## 结构

| 文件 | 作用 |
| --- | --- |
| `cordis.patch.yml` | bundle 挂载声明（把 `dsh-ui-boost` 行插入 web profile 配置树） |
| `lib/index.js` | node 半端：设置 API（`/ui-boost/settings.json`） |
| `lib/client.js` | 浏览器半端：调色/状态条/面板 UI |

## 注意

- Tool 卡片折叠依赖 `.o3BgMG_*` 类名与 DisclosureRow 的 `data-open` 属性；
  若 DSH 前端大版本升级改了类名，需同步更新 `lib/client.js` 中的 CSS。
- 这是**个人部署级**改动：profile 目录 `$DSH_HOME/profiles/web/` 归你所有，
  与官方 npm 安装的部署无关；`dsh` 升级不会覆盖它。
