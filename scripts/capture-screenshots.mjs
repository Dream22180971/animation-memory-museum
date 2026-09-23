import { chromium } from "@playwright/test";
import { mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const outDir = join(dirname(fileURLToPath(import.meta.url)), "..", "docs", "screenshots");
mkdirSync(outDir, { recursive: true });

const shots = [
  { name: "home", url: "/" },
  { name: "archive", url: "/archive" },
  { name: "characters", url: "/characters" },
  { name: "quotes", url: "/quotes" },
  { name: "quiz", url: "/quiz" },
  { name: "detail", url: "/archive/chaoshou-wuzhuang" },
];

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2 });
for (const shot of shots) {
  await page.goto(`http://localhost:3000${shot.url}`, { waitUntil: "load", timeout: 45000 });
  await page.waitForTimeout(2600);
  await page.screenshot({ path: join(outDir, `${shot.name}.png`), fullPage: false });
  console.log(`saved ${shot.name}.png`);
}
await browser.close();
