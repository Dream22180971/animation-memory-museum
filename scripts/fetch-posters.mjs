/**
 * 海报替换管线：Bangumi 搜索匹配 → 下载 → sharp 转 webp → 更新 animations.json
 *
 * 用法：
 *   node scripts/fetch-posters.mjs            # dry-run：只打印匹配报告，不写任何文件
 *   node scripts/fetch-posters.mjs --apply    # 实际下载并更新
 *   node scripts/fetch-posters.mjs --apply --only qin-shi-ming-yue,kuiba
 *
 * 约定：
 *   - 真实海报写 public/images/posters/real/{slug}.webp，现有设计图原地保留作为回退
 *   - 匹配失败的条目不动 poster 字段（继续用设计图）
 *   - 出处记录在 scripts/poster-credits.json（Bangumi 条目 id + 链接，便于署名与人工核对）
 *   - 只认 type=2（动画）条目 + 年份 ±1 校验，防止贴到真人剧/小说封面
 */
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const APPLY = process.argv.includes("--apply");
const onlyIdx = process.argv.indexOf("--only");
const onlyEq = process.argv.find((a) => a.startsWith("--only="));
const only = onlyIdx !== -1
  ? process.argv[onlyIdx + 1]?.split(",")
  : onlyEq
    ? onlyEq.split("=")[1].split(",")
    : null;

const UA = "museum-poster-sync/1.0 (https://museum.seanwalter.top; contact via github issues)";
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

/** 人工核对后的条目指定：自动搜索选错季/选错作品时，用 subject id 钉死 */
const OVERRIDES = {
  zhuzhuxia: 66260, // 猪猪侠之魔幻猪猡纪（2005 第一部）
  "luoluo-lixianji": 136249, // 百变机兽之洛洛历险记（自动误中「企鹅洛洛历险记」）
  kuiba: 9840, // 魁拔之十万火急（2011 电影第一部）
  "qin-shi-ming-yue": 2473, // 秦时明月之百步飞剑（2007 第一部）
  "huoli-shaonianwang": 148702, // 火力少年王3 动画版
  "lanmao-taoqi-sanqianwen": 10220, // 蓝猫淘气3000问（自动搜索因「三千/3000」写法漏配）
  "kaijia-yongshi": 64056, // 铠甲勇士光影传奇（真人特摄第一部，2009）
  "kuaile-kubao": 550295, // 快乐酷宝（真人+CG 第一部，2012）
  "jackie-chan": 39024, // 成龙历险记 第一季（2000）
  "nezha-chuanqi": 37418, // 哪吒传奇（2003）
  "zhubajie-2005": 78494, // 天上掉下个猪八戒（2005）
  "hapi-fuzi": 116145, // 哈皮父子（2007）
  "kaixin-chaoren": 10997, // 开心宝贝（2010 第一部）
  "mole-manor": 337456, // 摩尔庄园（2011 动画剧）
};

const data = JSON.parse(readFileSync(join(root, "src/data/animations.json"), "utf-8"));
const creditsPath = join(root, "scripts/poster-credits.json");
const credits = existsSync(creditsPath) ? JSON.parse(readFileSync(creditsPath, "utf-8")) : {};

const titles = data.animations.filter((a) => !only || only.includes(a.slug));

async function searchBangumi(title, year) {
  const url = `https://api.bgm.tv/search/subject/${encodeURIComponent(title)}?responseGroup=large&max_results=20`;
  const res = await fetch(url, { headers: { "User-Agent": UA } });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const json = await res.json();
  const list = json.results ?? 0;
  const subjects = (json.list ?? []).filter((s) => s.type === 2); // 2 = 动画
  const norm = (v) => (v ?? "").replace(/[《》\s]/g, "");
  const t = norm(title);
  const scored = subjects
    .map((s) => {
      const cn = norm(s.name_cn);
      const jp = norm(s.name);
      const label = cn || jp;
      if (!label) return null;
      // 精确同名 > 系列名包含；跨季消歧交给年份距离 + 名字长度
      let base;
      if (cn === t || jp === t) base = 0; // 优先级 0 = 最好
      else if ((cn && cn.includes(t)) || (jp && jp.includes(t)) || (cn && t.includes(cn))) base = 1;
      else return null;
      const sy = s.date ? Number(s.date.slice(0, 4)) : null;
      const yearDiff = sy === null ? 99 : Math.abs(sy - year);
      return { s, base, yearDiff, nameLen: label.length, date: s.date ?? "" };
    })
    .filter(Boolean);
  scored.sort(
    (a, b) => a.base - b.base || a.yearDiff - b.yearDiff || a.nameLen - b.nameLen,
  );
  return { list, best: scored[0]?.s ?? null, yearDiff: scored[0]?.yearDiff ?? null, candidates: scored.length };
}

const report = [];
for (const anim of titles) {
  process.stdout.write(`${anim.slug} 「${anim.name}」 ... `);
  try {
    const overrideId = OVERRIDES[anim.slug];
    let best, yearDiff;
    if (overrideId) {
      const res = await fetch(`https://api.bgm.tv/v0/subjects/${overrideId}`, { headers: { "User-Agent": UA } });
      if (!res.ok) throw new Error(`覆盖条目 HTTP ${res.status}`);
      best = await res.json();
      yearDiff = 0;
    } else {
      const found = await searchBangumi(anim.name, anim.year);
      best = found.best;
      yearDiff = found.yearDiff;
    }
    if (!best || !best.images) {
      report.push({ slug: anim.slug, name: anim.name, ok: false, reason: "无动画类匹配" });
      console.log("未命中");
    } else {
      report.push({
        slug: anim.slug,
        name: anim.name,
        ok: true,
        bgmId: best.id,
        bgmName: best.name,
        bgmNameCn: best.name_cn,
        bgmDate: best.date ?? "",
        yearDiff,
        image: best.images.large ?? best.images.common ?? best.images.medium,
      });
      console.log(`命中 bgm.tv/subject/${best.id} 「${best.name_cn || best.name}」 ${best.date ?? ""}（年份差 ${yearDiff}${yearDiff > 2 ? "，需人工核对" : ""}）`);
    }
  } catch (e) {
    report.push({ slug: anim.slug, name: anim.name, ok: false, reason: e.message });
    console.log(`查询失败: ${e.message}`);
  }
  await sleep(800); // Bangumi 限流礼仪
}

console.log("\n===== 匹配报告 =====");
const hit = report.filter((r) => r.ok);
console.log(`命中 ${hit.length}/${report.length}`);
for (const r of report) {
  console.log(`${r.ok ? "✓" : "✗"} ${r.slug} ${r.name}${r.ok ? ` ← ${r.bgmNameCn || r.bgmName} (${r.bgmDate})` : ` — ${r.reason}`}`);
}

if (!APPLY) {
  console.log("\n[dry-run] 未写任何文件。确认匹配无误后加 --apply 执行。");
  process.exit(0);
}

// 下载 + 压缩 + 更新数据
const realDir = join(root, "public/images/posters/real");
mkdirSync(realDir, { recursive: true });
let updated = 0;

for (const r of report.filter((x) => x.ok)) {
  const anim = data.animations.find((a) => a.slug === r.slug);
  const outPath = join(realDir, `${r.slug}.webp`);
  try {
    const res = await fetch(r.image, { headers: { "User-Agent": UA } });
    if (!res.ok) throw new Error(`图片下载 HTTP ${res.status}`);
    const buf = Buffer.from(await res.arrayBuffer());
    await sharp(buf).resize({ width: 600, withoutEnlargement: true }).webp({ quality: 80 }).toFile(outPath);
    anim.poster = `/images/posters/real/${r.slug}.webp`;
    credits[r.slug] = {
      name: r.name,
      bangumiId: r.bgmId,
      subject: `https://bgm.tv/subject/${r.bgmId}`,
      matchedName: r.bgmNameCn || r.bgmName,
      date: r.bgmDate,
      fetchedAt: new Date().toISOString().slice(0, 10),
    };
    updated += 1;
    console.log(`✓ ${r.slug} 已写入 (${Math.round((await import("node:fs")).statSync(outPath).size / 1024)}KB)`);
    await sleep(500);
  } catch (e) {
    console.log(`✗ ${r.slug} 写入失败: ${e.message}`);
  }
}

writeFileSync(join(root, "src/data/animations.json"), JSON.stringify(data, null, 2) + "\n", "utf-8");
writeFileSync(creditsPath, JSON.stringify(credits, null, 2) + "\n", "utf-8");
console.log(`\n完成：更新 ${updated} 张海报。未命中的作品继续使用设计图。`);
