"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Clapperboard, Quote } from "lucide-react";
import { animations, quoteCount } from "@/lib/animations";

const allQuotes = animations.flatMap((animation) =>
  animation.classicQuotes.map((quote) => ({
    ...quote,
    slug: animation.slug,
    animationName: animation.name,
    year: animation.year,
    poster: animation.poster,
    color: animation.color,
  })),
);

export default function QuoteArchive() {
  const [slug, setSlug] = useState<string>("all");

  const visibleQuotes = useMemo(
    () => (slug === "all" ? allQuotes : allQuotes.filter((quote) => quote.slug === slug)),
    [slug],
  );

  return (
    <div>
      <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="archive-kicker text-xs font-black text-[#d8ac55]/75">Quote Archive</p>
          <h1 className="retro-title mt-2 flex items-center gap-3 text-5xl text-[#fff6e8]">
            名台词档案馆 <Clapperboard size={26} className="text-[#ffd24d]" />
          </h1>
          <p className="memory-text mt-3 max-w-2xl text-base text-[#d9c39a]/82">
            口头禅、登场句和燃点台词，全部按作品归档。点开一部动画，只听它的声音。
          </p>
        </div>
        <span className="cassette-label w-fit">
          <Quote size={14} />
          {animations.length} 部馆藏 · {quoteCount} 条台词
        </span>
      </div>

      <div className="mb-4 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setSlug("all")}
          aria-pressed={slug === "all"}
          className={`tag-pill ${
            slug === "all"
              ? "border-[#ffd24d]/60 bg-[#ffd24d]/15 text-[#ffd24d]"
              : "border-[#c99a45]/20 bg-[#070806]/50 text-[#d9c39a]/70 hover:border-[#ffd24d]/30 hover:text-[#ffd24d]/80"
          }`}
        >
          全部
          <span className="ml-1 text-[10px] opacity-50">{quoteCount}</span>
        </button>
        {animations.map((item) => {
          const active = item.slug === slug;
          return (
            <button
              key={item.slug}
              type="button"
              onClick={() => setSlug(item.slug)}
              aria-pressed={active}
              className={`tag-pill ${
                active
                  ? "border-[#ffd24d]/60 bg-[#ffd24d]/15 text-[#ffd24d]"
                  : "border-[#c99a45]/20 bg-[#070806]/50 text-[#d9c39a]/70 hover:border-[#ffd24d]/30 hover:text-[#ffd24d]/80"
              }`}
            >
              {item.name}
              <span className="ml-1 text-[10px] opacity-50">{item.classicQuotes.length}</span>
            </button>
          );
        })}
      </div>

      <p className="mb-6 text-sm font-bold text-[#d9c39a]/70" role="status">
        显示 {visibleQuotes.length} / {quoteCount} 条
      </p>

      <motion.div
        layout
        className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3"
      >
        {visibleQuotes.map((quote, index) => (
          <motion.article
            layout
            key={`${quote.slug}-${quote.line}-${index}`}
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="quote-card archive-card museum-card group relative rounded-xl p-5 transition duration-300 hover:-translate-y-1.5 hover:scale-[1.015]"
            style={{ ["--quote-accent" as string]: quote.color }}
          >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_12%_8%,color-mix(in_srgb,var(--quote-accent)_28%,transparent),transparent_34%),linear-gradient(135deg,rgba(255,210,77,.07),transparent_46%)] opacity-75" />
            <div className="absolute inset-y-3 left-0 w-1 rounded-r-full bg-[var(--quote-accent)] opacity-80" />
            <div
              className="absolute right-3 top-3 h-14 w-14 rounded-lg bg-cover bg-center opacity-30 saturate-[.85] transition duration-300 group-hover:opacity-55"
              style={{ backgroundImage: `url(${quote.poster})` }}
            />
            <div className="relative z-10">
              <div className="mb-4 flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="archive-kicker line-clamp-1 text-[11px] font-black text-[#f2c96a]/72">{quote.year}</p>
                  <h2 className="mt-1 line-clamp-1 text-base font-black text-[#fff6e8]">{quote.animationName}</h2>
                </div>
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-[#ffd24d]/24 bg-black/24 text-[#ffd24d]">
                  <Quote size={17} />
                </span>
              </div>
              <blockquote className="min-h-[3.8rem] break-words text-xl font-black leading-tight text-[#fff7e8] drop-shadow-[0_3px_14px_rgba(0,0,0,.65)] [overflow-wrap:anywhere]">
                “{quote.line}”
              </blockquote>
              <footer className="mt-4 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs font-bold text-[#e6bd70]/88">
                <span>{quote.speaker}</span>
                <span className="h-1 w-1 rounded-full bg-[#ffd24d]/55" />
                <span>{quote.context}</span>
              </footer>
              <Link
                href={`/archive/${quote.slug}`}
                className="mt-4 inline-flex items-center text-xs font-black text-[#ffd24d]/80 underline-offset-4 transition hover:text-[#ffd24d] hover:underline"
              >
                查看《{quote.animationName}》档案 →
              </Link>
            </div>
          </motion.article>
        ))}
      </motion.div>
    </div>
  );
}
