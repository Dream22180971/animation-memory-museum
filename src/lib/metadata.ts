import type { Metadata } from "next";
import { SITE_NAME, SITE_URL } from "@/lib/constants";

type PageMetadataInput = {
  /** 展厅名，不含站名；最终标题是「展厅名 | 站名」 */
  title: string;
  description: string;
  /** 不带开头斜杠的路径，例如 "archive/zhuzhuxia" */
  path: string;
  /** 不传则使用该路由段的 opengraph-image 文件 */
  images?: string[];
};

/**
 * 子页面的 openGraph / twitter 会整体覆盖根布局（浅合并），
 * 不在这里补齐 siteName、type，分享卡片就会退回首页标题。
 */
export function pageMetadata({ title, description, path, images }: PageMetadataInput): Metadata {
  const fullTitle = `${title} | ${SITE_NAME}`;
  const url = `${SITE_URL}${path}`;

  return {
    title: fullTitle,
    description,
    alternates: { canonical: url },
    openGraph: {
      type: "website",
      url,
      title: fullTitle,
      description,
      siteName: SITE_NAME,
      ...(images ? { images } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      ...(images ? { images } : {}),
    },
  };
}
