import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/constants";

/**
 * 「*」已经放行所有爬虫；再把主流 AI 搜索 / 问答爬虫单独列出来，
 * 一是表明态度，二是以后若给「*」加限制，也不会误伤 AI 检索。
 */
const AI_CRAWLERS = [
  "GPTBot",
  "OAI-SearchBot",
  "ChatGPT-User",
  "ClaudeBot",
  "Claude-SearchBot",
  "Claude-User",
  "PerplexityBot",
  "Perplexity-User",
  "Google-Extended",
  "Applebot-Extended",
  "Bytespider",
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/" },
      { userAgent: AI_CRAWLERS, allow: "/" },
    ],
    sitemap: `${SITE_URL}sitemap.xml`,
  };
}
