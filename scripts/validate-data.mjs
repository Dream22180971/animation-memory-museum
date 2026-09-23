// 馆藏数据 Schema 校验：node scripts/validate-data.mjs
// 规则与 src/lib/animations.ts 的类型保持一致，CI 与 prebuild 均会执行。
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const dataPath = join(dirname(fileURLToPath(import.meta.url)), "..", "src", "data", "animations.json");
const errors = [];
const fail = (path, message) => errors.push(`${path}: ${message}`);

const isNonEmptyString = (value) => typeof value === "string" && value.trim().length > 0;
const isHttpUrl = (value) => typeof value === "string" && /^https?:\/\/\S+$/.test(value);
const isDateString = (value) => typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value);

let data;
try {
  data = JSON.parse(readFileSync(dataPath, "utf8"));
} catch (error) {
  console.error(`❌ 无法解析 ${dataPath}: ${error.message}`);
  process.exit(1);
}

if (!Array.isArray(data.animations) || data.animations.length === 0) {
  console.error("❌ animations 必须是非空数组");
  process.exit(1);
}

const requiredFields = ["id", "slug", "name", "year", "genre", "color", "description", "poster", "baikeUrl", "addedAt", "studio", "broadcastPlatform", "characters", "watchLinks", "classicQuotes", "songs", "themeSongSource", "relations"];

const seenIds = new Set();
const seenSlugs = new Set();

data.animations.forEach((animation, index) => {
  const path = `animations[${index}]`;
  if (typeof animation !== "object" || animation === null) return fail(path, "必须是对象");

  for (const field of requiredFields) {
    if (!(field in animation)) fail(path, `缺少字段 ${field}`);
  }

  if (typeof animation.id !== "number" || !Number.isInteger(animation.id)) fail(`${path}.id`, "必须是整数");
  else if (seenIds.has(animation.id)) fail(`${path}.id`, `id 重复: ${animation.id}`);
  else seenIds.add(animation.id);

  if (!isNonEmptyString(animation.slug) || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(animation.slug)) fail(`${path}.slug`, "必须是小写短横线格式");
  else if (seenSlugs.has(animation.slug)) fail(`${path}.slug`, `slug 重复: ${animation.slug}`);
  else seenSlugs.add(animation.slug);

  if (!isNonEmptyString(animation.name)) fail(`${path}.name`, "必须是非空字符串");
  if (typeof animation.year !== "number" || animation.year < 1900 || animation.year > 2100) fail(`${path}.year`, "必须是 1900-2100 之间的年份");

  if (!Array.isArray(animation.genre) || animation.genre.length === 0 || !animation.genre.every(isNonEmptyString)) {
    fail(`${path}.genre`, "必须是非空字符串数组");
  }

  if (typeof animation.color !== "string" || !/^#[0-9a-fA-F]{6}$/.test(animation.color)) fail(`${path}.color`, "必须是 #RRGGBB 颜色值");
  if (!isNonEmptyString(animation.description)) fail(`${path}.description`, "必须是非空字符串");
  if (typeof animation.poster !== "string" || !animation.poster.startsWith("/images/")) fail(`${path}.poster`, "必须是 /images/ 开头的站内路径");
  if (!isHttpUrl(animation.baikeUrl)) fail(`${path}.baikeUrl`, "必须是 http(s) 链接");

  if (!isDateString(animation.addedAt)) fail(`${path}.addedAt`, "必须是 YYYY-MM-DD 日期");
  if (!isNonEmptyString(animation.studio)) fail(`${path}.studio`, "必须是非空字符串（制作方）");
  if (animation.broadcastPlatform !== null && !isNonEmptyString(animation.broadcastPlatform)) {
    fail(`${path}.broadcastPlatform`, "必须是非空字符串或 null（未核实时为 null）");
  }

  if (!Array.isArray(animation.characters) || animation.characters.length === 0) {
    fail(`${path}.characters`, "必须是非空数组");
  } else {
    const seenNames = new Set();
    animation.characters.forEach((character, characterIndex) => {
      const characterPath = `${path}.characters[${characterIndex}]`;
      if (typeof character !== "object" || character === null) return fail(characterPath, "必须是对象");
      if (!isNonEmptyString(character.name)) fail(`${characterPath}.name`, "必须是非空字符串");
      if (seenNames.has(character.name)) fail(`${characterPath}.name`, `「${character.name}」重复出现`);
      seenNames.add(character.name);
      for (const field of ["role", "bio"]) {
        if (character[field] !== undefined && !isNonEmptyString(character[field])) {
          fail(`${characterPath}.${field}`, "若提供必须是非空字符串");
        }
      }
      if (character.sourceUrl !== undefined && !isHttpUrl(character.sourceUrl)) {
        fail(`${characterPath}.sourceUrl`, "必须是 http(s) 链接或省略");
      }
    });
  }

  if (!Array.isArray(animation.watchLinks) || animation.watchLinks.length === 0) {
    fail(`${path}.watchLinks`, "必须是非空数组");
  } else {
    animation.watchLinks.forEach((link, linkIndex) => {
      const linkPath = `${path}.watchLinks[${linkIndex}]`;
      if (typeof link !== "object" || link === null) return fail(linkPath, "必须是对象");
      if (!isNonEmptyString(link.label)) fail(`${linkPath}.label`, "必须是非空字符串");
      if (!isHttpUrl(link.url)) fail(`${linkPath}.url`, "必须是 http(s) 链接");
    });
  }

  if (!Array.isArray(animation.classicQuotes) || animation.classicQuotes.length === 0) {
    fail(`${path}.classicQuotes`, "必须是非空数组");
  } else {
    animation.classicQuotes.forEach((quote, quoteIndex) => {
      const quotePath = `${path}.classicQuotes[${quoteIndex}]`;
      if (typeof quote !== "object" || quote === null) return fail(quotePath, "必须是对象");
      for (const field of ["line", "speaker", "context"]) {
        if (!isNonEmptyString(quote[field])) fail(`${quotePath}.${field}`, "必须是非空字符串");
      }
    });
  }

  if (!Array.isArray(animation.songs) || animation.songs.length === 0) {
    fail(`${path}.songs`, "必须是非空数组");
  } else {
    animation.songs.forEach((song, songIndex) => {
      const songPath = `${path}.songs[${songIndex}]`;
      if (typeof song !== "object" || song === null) return fail(songPath, "必须是对象");
      for (const field of ["name", "type", "singer"]) {
        if (!isNonEmptyString(song[field])) fail(`${songPath}.${field}`, "必须是非空字符串");
      }
    });
  }

  if (animation.themeSongSource !== null && !isHttpUrl(animation.themeSongSource)) {
    fail(`${path}.themeSongSource`, "必须是 http(s) 链接或 null（未核实时为 null）");
  }

  if (!Array.isArray(animation.relations)) {
    fail(`${path}.relations`, "必须是数组（可为空）");
  } else {
    const characterSet = new Set(
      Array.isArray(animation.characters)
        ? animation.characters.map((character) =>
            character && typeof character === "object" ? character.name : character,
          )
        : [],
    );
    animation.relations.forEach((relation, relationIndex) => {
      const relationPath = `${path}.relations[${relationIndex}]`;
      if (typeof relation !== "object" || relation === null) return fail(relationPath, "必须是对象");
      for (const field of ["from", "to", "label"]) {
        if (!isNonEmptyString(relation[field])) fail(`${relationPath}.${field}`, "必须是非空字符串");
      }
      if (isNonEmptyString(relation.from) && !characterSet.has(relation.from)) {
        fail(`${relationPath}.from`, `「${relation.from}」不在 characters 中`);
      }
      if (isNonEmptyString(relation.to) && !characterSet.has(relation.to)) {
        fail(`${relationPath}.to`, `「${relation.to}」不在 characters 中`);
      }
    });
  }
});

if (errors.length > 0) {
  console.error(`❌ 馆藏数据校验失败（${errors.length} 个问题）：`);
  errors.forEach((error) => console.error(` - ${error}`));
  process.exit(1);
}

console.log(`✅ 馆藏数据校验通过：${data.animations.length} 部动画，共 ${data.animations.reduce((total, animation) => total + animation.classicQuotes.length, 0)} 条台词。`);
