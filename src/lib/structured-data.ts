import type { AnimationRecord } from "@/lib/animations";
import { SITE_DESCRIPTION, SITE_NAME, SITE_NAME_EN, SITE_URL } from "@/lib/constants";

/**
 * schema.org 结构化数据：让搜索引擎和 AI 搜索直接读懂「这是哪部动画、哪年、谁做的、有哪些角色」，
 * 不必从页面文案里猜。字段全部来自 animations.json，不额外编造。
 */

const absolute = (path: string) => new URL(path, SITE_URL).toString();
const animationUrl = (animation: AnimationRecord) => `${SITE_URL}archive/${animation.slug}`;

export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    alternateName: SITE_NAME_EN,
    url: SITE_URL,
    description: SITE_DESCRIPTION,
    inLanguage: "zh-CN",
  };
}

export function animationJsonLd(animation: AnimationRecord) {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "TVSeries",
        "@id": `${animationUrl(animation)}#series`,
        name: animation.name,
        url: animationUrl(animation),
        description: animation.description,
        image: absolute(animation.poster),
        genre: animation.genre,
        startDate: String(animation.year),
        inLanguage: "zh",
        countryOfOrigin: { "@type": "Country", name: "中国" },
        productionCompany: { "@type": "Organization", name: animation.studio },
        character: animation.characters.map((character) => ({
          "@type": "Person",
          name: character.name,
          ...(character.role ? { description: character.role } : {}),
        })),
        sameAs: [animation.baikeUrl],
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: SITE_NAME, item: SITE_URL },
          { "@type": "ListItem", position: 2, name: "动画档案", item: `${SITE_URL}archive` },
          { "@type": "ListItem", position: 3, name: animation.name, item: animationUrl(animation) },
        ],
      },
    ],
  };
}

export function archiveJsonLd(animations: AnimationRecord[]) {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `完整动画档案 | ${SITE_NAME}`,
    url: `${SITE_URL}archive`,
    inLanguage: "zh-CN",
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: animations.length,
      itemListElement: animations.map((animation, index) => ({
        "@type": "ListItem",
        position: index + 1,
        url: animationUrl(animation),
        name: animation.name,
      })),
    },
  };
}
