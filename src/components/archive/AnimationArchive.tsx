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
      className="museum-section min-h-[760px] border-b border-[#c99a45]/12 px-5 py-16 lg:px-14"
    >
      <motion.div variants={cardVariants} className="mb-12 flex items-end justify-between gap-6">
        <div>
          <h2 className="font-hand flex items-center gap-3 text-5xl text-[#fff6e8]">
            经典动画档案 <Star size={24} className="text-[#ffd24d]" />
          </h2>
          <p className="mt-4 text-base text-[#d9c39a]/82">那些年我们追过的国产动画神作</p>
        </div>
        <motion.button
          whileHover={{ x: 4, borderColor: "rgba(255,210,77,.75)" }}
          className="hidden items-center gap-2 rounded-full border border-[#d8ac55]/45 px-5 py-2 text-sm text-[#f4d57d] md:flex"
        >
          查看全部 <ArrowRight size={16} />
        </motion.button>
      </motion.div>

      <div className="grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-6">
        {animations.animations.map((anim) => (
          <motion.article
            key={anim.id}
            variants={cardVariants}
            whileHover={{ y: -10, scale: 1.025 }}
            transition={{ type: "spring", stiffness: 260, damping: 24 }}
            className="group min-h-[430px] overflow-hidden rounded-lg border border-[#c89a44]/38 bg-[#100e0a]/78 shadow-[0_18px_40px_rgba(0,0,0,.25)]"
          >
            <div className="relative h-[270px] overflow-hidden">
              <motion.div
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: `url(${anim.poster})` }}
                whileHover={{ scale: 1.08 }}
                transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              />
              <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#090806] to-transparent" />
            </div>
            <div className="flex min-h-[160px] flex-col p-4">
              <h3 className="truncate text-lg font-bold text-[#fff1d8]">{anim.name}</h3>
              <p className="mt-2 text-sm text-[#d9c39a]/80">{anim.year}</p>
              <p className="mt-3 line-clamp-3 text-xs leading-5 text-[#d9c39a]/68">{anim.description}</p>
              <div className="mt-auto flex flex-wrap gap-1.5 pt-4">
                {anim.genre.map((genre) => (
                  <span key={genre} className="rounded border border-[#d4a54d]/42 px-2 py-0.5 text-[11px] text-[#f2c96a]">
                    {genre}
                  </span>
                ))}
              </div>
            </div>
          </motion.article>
        ))}
      </div>

    </motion.section>
  );
}
