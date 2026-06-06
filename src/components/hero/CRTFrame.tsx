"use client";

import { motion } from "framer-motion";
import { Play } from "lucide-react";

export default function CRTFrame() {
  return (
    <motion.div
      initial={{ opacity: 0, x: 34 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.75, delay: 0.15, ease: "easeOut" }}
      className="hidden justify-end lg:flex"
    >
      <div className="relative w-[560px]">
        <div className="absolute -left-28 top-20 h-48 w-32 rounded-lg border border-[#7a572a]/35 bg-[#140e0a]/65 shadow-2xl" />
        <div className="absolute -right-16 bottom-4 h-44 w-24 rounded-xl bg-[#1b120c] shadow-[inset_0_0_30px_rgba(0,0,0,.8)]" />
        <div className="relative rounded-[28px] border border-[#6d4d26]/55 bg-gradient-to-b from-[#1c1712] to-[#0d0a08] p-7 shadow-[0_30px_80px_rgba(0,0,0,.65)]">
          <div className="absolute -top-20 left-24 h-20 w-80 rounded-t-lg border border-[#4b3820]/70 bg-gradient-to-b from-[#15110d] to-[#080705]" />
          <div className="rounded-[20px] border-[10px] border-[#11100d] bg-[#080b0d] p-2 shadow-[inset_0_0_42px_rgba(0,0,0,.95)]">
            <div className="crt-screen-blue crt-scanlines relative grid aspect-[4/3] place-items-center overflow-hidden rounded-xl">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,transparent_35%,rgba(0,0,0,.48)_100%)]" />
              <div className="relative text-center text-[#f1d46f]">
                <div className="retro-title text-4xl crt-glow">童年不散场</div>
                <div className="retro-title mt-4 text-3xl">动画永远在播放...</div>
                <div className="archive-kicker mx-auto mt-8 inline-flex items-center gap-3 text-xl font-black">
                  <span>PLAY</span>
                  <Play size={20} fill="currentColor" />
                </div>
              </div>
            </div>
          </div>
          <div className="mt-5 flex items-center justify-end gap-4">
            {[18, 28, 18].map((size, index) => (
              <span
                key={index}
                className="rounded-full border border-[#43311b] bg-[#0b0907] shadow-[inset_0_2px_6px_rgba(255,255,255,.08)]"
                style={{ width: size, height: size }}
              />
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
