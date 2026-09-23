import { existsSync, mkdirSync, statSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const root = join(dirname(fileURLToPath(import.meta.url)), "..", "public");

/** 首屏曾经要拉 ~19MB 原图，大陆链路实测只有 ~20KB/s，页面直接白屏 */
const targets = [
  ...["armor-hero", "pig-hero", "fruit-robots", "robot-adventure", "rainbow-rabbit", "magic-warrior"].map((name) => ({
    from: `images/posters/${name}-hd.png`,
    to: `images/posters/${name}.webp`,
    width: 1000,
    quality: 78,
  })),
  { from: "images/memories/tv-room-hero-4k.jpg", to: "images/memories/tv-room-hero.webp", width: 1600, quality: 72 },
];

let before = 0;
let after = 0;

for (const target of targets) {
  const src = join(root, target.from);
  const dest = join(root, target.to);
  if (!existsSync(src)) {
    console.log(`跳过 ${target.from}（原图已从工作区移除，仅存于 git 历史）`);
    continue;
  }
  mkdirSync(dirname(dest), { recursive: true });
  await sharp(src).resize({ width: target.width, withoutEnlargement: true }).webp({ quality: target.quality }).toFile(dest);
  const fromBytes = statSync(src).size;
  const toBytes = statSync(dest).size;
  before += fromBytes;
  after += toBytes;
  console.log(
    `${target.from} → ${target.to}  ${(fromBytes / 1048576).toFixed(2)}MB → ${(toBytes / 1024).toFixed(0)}KB`,
  );
}

console.log(`合计 ${(before / 1048576).toFixed(1)}MB → ${(after / 1048576).toFixed(2)}MB`);
