"use client";

import { motion } from "framer-motion";
import { PenLine, Play } from "lucide-react";

const sloganVariants = [
  "这里不是动画博物馆，是我们的青春放映厅。",
  "把放学后的电视光，重新调回童年的频道。",
  "每一部动画，都是一代人的暗号。",
] as const;

export default function HeroContent() {
  const scrollToArchive = () => document.getElementById("archive")?.scrollIntoView({ behavior: "smooth" });
  const scrollToContribute = () => document.getElementById("contribute")?.scrollIntoView({ behavior: "smooth" });
  const slogan = sloganVariants[new Date().getDate() % sloganVariants.length];

  return (
    <motion.div
      initial={{ opacity: 0, y: 26 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      className="max-w-[760px] pt-12 lg:pt-0"
    >
      <h1 className="hero-title retro-title leading-[1.12] text-[#fff6e6]">
        <span className="block text-[50px] sm:text-[70px] lg:text-[78px]">
          放学后的 <span className="text-[#ffd450]">17:30</span>
        </span>
        <span className="mt-3 block text-[32px] sm:text-[46px] lg:text-[54px]">是我们等了很久的动画时间</span>
      </h1>
      <p className="memory-text mt-8 max-w-[540px] text-base text-[#f7ebd4]/88">
        这里收藏着 00 后记忆里的国产动画。把热血、感动、晚饭前的电视光，整理成一间可以慢慢逛的数字展厅。
      </p>
      <div className="mt-7 max-w-[590px] rounded-xl border border-[#ffd24d]/24 bg-black/24 px-4 py-3 text-sm font-bold leading-6 text-[#ffe2a0] shadow-[0_12px_40px_rgba(0,0,0,.22)] backdrop-blur-md">
        {slogan} 加入 8,921 位小伙伴，一起补全我们的童年动画记忆库。
      </div>
      <div className="mt-9 flex flex-wrap gap-3">
        <button
          onClick={scrollToArchive}
          className="retro-button retro-button-primary retro-button-lg sm:px-10 sm:text-lg"
        >
          <Play size={22} fill="currentColor" />
          开启回忆之旅
        </button>
        <button
          onClick={scrollToContribute}
          className="retro-button retro-button-secondary retro-button-lg"
        >
          <PenLine size={20} />
          贡献我的回忆
        </button>
      </div>
    </motion.div>
  );
}
