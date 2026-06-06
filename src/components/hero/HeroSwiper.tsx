"use client";

import { useEffect, useRef, useState } from "react";
import { motion, type PanInfo } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import animations from "@/data/animations.json";

export default function HeroSwiper() {
  const [current, setCurrent] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const items = animations.animations;

  useEffect(() => {
    if (!isAutoPlaying) return;
    timerRef.current = setInterval(() => {
      setCurrent((prev) => (prev + 1) % items.length);
    }, 4200);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isAutoPlaying, items.length]);

  const goTo = (idx: number) => {
    setCurrent(idx);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 8000);
  };

  const prev = () => goTo((current - 1 + items.length) % items.length);
  const next = () => goTo((current + 1) % items.length);

  const onDragEnd = (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    if (info.offset.x > 70) prev();
    if (info.offset.x < -70) next();
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 34 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.75, delay: 0.15, ease: "easeOut" }}
      className="hidden justify-end lg:flex"
    >
      <div className="relative w-[540px]">
        <div className="relative rounded-[24px] border border-[#74512a]/65 bg-gradient-to-b from-[#211912] to-[#0b0907] p-5 shadow-[0_30px_80px_rgba(0,0,0,.65)]">
          <div className="absolute -top-8 left-1/2 h-8 w-56 -translate-x-1/2 rounded-t-xl border border-b-0 border-[#4b3820]/70 bg-gradient-to-b from-[#19130e] to-[#0b0907]" />
          <div className="rounded-[18px] border-[8px] border-[#11100d] bg-[#07090a] p-2 shadow-[inset_0_0_42px_rgba(0,0,0,.95)]">
            <motion.div
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.12}
              dragMomentum={false}
              onDragEnd={onDragEnd}
              className="relative aspect-[16/10] cursor-grab overflow-hidden rounded-xl active:cursor-grabbing"
            >
              {items.map((anim, idx) => (
                <div
                  key={anim.id}
                  className="absolute inset-0 transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]"
                  style={{
                    opacity: idx === current ? 1 : 0,
                    transform: idx === current ? "scale(1)" : "scale(1.04)",
                    zIndex: idx === current ? 1 : 0,
                  }}
                >
                  <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{ backgroundImage: `url(${anim.poster})` }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/82 via-black/18 to-transparent" />
                  <div className="crt-scanlines absolute inset-0" />

                  <div className="absolute inset-x-0 bottom-0 p-5">
                    <div className="mb-2 flex items-center gap-2">
                      {anim.genre.slice(0, 2).map((g) => (
                        <span key={g} className="cassette-label cassette-label-muted">
                          {g}
                        </span>
                      ))}
                      <span className="cassette-label cassette-label-muted">{anim.year}</span>
                    </div>
                    <h3 className="retro-title text-3xl text-white">{anim.name}</h3>
                    <p className="memory-text mt-1 line-clamp-2 max-w-[420px] text-xs text-white/76">{anim.description}</p>
                  </div>
                </div>
              ))}

              <button
                onClick={prev}
                className="retro-icon-button absolute left-3 top-1/2 z-10 h-9 w-9 -translate-y-1/2 text-white/85 backdrop-blur-sm"
                aria-label="上一张海报"
              >
                <ChevronLeft size={18} />
              </button>
              <button
                onClick={next}
                className="retro-icon-button absolute right-3 top-1/2 z-10 h-9 w-9 -translate-y-1/2 text-white/85 backdrop-blur-sm"
                aria-label="下一张海报"
              >
                <ChevronRight size={18} />
              </button>

              <div className="absolute bottom-3 left-1/2 z-10 flex -translate-x-1/2 gap-1.5">
                {items.map((item, idx) => (
                  <button
                    key={item.id}
                    onClick={() => goTo(idx)}
                    aria-label={`切换到 ${item.name}`}
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      idx === current ? "w-6 bg-[#ffd24d]" : "w-1.5 bg-white/42 hover:bg-white/65"
                    }`}
                  />
                ))}
              </div>
            </motion.div>
          </div>

          <div className="mt-4 flex items-center justify-between">
            <div className="h-2 w-24 rounded-full bg-[#070604] shadow-[inset_0_2px_6px_rgba(255,255,255,.08)]" />
            <div className="flex items-center gap-4">
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
      </div>
    </motion.div>
  );
}
