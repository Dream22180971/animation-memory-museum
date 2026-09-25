"use client";

import { useEffect, useRef, useState } from "react";
import { motion, type PanInfo } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import animations from "@/data/animations.json";
import { HERO_FEATURED_SLUGS } from "@/lib/constants";
import PosterImage from "@/components/ui/PosterImage";

/** 电视里只播核心频道（顺序即 CH 号），不轮全量馆藏 */
const items = HERO_FEATURED_SLUGS.map(
  (slug) => animations.animations.find((anim) => anim.slug === slug)!,
).filter(Boolean);

export default function HeroSwiper() {
  const [current, setCurrent] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [channeling, setChanneling] = useState(false);
  const [badgeVisible, setBadgeVisible] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const noiseTimerRef = useRef<NodeJS.Timeout | null>(null);
  const badgeTimerRef = useRef<NodeJS.Timeout | null>(null);
  const mountedRef = useRef(false);

  useEffect(() => {
    if (!isAutoPlaying) return;
    timerRef.current = setInterval(() => {
      setCurrent((prev) => (prev + 1) % items.length);
    }, 6000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isAutoPlaying]);

  /* 规范 §14 换台：Poster → 90ms 雪花 → CH 角标 → 下一张；角标停留 1.4s 后淡出 */
  useEffect(() => {
    if (!mountedRef.current) {
      mountedRef.current = true;
      return;
    }
    setChanneling(true);
    setBadgeVisible(true);
    if (noiseTimerRef.current) clearTimeout(noiseTimerRef.current);
    if (badgeTimerRef.current) clearTimeout(badgeTimerRef.current);
    noiseTimerRef.current = setTimeout(() => setChanneling(false), 380);
    badgeTimerRef.current = setTimeout(() => setBadgeVisible(false), 1400);
    return () => {
      if (noiseTimerRef.current) clearTimeout(noiseTimerRef.current);
      if (badgeTimerRef.current) clearTimeout(badgeTimerRef.current);
    };
  }, [current]);

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
      transition={{ duration: 0.75, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
      className="hidden justify-end lg:flex"
    >
      <div className="relative w-[560px]">
        <div className="relative rounded-[24px] border border-[#74512a]/65 bg-gradient-to-b from-[#211912] to-[#0b0907] p-5 shadow-[0_30px_80px_rgba(0,0,0,.65)]">
          <div className="absolute -top-8 left-1/2 h-8 w-56 -translate-x-1/2 rounded-t-xl border border-b-0 border-[#4b3820]/70 bg-gradient-to-b from-[#19130e] to-[#0b0907]" />
          <div className="rounded-[18px] border-[8px] border-[#11100d] bg-[#07090a] p-2 shadow-[inset_0_0_42px_rgba(0,0,0,.95)]">
            <motion.div
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.12}
              dragMomentum={false}
              onDragEnd={onDragEnd}
              onMouseEnter={() => setIsAutoPlaying(false)}
              onMouseLeave={() => setIsAutoPlaying(true)}
              className="relative aspect-[4/3] cursor-grab overflow-hidden rounded-xl active:cursor-grabbing"
            >
              {/* 海报层：换台瞬间整体做 RGB 分离，按钮/角标不受影响 */}
              <div className={`absolute inset-0 ${channeling ? "channel-rgb" : ""}`}>
                {items.map((anim, idx) => (
                  <div
                    key={anim.id}
                    className="absolute inset-0 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]"
                    style={{
                      opacity: idx === current ? 1 : 0,
                      transform: idx === current ? "scale(1)" : "scale(1.04)",
                      zIndex: idx === current ? 1 : 0,
                    }}
                  >
                  {/* 竖版海报 contain 后两侧留边：同图模糊放大垫底，像屏幕发光而不是死黑 */}
                  <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
                    <PosterImage
                      src={anim.poster}
                      alt=""
                      sizes="560px"
                      className="scale-110 opacity-35 blur-xl"
                    />
                  </div>
                  <PosterImage
                    src={anim.poster}
                    alt={`${anim.name} 海报`}
                    preload={idx === 0}
                    sizes="560px"
                    fit="contain"
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
              </div>

              <div className={`tv-static ${channeling ? "is-channeling" : ""}`} aria-hidden="true" />
              <div
                className={`tv-channel-badge ${badgeVisible ? "is-visible" : ""}`}
                aria-hidden="true"
              >
                CH {String(current + 1).padStart(2, "0")}
              </div>

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
