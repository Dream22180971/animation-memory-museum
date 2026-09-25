import animationsData from "@/data/animations.json";

/**
 * 馆藏数据模型（第二阶段）。
 * 与 scripts/validate-data.mjs 的校验规则保持一致。
 */
export type ClassicQuote = {
  line: string;
  speaker: string;
  context: string;
};

export type AnimationSong = {
  name: string;
  type: string;
  singer: string;
};

export type WatchLink = {
  label: string;
  url: string;
};

export type CharacterRelation = {
  from: string;
  to: string;
  label: string;
};

export type CharacterProfile = {
  name: string;
  /** 角色定位，如「主角 · 超兽战队队长」；未核实时省略 */
  role?: string;
  /** 1-2 句人物小传；未核实时省略 */
  bio?: string;
  /** 小传的公开资料来源 */
  sourceUrl?: string;
};

export type AnimationRecord = {
  id: number;
  slug: string;
  name: string;
  year: number;
  genre: string[];
  color: string;
  description: string;
  poster: string;
  baikeUrl: string;
  /** 入馆（首次收录）日期，YYYY-MM-DD */
  addedAt: string;
  /** 制作方 */
  studio: string;
  /** 首播平台；暂未核实到公开资料时为 null */
  broadcastPlatform: string | null;
  /** 代表性角色 */
  characters: CharacterProfile[];
  /** 正版观看入口 */
  watchLinks: WatchLink[];
  classicQuotes: ClassicQuote[];
  songs: AnimationSong[];
  /** 主题曲资料来源；未核实时为 null */
  themeSongSource: string | null;
  /** 角色关系（from/to 必须是本动画 characters 成员） */
  relations: CharacterRelation[];
};

type RawAnimation = Omit<AnimationRecord, "themeSongSource" | "relations"> &
  Partial<Pick<AnimationRecord, "themeSongSource" | "relations">>;

const raw = animationsData.animations as RawAnimation[];

export const animations: AnimationRecord[] = raw.map((animation) => ({
  ...animation,
  themeSongSource: animation.themeSongSource ?? null,
  relations: animation.relations ?? [],
}));

export const getAnimationBySlug = (slug: string): AnimationRecord | undefined =>
  animations.find((animation) => animation.slug === slug);

/** 站内统一用搜索跳转，不维护会过期的具体 BV 号 */
export const bilibiliSearchUrl = (keyword: string) =>
  `https://search.bilibili.com/all?keyword=${encodeURIComponent(keyword)}`;

export const bilibiliNameSceneUrl = (name: string) => bilibiliSearchUrl(`${name} 名场面`);

export const bilibiliDanmakuUrl = (name: string) => bilibiliSearchUrl(`${name} 弹幕`);

/** 歌曲跳转统一走 B 站搜索（歌名 + 歌手），不维护会过期的 BV 号 */
export const bilibiliSongUrl = (song: { name: string; singer?: string }) =>
  bilibiliSearchUrl(song.singer ? `${song.name} ${song.singer}` : song.name);

export const quoteCount = animations.reduce(
  (total, animation) => total + animation.classicQuotes.length,
  0,
);

/** 按入馆日期倒序（同日保持数据顺序），并列时新id在前 */
const byAddedDesc = (a: AnimationRecord, b: AnimationRecord) => {
  if (a.addedAt !== b.addedAt) return a.addedAt < b.addedAt ? 1 : -1;
  return b.id - a.id;
};

/** 最新入馆的馆藏（首页「年代新近馆藏」轮播用） */
export const latestAnimations: AnimationRecord[] = [...animations]
  .sort(byAddedDesc)
  .slice(0, 6);

/** 首页统计条头像：最新入馆的 5 部，取名字首字 + 馆藏主色 */
export const statsAvatars = [...animations]
  .sort(byAddedDesc)
  .slice(0, 5)
  .map((animation) => ({
    slug: animation.slug,
    label: [...animation.name][0],
    color: animation.color,
  }));

/** 统计条「年代新近馆藏」文案：最新入馆的 3 部 */
export const recentAnimationsLabel = [...animations]
  .sort(byAddedDesc)
  .slice(0, 3)
  .map((animation) => `《${animation.name}》`)
  .join("、");

export type TimelinePeriod = {
  period: string;
  label: string;
  items: { name: string; year: number; poster: string; slug: string }[];
};

/** 每 4 年一个年代桶，起止随馆藏实际年份自动伸缩——加作品零维护 */
const BUCKET_YEARS = 4;

/** 有把握的历史命名沿用，其余桶用「N0后」这类中性说法，避免硬编朝代词露怯 */
const ERA_LABELS: Record<number, string> = {
  1999: "启蒙期",
  2003: "萌芽期",
  2007: "崛起期",
  2011: "黄金期",
  2015: "破圈期",
};

/** 年代时间线：完全由 animations[] 推导，按 BUCKET_YEARS 分桶 */
export const deriveTimeline = (): TimelinePeriod[] => {
  if (animations.length === 0) return [];
  const minYear = Math.min(...animations.map((animation) => animation.year));
  const maxYear = Math.max(...animations.map((animation) => animation.year));
  const firstBucket = Math.floor(minYear / BUCKET_YEARS) * BUCKET_YEARS;

  const periods: TimelinePeriod[] = [];
  for (let start = firstBucket; start <= maxYear; start += BUCKET_YEARS) {
    const end = start + BUCKET_YEARS - 1;
    const items = animations
      .filter((animation) => animation.year >= start && animation.year <= end)
      .sort((a, b) => a.year - b.year)
      .map((animation) => ({
        name: animation.name,
        year: animation.year,
        poster: animation.poster,
        slug: animation.slug,
      }));
    if (items.length === 0) continue;
    periods.push({
      period: `${start}-${end}`,
      label: ERA_LABELS[start] ?? `${String(start).slice(0, 3)}0后`,
      items,
    });
  }
  return periods;
};
