"use client";

import { motion } from "framer-motion";
import { Play } from "lucide-react";

export default function HeroContent() {
  const scrollToArchive = () => document.getElementById("archive")?.scrollIntoView({ behavior: "smooth" });

  return (
    <motion.div
      initial={{ opacity: 0, y: 26 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      className="max-w-[760px] pt-16 lg:pt-8"
    >
      <h1 className="hero-title font-hand leading-[1.12] text-[#fff6e6]">
        <span className="block text-[50px] sm:text-[70px] lg:text-[78px]">放学后的 <span className="text-[#ffd450]">17:30</span></span>
        <span className="mt-3 block text-[32px] sm:text-[46px] lg:text-[54px]">是我们等了很久的动画时间</span>
      </h1>
      <p className="mt-9 max-w-[500px] text-base leading-8 text-[#f7ebd4]/88">
        这里收藏着00后记忆里的国产动画，那些曾带给我们热血、感动和快乐的时光。
      </p>
      <button
        onClick={scrollToArchive}
        className="mt-10 inline-flex items-center gap-3 rounded-full bg-[#f5dfad] px-11 py-5 text-lg font-black text-[#21170d] shadow-[0_14px_40px_rgba(0,0,0,.38)] transition-all duration-300 hover:-translate-y-1 hover:bg-[#ffe9ba] hover:shadow-[0_18px_48px_rgba(245,223,173,.22)]"
      >
        <Play size={22} fill="currentColor" />
        开启回忆之旅
      </button>
    </motion.div>
  );
}
