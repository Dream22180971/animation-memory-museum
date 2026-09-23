"use client";

import { useState, useMemo, useCallback, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X, Music, Clock, ExternalLink } from "lucide-react";
import Link from "next/link";
import animations from "@/data/animations.json";
import PosterImage from "@/components/ui/PosterImage";

const allGenres = [...new Set(animations.animations.flatMap((a) => a.genre))].sort();

const overlayVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.25 } },
  exit: { opacity: 0, transition: { duration: 0.2 } },
};

const panelVariants = {
  hidden: { opacity: 0, y: -30, scale: 0.97 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] as const } },
  exit: { opacity: 0, y: -20, scale: 0.97, transition: { duration: 0.2 } },
};

interface GlobalSearchProps {
  open: boolean;
  onClose: () => void;
}

export default function GlobalSearch({ open, onClose }: GlobalSearchProps) {
  const [query, setQuery] = useState("");
  const [activeGenre, setActiveGenre] = useState<string | null>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    return animations.animations.filter((a) => {
      const matchesQuery =
        !q ||
        a.name.toLowerCase().includes(q) ||
        a.description.toLowerCase().includes(q) ||
        a.genre.some((g) => g.toLowerCase().includes(q)) ||
        a.songs?.some(
          (s) =>
            s.name.toLowerCase().includes(q) ||
            s.singer.toLowerCase().includes(q)
        );
      const matchesGenre = !activeGenre || a.genre.includes(activeGenre);
      return matchesQuery && matchesGenre;
    });
  }, [query, activeGenre]);

  const toggleGenre = useCallback(
    (g: string) => {
      setActiveGenre((prev) => (prev === g ? null : g));
    },
    []
  );

  useEffect(() => {
    if (!open) return;
    const previouslyFocused = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const focusFrame = window.requestAnimationFrame(() => inputRef.current?.focus());
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key !== "Tab" || !panelRef.current) return;

      const focusableElements = Array.from(
        panelRef.current.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])',
        ),
      );
      const firstElement = focusableElements[0];
      const lastElement = focusableElements.at(-1);

      if (e.shiftKey && document.activeElement === firstElement) {
        e.preventDefault();
        lastElement?.focus();
      } else if (!e.shiftKey && document.activeElement === lastElement) {
        e.preventDefault();
        firstElement?.focus();
      }
    };
    window.addEventListener("keydown", handler);
    return () => {
      window.cancelAnimationFrame(focusFrame);
      window.removeEventListener("keydown", handler);
      previouslyFocused?.focus();
    };
  }, [open, onClose]);

  // Lock body scroll when open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          variants={overlayVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="fixed inset-0 z-[100] flex items-start justify-center bg-[#070806]/88 backdrop-blur-md"
          onClick={(e) => {
            if (e.target === e.currentTarget) onClose();
          }}
        >
          <motion.div
            ref={panelRef}
            variants={panelVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            role="dialog"
            aria-modal="true"
            aria-labelledby="global-search-title"
            className="museum-card relative mt-24 w-full max-w-3xl overflow-hidden rounded-2xl border border-[#c99a45]/20 bg-[#0c0b08]/95 shadow-[0_40px_120px_rgba(0,0,0,.6)]"
          >
            <h2 id="global-search-title" className="sr-only">搜索动画馆藏</h2>
            {/* Search input */}
            <div className="flex items-center gap-3 border-b border-[#c99a45]/12 px-6 py-4">
              <Search size={20} className="shrink-0 text-[#d8ac55]/70" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="搜索动画、歌曲、歌手、题材..."
                className="retro-field flex-1 bg-transparent text-base text-[#fff6e8] placeholder:text-[#d9c39a]/40"
              />
              <button
                onClick={onClose}
                className="retro-icon-button h-9 w-9 text-[#d9c39a]/60 hover:text-[#ffd24d]"
                aria-label="关闭搜索"
              >
                <X size={18} />
              </button>
            </div>

            {/* Tag cloud */}
            <div className="border-b border-[#c99a45]/12 px-6 py-4">
              <p className="archive-kicker mb-3 text-[10px] font-bold text-[#d8ac55]/60">按题材筛选</p>
              <div className="tag-cloud flex flex-wrap gap-2">
                {allGenres.map((g) => {
                  const count = animations.animations.filter((a) => a.genre.includes(g)).length;
                  const isActive = activeGenre === g;
                  return (
                    <button
                      key={g}
                      onClick={() => toggleGenre(g)}
                      className={`tag-pill ${
                        isActive
                          ? "border-[#ffd24d]/60 bg-[#ffd24d]/15 text-[#ffd24d]"
                          : "border-[#c99a45]/20 bg-[#070806]/50 text-[#d9c39a]/70 hover:border-[#ffd24d]/30 hover:text-[#ffd24d]/80"
                      }`}
                    >
                      {g}
                      <span className="ml-1 text-[10px] opacity-50">{count}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Results */}
            <div className="max-h-[50vh] overflow-y-auto px-6 py-4">
              {results.length === 0 ? (
                <div className="py-12 text-center">
                  <p className="retro-title text-2xl text-[#d9c39a]/40">没有找到相关动画</p>
                  <p className="memory-text mt-2 text-sm text-[#d9c39a]/30">试试其他关键词或清除筛选条件</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {results.map((anim) => (
                    <Link
                      key={anim.slug}
                      href={`/archive/${anim.slug}`}
                      onClick={onClose}
                      className="group flex items-center gap-4 rounded-xl border border-[#c99a45]/10 bg-[#070806]/40 p-3 transition hover:border-[#ffd24d]/20 hover:bg-[#ffd24d]/[0.03]"
                    >
                      {/* Poster thumbnail */}
                      <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-[#141008]">
                        <PosterImage src={anim.poster} alt={`${anim.name} 海报`} sizes="64px" />
                      </div>

                      {/* Info */}
                      <div className="min-w-0 flex-1">
                        <div className="flex items-baseline gap-2">
                          <h4 className="retro-title truncate text-xl text-[#fff6e8]">{anim.name}</h4>
                          <span className="cassette-label cassette-label-muted shrink-0 text-[10px]">
                            <Clock size={10} className="mr-1 inline" />
                            {anim.year}
                          </span>
                        </div>
                        <p className="memory-text mt-1 line-clamp-1 text-xs text-[#d9c39a]/60">
                          {anim.description}
                        </p>
                        <div className="mt-1.5 flex flex-wrap gap-1">
                          {anim.genre.map((g) => (
                            <span
                              key={g}
                              className="rounded border border-[#c99a45]/15 bg-[#c99a45]/8 px-1.5 py-0.5 text-[10px] text-[#d9c39a]/60"
                            >
                              {g}
                            </span>
                          ))}
                          {anim.songs && anim.songs.length > 0 && (
                            <span className="flex items-center gap-1 rounded border border-[#c99a45]/15 bg-[#c99a45]/8 px-1.5 py-0.5 text-[10px] text-[#d9c39a]/60">
                              <Music size={9} />
                              {anim.songs.length} 首
                            </span>
                          )}
                        </div>
                      </div>

                      <ExternalLink
                        size={14}
                        className="shrink-0 text-[#d9c39a]/30 transition group-hover:text-[#ffd24d]/60"
                      />
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Footer hint */}
            <div className="border-t border-[#c99a45]/10 px-6 py-3 text-center">
              <p className="text-[10px] text-[#d9c39a]/30">
                按 <kbd className="mx-0.5 rounded border border-[#c99a45]/20 bg-[#070806]/50 px-1.5 py-0.5 text-[#d9c39a]/50">ESC</kbd> 关闭
                · 按 <kbd className="mx-0.5 rounded border border-[#c99a45]/20 bg-[#070806]/50 px-1.5 py-0.5 text-[#d9c39a]/50">/</kbd> 快捷搜索
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
