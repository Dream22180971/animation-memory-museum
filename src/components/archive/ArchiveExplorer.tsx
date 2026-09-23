"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpDown, ExternalLink, Library, PenLine, Search, SlidersHorizontal, Sparkles } from "lucide-react";
import animationsData from "@/data/animations.json";
import PosterImage from "@/components/ui/PosterImage";

type OfficialAnimation = (typeof animationsData.animations)[number];

type ArchiveItem = {
  id: string;
  slug: string;
  name: string;
  year: number;
  genres: string[];
  description: string;
  poster: string;
  baikeUrl: string;
};

const allGenres = Array.from(new Set(animationsData.animations.flatMap((item) => item.genre))).sort();
const allYears = Array.from(new Set(animationsData.animations.map((item) => item.year))).sort((a, b) => b - a);

const toArchiveItem = (animation: OfficialAnimation): ArchiveItem => ({
  id: `official-${animation.id}`,
  slug: animation.slug,
  name: animation.name,
  year: animation.year,
  genres: animation.genre,
  description: animation.description,
  poster: animation.poster,
  baikeUrl: animation.baikeUrl,
});

export default function ArchiveExplorer() {
  const [query, setQuery] = useState("");
  const [genre, setGenre] = useState("全部类型");
  const [year, setYear] = useState("全部年份");
  const [sort, setSort] = useState("最新收录");

  // 本机回忆不再混进档案列表：那是私人册子，不是馆藏
  const archiveItems = useMemo(() => animationsData.animations.map(toArchiveItem), []);

  const filteredItems = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return archiveItems
      .filter((item) => {
        const matchesQuery =
          !normalizedQuery ||
          item.name.toLowerCase().includes(normalizedQuery) ||
          item.description.toLowerCase().includes(normalizedQuery) ||
          item.genres.some((itemGenre) => itemGenre.toLowerCase().includes(normalizedQuery));
        const matchesGenre = genre === "全部类型" || item.genres.includes(genre);
        const matchesYear = year === "全部年份" || String(item.year) === year;

        return matchesQuery && matchesGenre && matchesYear;
      })
      .sort((a, b) => {
        if (sort === "年份从早到晚") return a.year - b.year;
        if (sort === "年份从晚到早") return b.year - a.year;
        if (sort === "名称排序") return a.name.localeCompare(b.name, "zh-CN");
        return 0;
      });
  }, [archiveItems, genre, query, sort, year]);

  const yearOptions = ["全部年份", ...allYears.map(String)];

  const resetFilters = () => {
    setQuery("");
    setGenre("全部类型");
    setYear("全部年份");
    setSort("最新收录");
  };

  return (
    <section className="site-shell immersive-shell border border-[#c99a45]/18 bg-[#080d0f]/88 px-4 py-6 shadow-[0_30px_100px_rgba(0,0,0,.35)] backdrop-blur-sm sm:px-6 lg:px-8">
      <div className="museum-card grid gap-4 rounded-xl p-4 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
        <label className="block">
          <span className="archive-kicker mb-2 flex items-center gap-2 text-xs font-black text-[#f3c76a]/72">
            <Search size={15} />
            Search
          </span>
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="搜索动画名、类型或回忆关键词"
            className="retro-field w-full rounded-lg px-4 py-3 text-sm outline-none transition"
          />
        </label>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          <FilterSelect label="类型" value={genre} onChange={setGenre} options={["全部类型", ...allGenres]} />
          <FilterSelect label="年份" value={year} onChange={setYear} options={yearOptions} />
          <FilterSelect label="排序" value={sort} onChange={setSort} options={["最新收录", "年份从晚到早", "年份从早到晚", "名称排序"]} />
        </div>
      </div>

      <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-2 text-sm font-bold text-[#d9c39a]/82">
          <span className="cassette-label">
            <Library size={16} />
            已找到 {filteredItems.length} / {archiveItems.length} 条档案
          </span>
          <span className="cassette-label cassette-label-muted">馆藏 {animationsData.animations.length}</span>
        </div>
        <button
          onClick={resetFilters}
          className="retro-button retro-button-ghost w-fit text-xs"
        >
          <SlidersHorizontal size={15} />
          重置筛选
        </button>
      </div>

      {filteredItems.length > 0 ? (
        <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filteredItems.map((item, index) => (
            <motion.article
              key={item.id}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: Math.min(index * 0.035, 0.22) }}
              className="archive-poster archive-card museum-card group card-glow defer-offscreen relative min-h-[330px] rounded-xl"
            >
              <div className="archive-poster-image absolute inset-0 transition duration-700 group-hover:scale-[1.055]">
                <PosterImage src={item.poster} alt={`${item.name} 海报`} sizes="(max-width:768px) 92vw, (max-width:1280px) 46vw, 30vw" />
              </div>
              <div className="archive-poster-overlay absolute inset-0" />
              <div className="archive-poster-shine absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

              <div className="relative z-10 flex min-h-[330px] flex-col justify-between p-5">
                <div className="flex items-start justify-between gap-3">
                  <span className="cassette-label">馆藏收录</span>
                  <span className="cassette-label cassette-label-muted">
                    {item.year}
                  </span>
                </div>

                <div>
                  <h2 className="retro-title text-4xl leading-none text-[#fff6e8]">{item.name}</h2>
                  <p className="memory-text mt-4 line-clamp-3 text-sm text-[#f0ddba]/84">{item.description}</p>

                  <div className="mt-5 flex flex-wrap gap-2">
                    {item.genres.map((itemGenre) => (
                      <span key={itemGenre} className="cassette-label cassette-label-muted">
                        {itemGenre}
                      </span>
                    ))}
                  </div>

                  <div className="mt-5 flex flex-wrap gap-2">
                    <Link
                      href={`/archive/${item.slug}`}
                      className="retro-button retro-button-primary text-xs"
                    >
                      查看详情
                    </Link>
                    <a
                      href={item.baikeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="retro-button retro-button-secondary text-xs"
                    >
                      百度百科
                      <ExternalLink size={14} />
                    </a>
                    <Link
                      href="/#contribute"
                      className="retro-button retro-button-ghost text-xs"
                    >
                      <PenLine size={14} />
                      写进我的回忆册
                    </Link>
                  </div>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      ) : (
        <div className="museum-card mt-6 rounded-xl p-8 text-center">
          <Sparkles className="mx-auto text-[#ffd24d]" size={28} />
          <h2 className="retro-title mt-4 text-4xl text-[#fff6e8]">这部动画还没被找到</h2>
          <p className="memory-text mx-auto mt-3 max-w-xl text-sm text-[#d9c39a]/82">
            馆藏里还没有它。换个关键词试试，或者把它先写进你自己的回忆册。
          </p>
          <Link
            href="/#contribute"
            className="retro-button retro-button-primary mt-5 text-sm"
          >
            <PenLine size={16} />
            写进我的回忆册
          </Link>
        </div>
      )}
    </section>
  );
}

function FilterSelect({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: string[];
}) {
  return (
    <label className="block">
      <span className="archive-kicker mb-2 flex items-center gap-1.5 text-[10px] font-black text-[#f3c76a]/72">
        <ArrowUpDown size={12} />
        {label}
      </span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="retro-field w-full rounded-lg px-3 py-3 text-xs font-bold outline-none transition"
      >
        {options.map((option) => (
          <option key={option} value={option} className="bg-[#100d08] text-[#fff6e8]">
            {option}
          </option>
        ))}
      </select>
    </label>
  );
}
