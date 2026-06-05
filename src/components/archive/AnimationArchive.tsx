"use client";

import { motion, type Variants } from "framer-motion";
import { ArrowRight, Star } from "lucide-react";
import animations from "@/data/animations.json";

const sectionVariants: Variants = {
  hidden: { opacity: 0, y: 36 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1], staggerChildren: 0.08 },
  },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 34, scale: 0.96 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.62, ease: [0.22, 1, 0.36, 1] },
  },
};

export default function AnimationArchive() {
  return (
    <motion.section
      id="archive"
      variants={sectionVariants}
      initial="hidden"
      animate="visible"
      className="museum-section border-b border-[#c99a45]/12 px-4 py-14 sm:px-8 lg:px-12"
    >
      <motion.div variants={cardVariants} className="mb-9 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="mb-3 text-xs font-black uppercase tracking-[0.34em] text-[#f3c76a]/70">Classic Archive</p>
          <h2 className="font-hand flex items-center gap-3 text-5xl text-[#fff6e8]">
            经典动画档案 <Star size={24} className="text-[#ffd24d]" />
          </h2>
          <p className="mt-4 max-w-2xl text-base leading-7 text-[#d9c39a]/82">
            不做模糊截图堆叠，把每部动画整理成一张清晰、发光、适合停留的主题海报。
          </p>
        </div>
        <motion.button
          whileHover={{ x: 4, borderColor: "rgba(255,210,77,.75)" }}
          className="flex w-fit items-center gap-2 rounded-full border border-[#d8ac55]/45 bg-[#ffd24d]/8 px-5 py-2 text-sm font-bold text-[#f4d57d]"
        >
          查看全部 <ArrowRight size={16} />
        </motion.button>
      </motion.div>

      <div className="archive-wall grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {animations.animations.map((anim, index) => (
          <motion.article
            key={anim.id}
            variants={cardVariants}
            whileHover={{ y: -8, scale: 1.012 }}
            transition={{ type: "spring", stiffness: 260, damping: 24 }}
            className="archive-poster group card-glow relative min-h-[290px] overflow-hidden rounded-[1.35rem] border border-[#c89a44]/30 bg-[#100e0a]/78 shadow-[0_18px_52px_rgba(0,0,0,.28)] sm:min-h-[320px]"
          >
            <motion.div
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url(${anim.poster})` }}
              whileHover={{ scale: 1.055 }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            />
            <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(7,8,6,.9)_0%,rgba(7,8,6,.48)_42%,rgba(7,8,6,.12)_100%),linear-gradient(180deg,rgba(7,8,6,.03)_0%,rgba(7,8,6,.9)_100%)] transition-opacity duration-500 group-hover:opacity-86" />
            <div className="archive-poster-shine absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

            <div className="relative z-10 flex h-full min-h-[290px] flex-col justify-between p-5 sm:min-h-[320px] sm:p-6">
              <div className="flex items-start justify-between gap-4">
                <span className="rounded-full border border-[#ffd24d]/24 bg-black/32 px-3 py-1 text-[10px] font-black uppercase tracking-[0.22em] text-[#ffe4a3] backdrop-blur-md">
                  File {String(index + 1).padStart(2, "0")}
                </span>
                <span className="rounded-full bg-[#ffd24d]/14 px-3 py-1 text-xs font-black text-[#f7d577]">{anim.year}</span>
              </div>

              <div className="max-w-[84%]">
                <h3 className="font-hand text-4xl leading-none text-[#fff6e8] drop-shadow-[0_4px_18px_rgba(0,0,0,.6)]">
                  {anim.name}
                </h3>
                <p className="mt-4 line-clamp-2 text-sm leading-6 text-[#f0ddba]/82">{anim.description}</p>
                <div className="mt-5 flex flex-wrap gap-2">
                  {anim.genre.map((genre) => (
                    <span key={genre} className="rounded-full border border-[#d4a54d]/36 bg-[#120d07]/60 px-2.5 py-1 text-[11px] font-bold text-[#f2c96a]">
                      {genre}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </motion.article>
        ))}
      </div>
    </motion.section>
  );
}
