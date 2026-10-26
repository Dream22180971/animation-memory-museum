// README 截图：先 npm run build && npm start，再 node scripts/capture-screenshots.mjs
// 输出 docs/screenshots/*.webp（2x 截图后用 sharp 缩到 1600 宽压缩，避免仓库膨胀）
import { chromium } from "@playwright/test";
import { mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const baseUrl = process.env.BASE_URL || "http://localhost:3000";
const outDir = join(dirname(fileURLToPath(import.meta.url)), "..", "docs", "screenshots");
mkdirSync(outDir, { recursive: true });

const shots = [
  { name: "home", url: "/" },
  { name: "archive", url: "/archive" },
  { name: "detail", url: "/archive/chaoshou-wuzhuang" },
  { name: "characters", url: "/characters" },
  { name: "quotes", url: "/quotes" },
  { name: "songs", url: "/songs" },
  { name: "quiz", url: "/quiz" },
  { name: "memory-book", url: "/", anchor: "#contribute" },
];

async function save(page, name, width) {
  const png = await page.screenshot({ fullPage: false });
  await sharp(png).resize({ width }).webp({ quality: 80 }).toFile(join(outDir, `${name}.webp`));
  console.log(`saved ${name}.webp`);
}

async function open(context) {
  // CRT 开机仪式每会话只播一次；预先标记已播放，截到的是点亮后的首屏
  await context.addInitScript(() => sessionStorage.setItem("museum-crt-booted", "1"));
  return context.newPage();
}

const browser = await chromium.launch();

const desktop = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2 });
const page = await open(desktop);
for (const shot of shots) {
  await page.goto(`${baseUrl}${shot.url}`, { waitUntil: "networkidle", timeout: 60000 });
  if (shot.anchor) {
    await page.evaluate((selector) => {
      const top = document.querySelector(selector).getBoundingClientRect().top + window.scrollY;
      window.scrollTo(0, top - 80);
    }, shot.anchor);
  }
  await page.waitForTimeout(3000);
  await save(page, shot.name, 1600);
}

const mobile = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 3, isMobile: true, hasTouch: true });
const mobilePage = await open(mobile);
await mobilePage.goto(`${baseUrl}/`, { waitUntil: "networkidle", timeout: 60000 });
await mobilePage.waitForTimeout(3000);
await save(mobilePage, "mobile-home", 600);

await browser.close();
