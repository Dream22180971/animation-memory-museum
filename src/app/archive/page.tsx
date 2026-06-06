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
        <section className="site-shell relative mb-6 overflow-hidden rounded-2xl border border-[#c99a45]/18 bg-[#080d0f]/88 px-5 py-10 shadow-[0_30px_100px_rgba(0,0,0,.35)] backdrop-blur-sm sm:px-10 lg:px-14">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_20%,rgba(255,210,77,.14),transparent_30%),radial-gradient(circle_at_86%_8%,rgba(255,126,73,.12),transparent_28%)]" />
          <div className="relative grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
            <div>
              <Link href="/" className="inline-flex items-center gap-2 text-sm font-bold text-[#f4d57d] transition hover:text-[#fff6e8]">
                <ArrowLeft size={17} />
                返回首页
              </Link>
              <p className="mt-7 text-xs font-black uppercase tracking-[0.36em] text-[#d8ac55]/78">Complete Archive</p>
              <h1 className="hero-title font-hand mt-4 text-5xl leading-[1.08] text-[#fff6e6] sm:text-6xl lg:text-7xl">
                完整动画档案
              </h1>
              <p className="mt-6 max-w-3xl text-base leading-8 text-[#d9c39a]/84">
                这里承接首页的精选展柜，集中展示所有馆藏动画，并预留用户贡献内容。你可以按类型、年份和来源筛选，也可以搜索记忆里的关键词。
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/#contribute"
                className="inline-flex items-center gap-2 rounded-full bg-[#f5dfad] px-5 py-3 text-sm font-black text-[#21170d] transition hover:-translate-y-0.5 hover:bg-[#ffe9ba]"
              >
                <PenLine size={17} />
                贡献动画
              </Link>
              <span className="inline-flex items-center gap-2 rounded-full border border-[#ffd24d]/28 bg-[#ffd24d]/10 px-5 py-3 text-sm font-black text-[#ffe4a3]">
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
