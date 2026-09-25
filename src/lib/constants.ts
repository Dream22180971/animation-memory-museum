export const SITE_NAME = "00后动画记忆馆";
export const SITE_NAME_EN = "Digital Childhood Museum";
export const SITE_DESCRIPTION = "放学后的 17:30，是我们等了很久的动画时间。";
export const COPYRIGHT_YEAR = 2026;
export const AUTHOR_GITHUB = "https://github.com/Dream22180971";
export const REPOSITORY_URL = "https://github.com/Dream22180971/animation-memory-museum";
export const FEEDBACK_URL = "https://github.com/Dream22180971/animation-memory-museum/issues";
export const SITE_URL = "https://museum.seanwalter.top/";

export const NAV_LINKS = [
  { label: "首页", href: "/" },
  { label: "动画档案", href: "/archive" },
  { label: "角色图谱", href: "/characters" },
  { label: "名台词", href: "/quotes" },
  { label: "童年浓度测试", href: "/quiz" },
] as const;

/** 首页锚点展区与次要入口：深展区已路由化，正片独立成页 */
export const SECTION_LINKS = [
  { label: "年代时间线", href: "/timeline" },
  { label: "动画歌曲", href: "/songs" },
  { label: "我的回忆册", href: "/#contribute" },
  { label: "关于我们", href: "/about" },
] as const;

/**
 * 首页电视机的核心频道：只轮播最有共鸣的代表作，不放全量馆藏。
 * 顺序即频道号（CH 01 起）；新增馆藏不自动进电视，需手动加到这里。
 */
export const HERO_FEATURED_SLUGS = [
  "qin-shi-ming-yue", // 秦时明月
  "kaijia-yongshi", // 铠甲勇士
  "balala-xiao-moxian", // 巴啦啦小魔仙
  "doulong-zhanshi", // 斗龙战士
  "chaoshou-wuzhuang", // 超兽武装
  "zhuzhuxia", // 猪猪侠
] as const;
