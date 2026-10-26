import { animations, quoteCount } from "@/lib/animations";
import { SITE_NAME, SITE_NAME_EN, SITE_URL } from "@/lib/constants";

// GET 路由默认不缓存；这份文件只依赖 animations.json，构建时生成一次即可
export const dynamic = "force-static";

/**
 * llms.txt（https://llmstxt.org）：给 AI 搜索 / 问答工具的站点导读，
 * 一页 Markdown 讲清这是什么、有哪些展厅、收了哪些动画，内容全部从馆藏数据生成。
 */
export function GET() {
  const years = animations.map((animation) => animation.year);
  const characterCount = animations.reduce((total, animation) => total + animation.characters.length, 0);
  const songCount = animations.reduce((total, animation) => total + animation.songs.length, 0);

  const halls = [
    ["完整动画档案", "archive", "全部馆藏，可按类型、年份筛选"],
    ["角色关系图谱", "characters", "每部动画的角色与人物关系"],
    ["名台词档案馆", "quotes", "按作品归档的经典台词"],
    ["动画歌曲", "songs", "片头曲、片尾曲与主题曲及演唱者"],
    ["动画年代时间线", "timeline", "按年代排列的馆藏"],
    ["童年浓度测试", "quiz", "六道题的怀旧小测试"],
    ["关于我们", "about", "项目说明、版权声明与致谢"],
  ];

  const lines = [
    `# ${SITE_NAME}（${SITE_NAME_EN}）`,
    "",
    `> 一座收藏国产童年动画记忆的数字博物馆：收录 ${animations.length} 部 ${Math.min(...years)}–${Math.max(...years)} 年的国产电视动画，整理了 ${characterCount} 位角色、${quoteCount} 句台词、${songCount} 首歌曲，以及各作品的正版观看入口。`,
    "",
    "本站内容为简体中文。本站不存储、不播放、不提供下载任何视频或音频，观看入口只跳转到正版平台；资料考据来自百度百科等公开来源，每部作品页均注明出处。",
    "",
    "## 展厅",
    "",
    ...halls.map(([name, path, summary]) => `- [${name}](${SITE_URL}${path}): ${summary}`),
    "",
    "## 馆藏",
    "",
    ...animations.map((animation) => {
      const facts = [
        `制作：${animation.studio}`,
        animation.broadcastPlatform ? `首播：${animation.broadcastPlatform}` : null,
        `类型：${animation.genre.join("、")}`,
        `角色：${animation.characters.map((character) => character.name).join("、")}`,
      ].filter(Boolean);
      return `- [${animation.name}（${animation.year}）](${SITE_URL}archive/${animation.slug}): ${animation.description} ${facts.join("；")}。`;
    }),
    "",
    "## 其他",
    "",
    `- [站点地图](${SITE_URL}sitemap.xml)`,
    "- 所有动画名称、海报、角色、台词与歌曲的版权归原作者及出品方所有。",
    "",
  ];

  return new Response(lines.join("\n"), {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
