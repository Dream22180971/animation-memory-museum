# 00后动画记忆馆 | Digital Childhood Museum

> 放学后的 17:30，是我们等了很久的动画时间。

[![Live Demo](https://img.shields.io/badge/Live_Demo-museum.seanwalter.top-d4a854?style=flat)](https://museum.seanwalter.top)
[![Next.js](https://img.shields.io/badge/Next.js-16-black?style=flat&logo=next.js)](https://nextjs.org)
[![React](https://img.shields.io/badge/React-19-61dafb?style=flat)](https://react.dev)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4-06b6d4?style=flat)](https://tailwindcss.com)
[![License](https://img.shields.io/badge/License-MIT-blue?style=flat)](./LICENSE)

[在线体验](https://museum.seanwalter.top) · [GitHub](https://github.com/Dream22180971/animation-memory-museum) · [提交反馈](https://github.com/Dream22180971/animation-memory-museum/issues)

---

## 目录

- [它是什么](#它是什么)
- [为什么做](#为什么做)
- [核心功能](#核心功能)
- [截图演示](#截图演示)
- [快速开始](#快速开始)
- [技术架构](#技术架构)
- [已收录动画](#已收录动画)
- [Roadmap](#roadmap)
- [FAQ](#faq)
- [谁适合用](#谁适合用)
- [关于我](#关于我)
- [License](#license)

---

## 它是什么

一个为 **90-00 后**打造的中国国产动画怀旧数字博物馆。

你可以用它来：

- **重温经典动画** —— CRT 电视风格的沉浸式浏览体验，17 部经典国产动画、74 条名台词、80 位角色小传
- **搜索和筛选** —— 按题材、年代、来源查找动画，支持关键词搜索
- **写下自己的回忆** —— 把你和某部动画的故事存进「我的回忆册」，只留在本机浏览器，可一键导出成分享卡片
- **标记已看** —— 勾选你看过的动画，打造个人观看清单

**不是视频站，不提供资源。** 只收藏那些年放学后在 CRT 电视前等来的记忆。

---

## 为什么做

每个 90-00 后的放学记忆里，都有一个固定的时刻：**17:30，打开电视，等动画开始。**

猪猪侠、虹猫蓝兔、洛洛历险记、超兽武装……这些名字不只是动画，是一整代人的童年密码。

但随着时间流逝，这些记忆正在变得模糊。我想做一个地方，把这些记忆**封存在数字空间里**——不是冰冷的数据库，而是一个有 CRT 扫描线、有暖黄色调、有电台音乐的「房间」。

走进来，就像回到了那个放学后的下午。

---

## 核心功能

| 功能 | 说明 |
|------|------|
| 📺 CRT 视觉风格 | 扫描线、辉光、暗角，还原老电视的质感 |
| 🎠 海报轮播 | 拖拽交互、自动播放、CRT 扫描线叠加 |
| ✨ 粒子背景 | Canvas 渲染的金色浮动粒子系统 |
| 📅 年代时间线 | 横向滚动，1999-2015 时代分期（由数据推导） |
| 💬 经典台词弹幕 | 双向滚动的 74 条动画名台词 |
| 🧩 角色关系图谱 | 可拖拽、可缩放的星座图；关系按语义族着色并配图例，默认只画线，点角色弹出人物小传 |
| 🎯 童年浓度测试 | 6 题怀旧问答，测出你的童年浓度称号 |
| 🎵 动画歌曲 | 按作品分类的经典主题曲、片头曲、片尾曲卡片 |
| 🔍 档案筛选 | 按题材/年代/来源搜索和排序 |
| 📖 我的回忆册 | 本机保存你的动画回忆，可一键导出成分享卡片、可随时删除 |
| 📤 分享功能 | Web Share API + 剪贴板兜底 |

---

## 截图演示

> 待部署后补充截图（首页 Hero / 动画档案 / 角色图谱）


---

## 快速开始

3 步跑起来：

```bash
# 1. 克隆项目
git clone https://github.com/Dream22180971/animation-memory-museum.git
cd animation-memory-museum

# 2. 安装依赖
npm install

# 3. 启动开发服务器
npm run dev
```

打开 [http://localhost:3000](http://localhost:3000) 即可看到效果。

其他命令：

```bash
npm run build        # 构建生产版本（自动先跑数据校验）
npm start            # 启动生产服务器
npm run lint         # 代码检查
npm run typecheck    # TypeScript 类型检查
npm run validate:data # 校验 animations.json Schema
npm run test:e2e     # Playwright 端到端测试（桌面 + 移动）
```

---

## 技术架构

| 层级 | 技术 |
|------|------|
| 框架 | [Next.js](https://nextjs.org/) 16 (App Router) |
| UI | [React](https://react.dev/) 19 + [TypeScript](https://www.typescriptlang.org/) 5 |
| 样式 | [Tailwind CSS](https://tailwindcss.com/) v4 |
| 动效 | [Framer Motion](https://www.framer.com/motion/) 12 |
| 图标 | [Lucide React](https://lucide.dev/) |
| 部署 | [Vercel](https://vercel.com) |

### 项目结构

```
src/
├── app/                      # Next.js App Router 页面
│   ├── page.tsx              # 首页
│   ├── about/page.tsx        # 关于页面
│   ├── characters/page.tsx   # 角色关系图谱
│   ├── quiz/page.tsx         # 童年浓度测试
│   └── archive/
│       ├── page.tsx          # 动画档案馆
│       └── [slug]/page.tsx   # 动画详情页
├── components/
│   ├── hero/                 # 英雄区（轮播、粒子背景、统计栏）
│   ├── archive/              # 档案卡片、筛选器、已看/分享按钮
│   ├── characters/           # 角色关系星座图
│   ├── quiz/                 # 童年浓度测试
│   ├── timeline/             # 年代时间线
│   ├── memories/             # 经典台词弹幕
│   ├── songs/                # 动画歌曲卡片
│   ├── engagement/           # 我的回忆册（本机存储 + 分享卡导出）
│   └── layout/               # 导航栏、页脚
├── data/animations.json      # 动画数据源（17 部馆藏）
└── lib/                      # 类型、推导函数、题库、常量
scripts/validate-data.mjs     # 数据 Schema 校验（prebuild 钩子）
tests/e2e/                    # Playwright 双视口 E2E
```

---

## 已收录动画

| 动画 | 年份 | 题材 |
|------|------|------|
| 超兽武装 | 2011 | 机甲, 热血, 科幻 |
| 猪猪侠 | 2005 | 搞笑, 冒险, 童话 |
| 果宝特攻 | 2010 | 机甲, 搞笑, 战斗 |
| 洛洛历险记 | 2008 | 机甲, 热血, 冒险 |
| 虹猫蓝兔七侠传 | 2006 | 武侠, 冒险, 励志 |
| 神兵小将 | 2007 | 冒险, 奇幻, 战斗 |
| 喜羊羊与灰太狼 | 2005 | 喜剧, 冒险, 童话 |
| 围棋少年 | 2005 | 励志, 竞技, 武侠 |
| 我为歌狂 | 2001 | 青春, 音乐, 校园 |
| 中华小子 | 2007 | 热血, 武侠, 冒险 |
| 大耳朵图图 | 2004 | 喜剧, 日常, 儿童 |
| 蓝猫淘气三千问 | 1999 | 科普, 冒险, 儿童 |
| 火力少年王 | 2006 | 热血, 竞技, 励志 |
| 精灵世纪 | 2006 | 奇幻, 冒险, 热血 |
| 熊出没 | 2012 | 喜剧, 冒险 |
| 魁拔 | 2011 | 热血, 奇幻, 冒险 |
| 赛尔号 | 2012 | 科幻, 冒险, 热血 |

> 制作方、首播平台、主题曲、人物小传等资料均经公开资料核验，角色卡片附「资料源」外链；查不到可靠来源的字段留空并显示「档案整理中」。

---

## Roadmap

- [x] 首页 Hero 区 + CRT 视觉效果
- [x] 海报轮播 + 粒子背景
- [x] 动画档案馆 + 筛选搜索
- [x] 动画详情页 + 经典台词网格
- [x] 年代时间线
- [x] 经典台词弹幕
- [x] 动画歌曲卡片
- [x] 我的回忆册（本机存储 + 分享卡导出）
- [x] 更多动画收录（馆藏扩充至 17 部）
- [x] 角色关系图谱（/characters）
- [x] 童年知识问答（/quiz）
- [ ] 更多类别收录（童年电视剧、Flash 游戏、4399 时代）
- [ ] AI 怀旧互动

---

## FAQ

**Q: 这个站提供动画资源吗？**

不提供。这是一个记忆收藏站，不存储任何视频内容。动画信息来自公开资料，详情页链接到百度百科。

**Q: 我的数据存在哪里？**

所有个人数据（回忆册条目、已看标记）都通过 `localStorage` 存储在你的浏览器本地，不会上传到任何服务器，也不会出现在别人看到的档案列表里。回忆册支持导出成一张分享卡片（canvas 生成，走 Web Share 或下载）。

**Q: 可以添加新动画吗？**

馆藏全部由维护者逐条核对公开资料后写入 `src/data/animations.json`，暂不接受自动收录。想推动某部动画入馆，请[提 issue](https://github.com/Dream22180971/animation-memory-museum/issues) 并附资料来源；你写在回忆册里的内容是本机私人的，不会变成馆藏。

---

## 谁适合用

- **90-00 后** —— 那些年放学后守在电视前等动画的你
- **国产动画爱好者** —— 想重温经典、收藏回忆的人
- **前端开发者** —— 想学习 CRT 视觉效果、Canvas 粒子、Framer Motion 动效的开发者

---

## 关于我

我是 [Sean Walter](https://github.com/Dream22180971)，一个喜欢做有趣项目的开发者。

如果这个站让你想起了放学后的某个下午，那就够了。

---

## License

[MIT](./LICENSE)
