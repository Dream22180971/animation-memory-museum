import { readFileSync, writeFileSync } from "node:fs";

const [profilesPath] = process.argv.slice(2);
if (!profilesPath) {
  console.error("用法: node scripts/merge-character-profiles.mjs <profiles.json>");
  process.exit(1);
}

const profiles = JSON.parse(readFileSync(profilesPath, "utf8"));
if (!Array.isArray(profiles)) {
  console.error("profiles.json 必须是数组");
  process.exit(1);
}

const dataPath = new URL("../src/data/animations.json", import.meta.url);
const data = JSON.parse(readFileSync(dataPath, "utf8"));

const pending = new Map(profiles.map((profile) => [`${profile.animation}::${profile.name}`, profile]));

for (const animation of data.animations) {
  animation.characters = animation.characters.map((entry) => {
    const name = typeof entry === "string" ? entry : entry.name;
    const profile = pending.get(`${animation.name}::${name}`);
    if (!profile) return typeof entry === "string" ? { name: entry } : entry;
    pending.delete(`${animation.name}::${name}`);
    const next = { name };
    if (profile.role) next.role = profile.role;
    if (profile.bio) next.bio = profile.bio;
    if (profile.sourceUrl) next.sourceUrl = profile.sourceUrl;
    return next;
  });
}

writeFileSync(dataPath, `${JSON.stringify(data, null, 2)}\n`);

const unmatched = [...pending.keys()];
console.log(`未匹配到馆藏角色的资料: ${unmatched.length ? unmatched.join(", ") : "无"}`);

const missing = data.animations.flatMap((animation) =>
  animation.characters.filter((character) => !character.bio).map((character) => `${animation.name}/${character.name}`),
);
console.log(`仍缺小传的角色: ${missing.length ? missing.join(", ") : "无"}`);
