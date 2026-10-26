import type { MetadataRoute } from "next";
import { animations } from "@/lib/animations";
import { SITE_URL } from "@/lib/constants";

const HALLS = ["archive", "characters", "quotes", "songs", "timeline", "quiz", "about"] as const;

/** 展厅固定，馆藏详情页随 animations.json 自动增减；lastModified 用入馆日期 */
export default function sitemap(): MetadataRoute.Sitemap {
  const latestAddedAt = animations.reduce((latest, animation) => (animation.addedAt > latest ? animation.addedAt : latest), "");

  return [
    { url: SITE_URL, lastModified: latestAddedAt, changeFrequency: "weekly", priority: 1 },
    ...HALLS.map((hall) => ({
      url: `${SITE_URL}${hall}`,
      lastModified: latestAddedAt,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
    ...animations.map((animation) => ({
      url: `${SITE_URL}archive/${animation.slug}`,
      lastModified: animation.addedAt,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
  ];
}
