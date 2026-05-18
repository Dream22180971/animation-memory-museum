"use client";

import { motion, type Variants } from "framer-motion";
import { ChevronLeft, ChevronRight, Tv } from "lucide-react";
import animations from "@/data/animations.json";

const sectionVariants: Variants = {
  hidden: { opacity: 0, y: 34 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1], staggerChildren: 0.12 },
  },
};

const nodeVariants: Variants = {
  hidden: { opacity: 0, y: 24, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.62, ease: [0.22, 1, 0.36, 1] },
  },
};

export default function YearTimeline() {
  return (
    <motion.section
      id="timeline"
      variants={sectionVariants}
      initial="hidden"
      animate="visible"
      className="museum-section min-h-[560px] border-b border-[#c99a45]/12 px-5 py-16 lg:px-14"
    >
      <motion.div variants={nodeVariants} className="mb-14">
        <h2 className="font-hand flex items-center gap-3 text-5xl text-[#fff6e8]">
          动画年代时间线 <Tv size={24} className="text-[#ffd24d]" />
        </h2>
        <p className="mt-4 text-base text-[#d9c39a]/82">国产动画的黄金时代</p>
      </motion.div>

      <div className="relative px-9">
        <motion.button
          whileHover={{ scale: 1.08, backgroundColor: "rgba(240,196,93,.1)" }}
          className="absolute left-0 top-[84px] grid h-12 w-12 place-items-center rounded-full border border-[#c89a44]/45 text-[#f3c76a]"
        >
          <ChevronLeft size={20} />
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.08, backgroundColor: "rgba(240,196,93,.1)" }}
          className="absolute right-0 top-[84px] grid h-12 w-12 place-items-center rounded-full border border-[#c89a44]/45 text-[#f3c76a]"
        >
          <ChevronRight size={20} />
        </motion.button>

        <div className="relative overflow-x-auto pb-8 timeline-scroll">
          <div className="relative flex min-w-[900px] justify-between px-12">
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
              className="absolute left-16 right-16 top-[64px] h-[3px] origin-left bg-gradient-to-r from-[#b7832d] via-[#ff672f] to-[#dcb54b]"
            />
            {animations.timeline.map((period) => (
              <motion.div
                key={period.period}
                variants={nodeVariants}
                whileHover={{ y: -8 }}
                className="relative z-10 flex w-[160px] flex-col items-center text-center"
              >
                <div className="text-2xl font-black text-[#ffd24d]">{period.period}</div>
                <div className="mt-2 text-xs text-[#d9a45b]">{period.label}</div>
                <span className="mt-5 h-4 w-4 rounded-full bg-[#ffd24d] shadow-[0_0_18px_rgba(255,210,77,.55)]" />
                <motion.div
                  whileHover={{ scale: 1.08, rotate: -1 }}
                  className="mt-9 grid h-[112px] w-[112px] place-items-center overflow-hidden rounded-lg border border-[#d8ac55]/60 bg-[#140e09] p-1.5 shadow-[0_18px_42px_rgba(0,0,0,.35)]"
                >
                  <img src={period.items[0].poster} alt={period.items[0].name} className="h-full w-full rounded-md object-cover" />
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </motion.section>
  );
}
