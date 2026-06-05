"use client";

import { motion, type Variants } from "framer-motion";
import { Heart, Sparkles } from "lucide-react";
import animations from "@/data/animations.json";

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
            你还记得吗？ <Heart size={24} className="text-[#ffd24d]" />
          </h2>
          <p className="mt-4 max-w-2xl text-base leading-7 text-[#d9c39a]/82">
            把那些一听就起鸡皮疙瘩的片段，做成一面清楚、有光、能停留的回忆墙。
          </p>
        </div>
        <div className="flex w-fit items-center gap-2 rounded-full border border-[#ffd24d]/25 bg-[#ffd24d]/10 px-4 py-2 text-xs font-bold text-[#f6d47d] shadow-[0_0_32px_rgba(255,210,77,.08)]">
          <Sparkles size={15} />
          Hover 一下，童年开播
        </div>
      </motion.div>

      <div className="memory-collage grid auto-rows-[210px] grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        {animations.memories.map((memory, index) => {
          const featured = index === 0;
          return (
            <motion.article
              key={memory.image}
              variants={cardVariants}
              whileHover={{ y: -8, rotateX: 2, rotateY: featured ? -3 : 3, scale: featured ? 1.012 : 1.02 }}
              transition={{ type: "spring", stiffness: 260, damping: 24 }}
              className={[
                "memory-card group card-glow relative overflow-hidden rounded-xl border border-[#c89a44]/32 bg-[#100e0a]/78 shadow-[0_18px_50px_rgba(0,0,0,.28)]",
                featured ? "md:col-span-2 md:row-span-2" : "",
              ].join(" ")}
            >
              <motion.div
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: `url(${memory.image})` }}
                whileHover={{ scale: featured ? 1.055 : 1.08 }}
                transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
              />
              <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(7,8,6,.03)_0%,rgba(7,8,6,.48)_45%,rgba(7,8,6,.94)_100%)]" />
              <div className="memory-card-shine absolute inset-0 opacity-0 mix-blend-screen transition-opacity duration-500 group-hover:opacity-100" />
              <div className="absolute left-4 top-4 rounded-full border border-white/15 bg-black/35 px-3 py-1 text-[10px] font-black uppercase tracking-[0.24em] text-[#ffe4a3] backdrop-blur-md">
                Tape {String(index + 1).padStart(2, "0")}
              </div>

              <div className="relative z-10 flex h-full flex-col justify-end p-5 sm:p-6">
                <p
                  className={[
                    "break-words font-black leading-snug text-[#fff7e8] drop-shadow-[0_3px_14px_rgba(0,0,0,.65)] [overflow-wrap:anywhere]",
                    featured ? "line-clamp-3 max-w-2xl text-[1.45rem] sm:text-2xl md:line-clamp-none md:text-3xl" : "line-clamp-3 text-base sm:text-lg",
                  ].join(" ")}
                >
                  “{memory.quote}”
                </p>
                <div className="mt-4 flex items-center gap-3 text-xs font-bold text-[#e6bd70]/85">
                  <span className="h-px w-8 bg-[#ffd24d]/55" />
                  <span className={featured ? "text-sm" : "line-clamp-1"}>{memory.attribution}</span>
                </div>
              </div>
            </motion.article>
          );
        })}
      </div>
    </motion.section>
  );
}
