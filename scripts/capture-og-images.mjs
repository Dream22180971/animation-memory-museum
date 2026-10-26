// 社交分享预览图：先 npm run build && npm start，再 node scripts/capture-og-images.mjs，然后重新 build
// 每个展厅截一张真实页面首屏，输出到对应路由段的 opengraph-image.jpg（Next 文件约定，自动生成 og:image）
import { chromium } from "@playwright/test";
import { writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const baseUrl = process.env.BASE_URL || "http://localhost:3000";
const appDir = join(dirname(fileURLToPath(import.meta.url)), "..", "src", "app");

// 详情页用海报做预览图（generateMetadata 里配置），不在这里生成
const halls = [
  { segment: "", url: "/", alt: "00后动画记忆馆首页：傍晚旧房间里的 CRT 电视正在轮播国产动画" },
  { segment: "archive", url: "/archive", alt: "完整动画档案：按类型、年份筛选的国产动画馆藏" },
  { segment: "characters", url: "/characters", alt: "角色关系图谱：每部动画一张可拖拽的角色星座图" },
  { segment: "quotes", url: "/quotes", alt: "名台词档案馆：按作品归档的国产动画经典台词" },
  { segment: "songs", url: "/songs", alt: "动画歌曲：磁带样式的片头曲与片尾曲" },
  { segment: "timeline", url: "/timeline", alt: "动画年代时间线：按年代串起国产动画的黄金时代" },
  { segment: "quiz", url: "/quiz", alt: "童年浓度测试：六道题测出你的童年浓度" },
  { segment: "about", url: "/about", alt: "关于 00后动画记忆馆：不存视频，只收藏放学后的时间感" },
];

const browser = await chromium.launch();
// 1440×756 与 1200×630 同比例，保持桌面布局后再缩放
const context = await browser.newContext({ viewport: { width: 1440, height: 756 }, deviceScaleFactor: 1 });
await context.addInitScript(() => sessionStorage.setItem("museum-crt-booted", "1"));
const page = await context.newPage();

for (const hall of halls) {
  await page.goto(`${baseUrl}${hall.url}`, { waitUntil: "networkidle", timeout: 60000 });
  await page.waitForTimeout(3000);
  const png = await page.screenshot();
  const outDir = join(appDir, hall.segment);
  await sharp(png).resize({ width: 1200, height: 630 }).jpeg({ quality: 82, mozjpeg: true }).toFile(join(outDir, "opengraph-image.jpg"));
  writeFileSync(join(outDir, "opengraph-image.alt.txt"), hall.alt);
  console.log(`saved ${hall.segment || "(root)"}/opengraph-image.jpg`);
}

await browser.close();
