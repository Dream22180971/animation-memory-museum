"use client";

import { motion, type Variants } from "framer-motion";
import { Clapperboard, Quote, Sparkles } from "lucide-react";
import animations from "@/data/animations.json";

const quoteCards = animations.animations.flatMap((animation) =>
  animation.classicQuotes.map((quote) => ({
    ...quote,
    animationId: animation.id,
    animationName: animation.name,
    year: animation.year,
    poster: animation.poster,
    color: animation.color,
  })),
);

const quoteRows = [quoteCards.filter((_, index) => index % 2 === 0), quoteCards.filter((_, index) => index % 2 === 1)];

const sectionVariants: Variants = {
  hidden: { opacity: 0, y: 34 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1], staggerChildren: 0.08 },
  },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 30, scale: 0.96 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.62, ease: [0.22, 1, 0.36, 1] },
  },
};

export default function MemoryQuotes() {
  return (
    <motion.section
      id="memories"
      variants={sectionVariants}
      initial="hidden"
      animate="visible"
      className="museum-section overflow-hidden px-5 py-16 pb-24 lg:px-14 lg:pb-28"
    >
      <motion.div variants={cardVariants} className="mb-9 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="mb-3 text-xs font-black uppercase tracking-[0.34em] text-[#f3c76a]/70">Memory Sparks</p>
          <h2 className="font-hand flex items-center gap-3 text-5xl text-[#fff6e8]">
            名台词回放 <Clapperboard size={24} className="text-[#ffd24d]" />
          </h2>
          <p className="mt-4 max-w-2xl text-base leading-7 text-[#d9c39a]/82">
            每部动画都有自己的口头禅、登场句和燃点台词。这里按作品收录，方便继续补充和考据。
          </p>
        </div>
        <div className="flex w-fit items-center gap-2 rounded-full border border-[#ffd24d]/25 bg-[#ffd24d]/10 px-4 py-2 text-xs font-bold text-[#f6d47d] shadow-[0_0_32px_rgba(255,210,77,.08)]">
          <Sparkles size={15} />
          Hover 一下，台词开播
        </div>
      </motion.div>

      <div className="quote-marquee-space space-y-5">
        {quoteRows.map((row, rowIndex) => {
          const loopedQuotes = [...row, ...row];
          return (
            <motion.div
              key={rowIndex === 0 ? "quote-row-left" : "quote-row-right"}
              variants={cardVariants}
              className="quote-marquee overflow-visible"
            >
              <div className={["quote-marquee-track flex w-max gap-4 py-3", rowIndex === 1 ? "quote-marquee-track-reverse" : ""].join(" ")}>
                {loopedQuotes.map((quote, index) => (
                  <article
                    key={`${quote.animationId}-${quote.line}-${index}`}
                    className="quote-card group relative w-[270px] shrink-0 overflow-hidden rounded-xl border border-[#c89a44]/32 bg-[#100e0a]/88 p-4 shadow-[0_18px_50px_rgba(0,0,0,.3)] transition duration-300 hover:-translate-y-2 hover:scale-[1.025] hover:border-[#ffd24d]/68 hover:bg-[#151008] hover:shadow-[0_24px_70px_rgba(255,210,77,.12)] sm:w-[330px]"
                    style={{ ["--quote-accent" as string]: quote.color }}
                  >
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_12%_8%,color-mix(in_srgb,var(--quote-accent)_32%,transparent),transparent_34%),linear-gradient(135deg,rgba(255,210,77,.08),transparent_46%)] opacity-75" />
                    <div className="absolute inset-y-3 left-0 w-1 rounded-r-full bg-[var(--quote-accent)] opacity-80" />
                    <div
                      className="absolute right-3 top-3 h-16 w-16 rounded-lg bg-cover bg-center opacity-30 saturate-[.85] transition duration-300 group-hover:opacity-55"
                      style={{ backgroundImage: `url(${quote.poster})` }}
                    />
                    <div className="relative z-10">
                      <div className="mb-5 flex items-center justify-between gap-3">
                        <div className="min-w-0">
                          <p className="line-clamp-1 text-[11px] font-black uppercase tracking-[0.22em] text-[#f2c96a]/72">{quote.year}</p>
                          <h3 className="mt-1 line-clamp-1 text-base font-black text-[#fff6e8]">{quote.animationName}</h3>
                        </div>
                        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-[#ffd24d]/24 bg-black/24 text-[#ffd24d]">
                          <Quote size={17} />
                        </span>
                      </div>
                      <blockquote className="min-h-[4.9rem] break-words text-[1.35rem] font-black leading-tight text-[#fff7e8] drop-shadow-[0_3px_14px_rgba(0,0,0,.65)] [overflow-wrap:anywhere]">
                        “{quote.line}”
                      </blockquote>
                      <footer className="mt-5 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs font-bold text-[#e6bd70]/88">
                        <span>{quote.speaker}</span>
                        <span className="h-1 w-1 rounded-full bg-[#ffd24d]/55" />
                        <span>{quote.context}</span>
                      </footer>
                    </div>
                  </article>
                ))}
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.section>
  );
}
