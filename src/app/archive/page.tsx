import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Database, PenLine } from "lucide-react";
import ArchiveExplorer from "@/components/archive/ArchiveExplorer";
import Footer from "@/components/layout/Footer";
import Navbar from "@/components/layout/Navbar";
import FloatingRadio from "@/components/radio/FloatingRadio";
import { SITE_NAME } from "@/lib/constants";

export const metadata: Metadata = {
  title: `完整动画档案 | ${SITE_NAME}`,
  description: "浏览 00 后国产动画完整档案，按年份、类型和来源筛选馆藏收录与用户贡献的童年动画记忆。",
};

export default function ArchivePage() {
  return (
    <div className="relative min-h-screen bg-[#070806] text-[#fff3df] vignette">
      <Navbar />
      <main className="pb-16 pt-24">
        <section className="museum-card site-shell relative mb-6 rounded-2xl px-5 py-10 backdrop-blur-sm sm:px-10 lg:px-14">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_20%,rgba(255,210,77,.14),transparent_30%),radial-gradient(circle_at_86%_8%,rgba(255,126,73,.12),transparent_28%)]" />
          <div className="relative grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
            <div>
              <Link href="/" className="retro-button retro-button-ghost text-sm">
                <ArrowLeft size={17} />
                返回首页
              </Link>
              <p className="archive-kicker mt-7 text-xs font-black text-[#d8ac55]/78">Complete Archive</p>
              <h1 className="hero-title retro-title mt-4 text-5xl leading-[1.08] text-[#fff6e6] sm:text-6xl lg:text-7xl">
                完整动画档案
              </h1>
              <p className="memory-text mt-6 max-w-3xl text-base text-[#d9c39a]/84">
                这里承接首页的精选展柜，集中展示所有馆藏动画，并预留用户贡献内容。你可以按类型、年份和来源筛选，也可以搜索记忆里的关键词。
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/#contribute"
                className="retro-button retro-button-primary text-sm"
              >
                <PenLine size={17} />
                贡献动画
              </Link>
              <span className="cassette-label px-5 py-3 text-sm">
                <Database size={17} />
                持续收录中
              </span>
            </div>
          </div>
        </section>

        <ArchiveExplorer />
      </main>
      <FloatingRadio />
      <Footer />
    </div>
  );
}
