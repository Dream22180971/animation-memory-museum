import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import { Geist_Mono, Ma_Shan_Zheng, Noto_Sans_SC } from "next/font/google";
import CrtBootIntro from "@/components/hero/CrtBootIntro";
import { SITE_DESCRIPTION, SITE_NAME, SITE_URL } from "@/lib/constants";
import "./globals.css";

const notoSansSC = Noto_Sans_SC({
  variable: "--font-noto-sans-sc",
  subsets: ["latin"],
  weight: ["400", "700", "900"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const maShanZheng = Ma_Shan_Zheng({
  variable: "--font-hand",
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: SITE_NAME,
  description: SITE_DESCRIPTION,
  alternates: {
    canonical: SITE_URL,
  },
  openGraph: {
    type: "website",
    url: SITE_URL,
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
    siteName: SITE_NAME,
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
  },
};

/* 规范 §9：CRT 开机只在首页、每会话一次、reduced-motion 跳过。
   必须在 paint 前判定并挂 html[data-crt-boot]，让 body 立即压黑防闪白，
   所以用阻塞内联脚本而不是 React 组件。
   4s 保险：即使 hydration 迟迟不来（dev 冷编译/极慢网络），也不会一直黑屏。 */
const CRT_BOOT_GATE =
  'try{if(location.pathname==="/"&&!sessionStorage.getItem("museum-crt-booted")&&!matchMedia("(prefers-reduced-motion: reduce)").matches){var d=document.documentElement;d.dataset.crtBoot="on";setTimeout(function(){delete d.dataset.crtBoot},4000)}}catch(e){}';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" data-scroll-behavior="smooth" className={`${notoSansSC.variable} ${geistMono.variable} ${maShanZheng.variable}`}>
      <head>
        {/* 首屏大图是 CSS 背景，拿不到 fetchpriority，只能显式 preload */}
        <link rel="preload" href="/images/memories/tv-room-hero.webp" as="image" type="image/webp" />
        <script dangerouslySetInnerHTML={{ __html: CRT_BOOT_GATE }} />
      </head>
      <body className="min-h-screen bg-background text-foreground">
        <CrtBootIntro />
        {children}
        <Analytics />
      </body>
    </html>
  );
}
