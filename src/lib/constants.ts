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

/** 首页锚点展区与次要入口：桌面端不占导航位，由移动端菜单和页脚兜底 */
export const SECTION_LINKS = [
  { label: "年代时间线", href: "/#timeline" },
  { label: "动画歌曲", href: "/#songs" },
  { label: "我的回忆册", href: "/#contribute" },
  { label: "关于我们", href: "/about" },
] as const;
