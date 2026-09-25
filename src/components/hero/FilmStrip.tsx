"use client";

import { useRef, useState, type PointerEvent as ReactPointerEvent, type MouseEvent as ReactMouseEvent } from "react";
import { motion, type Variants } from "framer-motion";
import { ArrowRight, Clock, Sparkles } from "lucide-react";
import Link from "next/link";
import { latestAnimations } from "@/lib/animations";
import PosterImage from "@/components/ui/PosterImage";

const latest = latestAnimations;

const sectionVariants: Variants = {
  hidden: { opacity: 0, y: 34 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] },
  },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.62, ease: [0.16, 1, 0.3, 1] },
  },
};

export default function FilmStrip() {
  const stripRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<{ startX: number; startLeft: number; moved: boolean } | null>(null);
  const suppressClickRef = useRef(false);
  const [dragged, setDragged] = useState(false);

  /* 规范 §15：用户开始拖动后，自动滚动立即停止且本次会话不再恢复 */
  const onPointerDown = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== "mouse") return;
    const el = stripRef.current;
    if (!el) return;
    dragRef.current = { startX: e.clientX, startLeft: el.scrollLeft, moved: false };
    setDragged(true);
    el.setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e: ReactPointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current;
    const el = stripRef.current;
    if (!drag || !el) return;
    const dx = e.clientX - drag.startX;
    if (Math.abs(dx) > 5) drag.moved = true;
    el.scrollLeft = drag.startLeft - dx;
  };

  const endDrag = () => {
    if (dragRef.current?.moved) suppressClickRef.current = true;
    dragRef.current = null;
  };

  const onClickCapture = (e: ReactMouseEvent) => {
    if (!suppressClickRef.current) return;
    e.preventDefault();
    e.stopPropagation();
    suppressClickRef.current = false;
  };

  return (
    <motion.section
      id="latest"
      variants={sectionVariants}
      initial="hidden"
      animate="visible"
      className="museum-section border-b border-[#c99a45]/12 px-5 py-16 lg:px-14"
    >
      <motion.div variants={cardVariants} className="mb-10 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="archive-kicker text-xs font-black text-[#d8ac55]/75">Latest Additions</p>
          <h2 className="retro-title mt-1 flex items-center gap-3 text-5xl text-[#fff6e8]">
            年代新近馆藏 <Sparkles size={24} className="text-[#ffd24d]" />
          </h2>
          <p className="memory-text mt-3 max-w-xl text-base text-[#d9c39a]/82">
            胶片缓缓向前卷，越靠前的格子里，越是刚刚归档的新鲜记忆。悬停可以停下细看。
          </p>
        </div>
        <Link href="/archive" className="retro-button retro-button-ghost text-xs">
          全部馆藏
          <ArrowRight size={14} />
        </Link>
      </motion.div>

      <motion.div variants={cardVariants}>
        <div
          ref={stripRef}
          className={`film-strip ${dragged ? "is-dragged" : ""}`}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={endDrag}
          onPointerCancel={endDrag}
          onClickCapture={onClickCapture}
        >
          <div className="film-strip-track">
            {[...latest, ...latest].map((anim, idx) => {
              const copy = idx >= latest.length;
              return (
                <Link
                  key={`${anim.slug}-${copy ? "b" : "a"}`}
                  href={`/archive/${anim.slug}`}
                  aria-hidden={copy || undefined}
                  tabIndex={copy ? -1 : undefined}
                  className="film-frame group relative block"
                >
                  <div className="relative aspect-[3/4] overflow-hidden rounded-md border border-[#c99a45]/25 bg-[#0b0908]">
                    <PosterImage
                      src={anim.poster}
                      alt={copy ? "" : `${anim.name} 海报`}
                      sizes="(max-width:640px) 60vw, 240px"
                      className="transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.03]"
                    />
                    <span className="cassette-label absolute left-2.5 top-2.5">
                      File {String((idx % latest.length) + 1).padStart(2, "0")}
                    </span>
                    <div className="absolute right-2.5 top-2.5 flex items-center gap-1 rounded-full bg-[#070806]/72 px-2.5 py-1 text-[11px] text-[#ffd24d]">
                      <Clock size={11} />
                      {anim.year}
                    </div>
                  </div>

                  <div className="mt-2.5 min-h-[86px] px-0.5">
                    <h3 className="retro-title truncate text-lg text-[#fff6e8]">{anim.name}</h3>
                    <div className="mt-1.5 flex flex-wrap gap-1.5">
                      {anim.genre.slice(0, 3).map((g) => (
                        <span key={g} className="cassette-label cassette-label-muted text-[10px]">
                          {g}
                        </span>
                      ))}
                    </div>
                    {anim.songs && anim.songs.length > 0 ? (
                      <div className="film-frame-song mt-1.5">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-[#d8ac55]/60">
                          {anim.songs[0].type}
                        </p>
                        <p className="mt-0.5 truncate text-xs text-[#fff7e8]">
                          {anim.songs[0].name}
                          <span className="ml-1 text-[#d9c39a]/50">— {anim.songs[0].singer}</span>
                        </p>
                      </div>
                    ) : null}
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </motion.div>
    </motion.section>
  );
}
