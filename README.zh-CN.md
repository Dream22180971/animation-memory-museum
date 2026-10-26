<div align="center">

# 00后动画记忆馆

**为 90 后、00 后保存国产动画童年记忆的数字博物馆 —— 放学后的 17:30，是我们等了很久的动画时间。**

[English](./README.md) | [简体中文](./README.zh-CN.md)

[![Live Demo](https://img.shields.io/badge/LIVE-museum.seanwalter.top-D4A854?style=for-the-badge)](https://museum.seanwalter.top)
[![Next.js](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js)](https://nextjs.org)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev)
[![License](https://img.shields.io/badge/LICENSE-MIT-10B981?style=for-the-badge)](./LICENSE)
[![CI](https://github.com/Dream22180971/animation-memory-museum/actions/workflows/ci.yml/badge.svg)](https://github.com/Dream22180971/animation-memory-museum/actions/workflows/ci.yml)

<img src="./docs/screenshots/home.webp" alt="首页：傍晚的旧房间里，一台 CRT 电视正在轮播经典国产动画" width="100%" />

**[进入记忆馆 →](https://museum.seanwalter.top)** · [快速开始](#-快速开始)

</div>

---

## 🎯 它是什么

这是一间放在网上的国产动画记忆馆：猪猪侠、虹猫蓝兔七侠传、超兽武装、秦时明月……那些陪一代人长大的电视动画，被整理成一间可以慢慢逛的展厅。

它 **不是视频站**，不存任何视频和音频。这里收藏的是屏幕之外的东西：海报、角色、口头禅、主题曲、首播的那一年，还有一本只属于你自己的回忆册。所有"观看"按钮都只会把你带去正版平台。

## 📺 今晚节目单

整个网站按电视频道来排布，每一行都对应 `src/app/` 里真实存在的路由。

| 频道 | 路由 | 正在播出 |
|---|---|---|
| **CH 01** · 首页 | `/` | CRT 电视轮播 6 部核心作品、胶片条、各展厅预览 |
| **CH 02** · 动画档案 | `/archive` | 全部馆藏，支持关键词搜索、类型 / 年份筛选与排序 |
| **CH 03** · 展品详情 | `/archive/[slug]` | 海报、制作方、首播平台、角色、正版观看入口、分享与"我也看过" |
| **CH 04** · 角色图谱 | `/characters` | 可交互的角色关系图：拖拽、平移、缩放，点击角色看人物档案 |
| **CH 05** · 名台词 | `/quotes` | 口头禅、登场句和燃点台词，按作品筛选 |
| **CH 06** · 动画歌曲 | `/songs` | 磁带样式的片头曲 / 片尾曲，点一首去 B 站搜来听 |
| **CH 07** · 年代时间线 | `/timeline` | 按数据自动划分年代，把作品串成一条时间线 |
| **CH 08** · 童年浓度测试 | `/quiz` | 六道题测出你的童年浓度，结果可以晒出来 |
| **CH 09** · 我的回忆册 | `/#contribute` | 只存在本机浏览器里的回忆册，可导出成 PNG 卡片 |
| **CH 10** · 关于我们 | `/about` | 项目故事、版权声明与致谢 |

任意页面按 <kbd>/</kbd> 都能打开全局搜索，可以搜动画、歌曲、歌手和题材。

## 🎬 页面截图

以下截图均由 [`scripts/capture-screenshots.mjs`](./scripts/capture-screenshots.mjs) 在本地生产构建上截取。

<table>
  <tr>
    <td width="50%"><img src="./docs/screenshots/archive.webp" alt="动画档案页：搜索框与类型、年份、排序筛选" /><br /><sub><b>动画档案</b>：搜索、筛选、排序全部馆藏</sub></td>
    <td width="50%"><img src="./docs/screenshots/detail.webp" alt="超兽武装展品详情：元数据与正版观看入口" /><br /><sub><b>展品详情</b>：元数据、角色与正版入口</sub></td>
  </tr>
  <tr>
    <td><img src="./docs/screenshots/characters.webp" alt="猪猪侠角色关系图谱" /><br /><sub><b>角色图谱</b>：可拖拽、可缩放的人物关系</sub></td>
    <td><img src="./docs/screenshots/quotes.webp" alt="名台词档案卡片" /><br /><sub><b>名台词</b>：按作品归档的经典台词</sub></td>
  </tr>
  <tr>
    <td><img src="./docs/screenshots/songs.webp" alt="以磁带形式展示的动画歌曲" /><br /><sub><b>动画歌曲</b>：一盘盘倒带重听的磁带</sub></td>
    <td><img src="./docs/screenshots/memory-book.webp" alt="保存在本机浏览器的回忆册表单" /><br /><sub><b>我的回忆册</b>：只存本机，可导出卡片</sub></td>
  </tr>
  <tr>
    <td><img src="./docs/screenshots/quiz.webp" alt="童年浓度测试第 1 题" /><br /><sub><b>童年浓度测试</b>：六道题，一个可以晒的结果</sub></td>
    <td align="center"><img src="./docs/screenshots/mobile-home.webp" alt="手机尺寸下的首页" width="45%" /><br /><sub><b>移动端</b>：同一个傍晚，搬到手机上</sub></td>
  </tr>
</table>

## ✨ 核心功能

| 区域 | 体验 |
|---|---|
| CRT 开机仪式 | 首页每个会话只播一次的老电视开机动画；系统开启"减少动态效果"时自动跳过 |
| 馆藏规模 | 35 部作品（1999–2018）、160 位角色、155 条角色关系、112 句台词、42 首歌曲 |
| 正版观看入口 | 127 个外链，直接打开作品在腾讯视频、哔哩哔哩、爱奇艺、优酷、央视频、西瓜视频上的搜索页，站内不播放任何内容 |
| 角色图谱 | 每部作品一张关系图，支持拖拽、平移、缩放、关系标签和人物档案 |
| 我的回忆册 | 回忆写在自己的浏览器里（保留最新 20 条），任意一条都能用 canvas 画成 PNG 卡片导出 |
| 我也看过 | 每个展品一键标记，记在本机 |
| 分享 | 支持系统分享面板的设备直接调起，其他情况复制到剪贴板 |
| 动效系统 | 动效 token 与仪式规范见 [`Museum-Motion-Design-System-v1.0.md`](./Museum-Motion-Design-System-v1.0.md) |

## 🧭 体验地图

```mermaid
flowchart LR
    Boot([CRT 开机 · 每会话一次]) --> Home[首页 / CRT 轮播]
    Home --> Archive[动画档案]
    Archive --> Exhibit[展品详情]
    Exhibit -->|正版入口| Platform[(正版平台)]
    Home --> Characters[角色图谱]
    Home --> Quotes[名台词]
    Home --> Songs[动画歌曲]
    Home --> Timeline[年代时间线]
    Home --> Quiz[童年浓度测试]
    Home --> Memory[我的回忆册]
    Memory -->|导出| Card[/PNG 卡片/]
    Search{{全局搜索  /}} -.-> Exhibit
```

## 🔐 隐私与内容边界

- **回忆只留在你的设备上。** 回忆册和"我也看过"的标记都存在浏览器 `localStorage` 里，不会上传。想让某段回忆进入公开馆藏，可以[提 Issue](https://github.com/Dream22180971/animation-memory-museum/issues)。
- **线上站点接入了 Vercel Web Analytics**（`@vercel/analytics`），用于统计页面访问。
- **不托管任何视频或音频。** 观看按钮和歌曲链接都会离开本站，跳到正版平台或 B 站搜索。
- **来源可查。** 资料考据参考百度百科等公开来源（每部作品都附链接）；海报收集自 [Bangumi](https://bgm.tv) 等社区数据库，记录在 [`scripts/poster-credits.json`](./scripts/poster-credits.json)。所有素材版权归原作者及出品方所有，权利人可通过 GitHub Issue 申请下架，详见 `/about` 页。

## ⚡ 快速开始

需要 **Node.js 22**（与 CI 一致）和 npm。

```bash
git clone https://github.com/Dream22180971/animation-memory-museum.git
cd animation-memory-museum

npm install
npm run dev
```

打开 `http://localhost:3000`。

## 🛠 常用命令

| 命令 | 作用 |
|---|---|
| `npm run dev` | 启动开发服务器 |
| `npm run validate:data` | 按 `scripts/validate-data.mjs` 中的规则校验 `src/data/animations.json` |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run lint` | ESLint |
| `npm run build` | 先跑 `validate:data`（`prebuild`），再执行 `next build --webpack` |
| `npm start` | 启动生产构建 |
| `npm run test:e2e` | Playwright 端到端测试 |
| `node scripts/capture-screenshots.mjs` | 对运行中的站点重新生成 `docs/screenshots/`（可用 `BASE_URL` 指定地址，默认 `http://localhost:3000`） |

生产构建刻意使用 webpack（`next build --webpack`）。除非重新验证过 Bundle 行为，否则请保持不变。

## 🧪 测试

`tests/e2e/museum.spec.ts` 覆盖：首页统计与全局搜索、档案筛选、回忆册（保存、导出入口、删除，且不会混进公开档案）、"我也看过"、童年浓度测试、展品元数据与正版入口，以及角色图谱（切换作品、打开人物档案、拖拽与缩放）。

- Playwright 会自己在 `127.0.0.1:3100` 启动开发服务器，分别跑 **桌面 Chrome** 和 **Pixel 5** 两个项目。
- 本地默认使用你已安装的 Google Chrome（`channel: "chrome"`）；设置了 `CI` 环境变量时改用 Playwright 自带的 Chromium（需先 `npx playwright install chromium`）。
- [CI](./.github/workflows/ci.yml) 在每个 Pull Request 和推送到 `main` 时依次执行：lint → 数据校验 → 类型检查 → 构建 → E2E。

## 🗂 项目结构

```text
src/
├── app/                 # 路由：/、archive、archive/[slug]、characters、quotes、songs、timeline、quiz、about
├── components/          # hero（CRT、开机动画、胶片条）、archive、characters、quotes、songs、timeline、
│                        # quiz、search、engagement（回忆册）、motion、layout、ui
├── data/animations.json # 全部馆藏，唯一数据源
└── lib/                 # 数据工具、测试逻辑、站点常量（HERO_FEATURED_SLUGS 等）
scripts/                 # 数据校验、海报抓取与压缩、截图
tests/e2e/               # Playwright 用例
public/images/           # 海报、场景与回忆插图
```

### 新增一部馆藏

1. 在 `src/data/animations.json` 里加一条记录（`scripts/validate-data.mjs` 列出的字段都是必填）。
2. 运行 `npm run validate:data`。
3. 想让它出现在首页电视里，需要手动把 slug 加进 `src/lib/constants.ts` 的 `HERO_FEATURED_SLUGS`，新馆藏不会自动进轮播。

## ⚠️ 当前限制

- 界面只有中文。
- 馆藏为人工整理：目前 35 部，年份跨度 1999–2018，只收录国产电视动画。
- 回忆册按浏览器保存：没有账号、不能同步，只保留最新 20 条，清除站点数据就会丢失。
- 不提供播放，这是刻意的设计：记忆馆只负责把你指向正版平台。

## 🗺 路线图

- [x] CRT 首页与开机仪式
- [x] 动画档案、展品详情与全局搜索
- [x] 角色关系图谱
- [x] 名台词、动画歌曲与年代时间线
- [x] 童年浓度测试
- [x] 本地回忆册与卡片导出
- [ ] 更多作品与动画类别
- [ ] 童年电视剧、Flash 游戏与老互联网记忆专题
- [ ] AI 怀旧互动

## 🤝 参与贡献

欢迎通过 [GitHub Issues](https://github.com/Dream22180971/animation-memory-museum/issues) 推荐作品、纠正资料，或提交值得入馆的回忆。提交代码前请先跑一遍 `npm run lint`、`npm run typecheck` 和 `npm run build`。

## 📄 License

代码以 [MIT License](./LICENSE) 开源。动画名称、海报、角色、台词与歌曲等素材的版权归原作者及出品方所有。

<div align="center">

**不是为了重播动画，而是为了保存屏幕之外的那段童年。**

</div>
