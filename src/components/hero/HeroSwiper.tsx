"use client";

import { useCallback, useEffect, useRef, useState, type KeyboardEvent as ReactKeyboardEvent } from "react";
import { motion, type PanInfo } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import animations from "@/data/animations.json";
import { HERO_FEATURED_SLUGS } from "@/lib/constants";
import PosterImage from "@/components/ui/PosterImage";

/** 电视里只播核心频道（顺序即 CH 号），不轮全量馆藏 */
const items = HERO_FEATURED_SLUGS.map(
  (slug) => animations.animations.find((anim) => anim.slug === slug)!,
).filter(Boolean);

/** 面板旋钮：左右是频道 −/+，中间大旋钮（delta 0）随机换台 */
const KNOBS = [
  { size: 18, label: "上一个频道", delta: -1 },
  { size: 28, label: "随机换台", delta: 0 },
  { size: 18, label: "下一个频道", delta: 1 },
] as const;

/** 随机换台的步长：1…n-1，永远换到另一个频道，不会原地踩空 */
const randomChannelStep = () => 1 + Math.floor(Math.random() * (items.length - 1));

const channelLabel = (idx: number) => `CH ${String(idx + 1).padStart(2, "0")}`;

const isOnScreen = (el: HTMLElement | null) => {
  const rect = el?.getBoundingClientRect();
  return Boolean(rect && rect.width > 0 && rect.bottom > 0 && rect.top < window.innerHeight);
};

/** 正在打字（搜索框、表单）时，数字键和方向键不能被电视抢走 */
const isTypingTarget = (target: EventTarget | null) =>
  target instanceof HTMLElement &&
  (target.isContentEditable || ["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName));

export default function HeroSwiper() {
  const [current, setCurrent] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [channeling, setChanneling] = useState(false);
  const [badgeVisible, setBadgeVisible] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const noiseTimerRef = useRef<NodeJS.Timeout | null>(null);
  const badgeTimerRef = useRef<NodeJS.Timeout | null>(null);
  const resumeTimerRef = useRef<NodeJS.Timeout | null>(null);
  const mountedRef = useRef(false);
  const tvRef = useRef<HTMLDivElement | null>(null);
  const [announcement, setAnnouncement] = useState("");

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

  /* 手动换台：暂停自动轮播 8s，并给读屏播报「CH 0X · 片名」；自动轮播不播报，免得一直打断 */
  const goTo = useCallback((idx: number) => {
    setCurrent(idx);
    setAnnouncement(`${channelLabel(idx)} · ${items[idx].name}`);
    setIsAutoPlaying(false);
    if (resumeTimerRef.current) clearTimeout(resumeTimerRef.current);
    resumeTimerRef.current = setTimeout(() => setIsAutoPlaying(true), 8000);
  }, []);

  useEffect(() => () => {
    if (resumeTimerRef.current) clearTimeout(resumeTimerRef.current);
  }, []);

  const step = useCallback(
    (delta: number) => goTo((current + delta + items.length) % items.length),
    [current, goTo],
  );
  const prev = () => step(-1);
  const next = () => step(1);

  /* 电视在视口里时才接管数字键 1–6；移动端电视 display:none，尺寸为 0 也算不可见 */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.defaultPrevented || e.ctrlKey || e.metaKey || e.altKey || isTypingTarget(e.target)) return;
      if (!isOnScreen(tvRef.current)) return;
      const channel = Number(e.key);
      if (Number.isInteger(channel) && channel >= 1 && channel <= items.length) {
        e.preventDefault();
        goTo(channel - 1);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [goTo]);

  /* 方向键只在焦点落在电视里时换台，否则照常滚动页面 */
  const onTvKeyDown = (e: ReactKeyboardEvent<HTMLDivElement>) => {
    if (e.ctrlKey || e.metaKey || e.altKey) return;
    const delta = { ArrowUp: 1, ArrowRight: 1, ArrowDown: -1, ArrowLeft: -1 }[e.key];
    if (!delta) return;
    e.preventDefault();
    step(delta);
  };

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
      <div
        ref={tvRef}
        role="group"
        aria-roledescription="电视"
        aria-label="馆藏电视：数字键 1–6 换台，焦点在电视里时可用方向键"
        tabIndex={-1}
        onKeyDown={onTvKeyDown}
        className="relative w-[560px] outline-none"
      >
        <p className="sr-only" aria-live="polite" aria-atomic="true">
          {announcement}
        </p>
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
                {channelLabel(current)}
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

          <div className="mt-4 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="h-2 w-24 rounded-full bg-[#070604] shadow-[inset_0_2px_6px_rgba(255,255,255,.08)]" />
              <p className="font-mono text-[10px] tracking-[.18em] text-[#d9c39a]/45" aria-hidden="true">
                按 1–{items.length} 换台
              </p>
            </div>
            <div className="flex items-center gap-4">
              {KNOBS.map(({ size, label, delta }) => (
                <button
                  key={label}
                  type="button"
                  onClick={() => step(delta === 0 ? randomChannelStep() : delta)}
                  aria-label={label}
                  title={label}
                  className="tv-knob rounded-full border border-[#43311b] bg-[#0b0907] shadow-[inset_0_2px_6px_rgba(255,255,255,.08)]"
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
