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

const PERIODS: { period: string; label: string; min: number; max: number }[] = [
  { period: "1999-2001", label: "启蒙期", min: 1999, max: 2001 },
  { period: "2003-2005", label: "萌芽期", min: 2003, max: 2005 },
  { period: "2006-2007", label: "崛起期", min: 2006, max: 2007 },
  { period: "2008-2009", label: "黄金期", min: 2008, max: 2009 },
  { period: "2010-2012", label: "巅峰期", min: 2010, max: 2012 },
];

/** 年代时间线：完全由 animations[] 推导，末尾保留「记忆仍在继续」占位 */
export const deriveTimeline = (): (TimelinePeriod & { placeholder?: boolean })[] => {
  const periods = PERIODS.map((bucket) => ({
    period: bucket.period,
    label: bucket.label,
    items: animations
      .filter((animation) => animation.year >= bucket.min && animation.year <= bucket.max)
      .sort((a, b) => a.year - b.year)
      .map((animation) => ({
        name: animation.name,
        year: animation.year,
        poster: animation.poster,
        slug: animation.slug,
      })),
  })).filter((bucket) => bucket.items.length > 0);

  return [
    ...periods,
    {
      period: "2013-2015",
      label: "延续期",
      placeholder: true,
      items: [
        {
          name: "记忆仍在继续",
          year: 2015,
          poster: "/images/memories/tv-room-hero.webp",
          slug: "",
        },
      ],
    },
  ];
};
