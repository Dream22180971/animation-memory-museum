"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpDown, ExternalLink, Library, PenLine, Search, SlidersHorizontal, Sparkles } from "lucide-react";
import animationsData from "@/data/animations.json";

const USER_CONTRIBUTIONS_KEY = "animation-memory-user-contributions";

type OfficialAnimation = (typeof animationsData.animations)[number];

type UserContribution = {
  animationName: string;
  memory: string;
  nickname: string;
  createdAt: string;
};

type ArchiveItem = {
  id: string;
  name: string;
  year: number | null;
  genres: string[];
  description: string;
  poster: string;
  source: "official" | "user";
  baikeUrl?: string;
  contributor?: string;
  createdAt?: string;
};

const allGenres = Array.from(new Set(animationsData.animations.flatMap((item) => item.genre))).sort();
const allYears = Array.from(new Set(animationsData.animations.map((item) => item.year))).sort((a, b) => b - a);

const toArchiveItem = (animation: OfficialAnimation): ArchiveItem => ({
  id: `official-${animation.id}`,
  name: animation.name,
  year: animation.year,
  genres: animation.genre,
  description: animation.description,
  poster: animation.poster,
  source: "official",
  baikeUrl: animation.baikeUrl,
});

const contributionToArchiveItem = (contribution: UserContribution, index: number): ArchiveItem => ({
  id: `user-${contribution.createdAt}-${index}`,
  name: contribution.animationName,
  year: null,
  genres: ["用户贡献"],
  description: contribution.memory,
  poster: "/images/memories/tv-room-hero-4k.jpg",
  source: "user",
  contributor: contribution.nickname,
  createdAt: contribution.createdAt,
});

export default function ArchiveExplorer() {
  const [query, setQuery] = useState("");
  const [genre, setGenre] = useState("全部类型");
  const [year, setYear] = useState("全部年份");
  const [source, setSource] = useState("全部来源");
  const [sort, setSort] = useState("最新收录");
  const [userItems, setUserItems] = useState<UserContribution[]>([]);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      try {
        const savedItems = JSON.parse(window.localStorage.getItem(USER_CONTRIBUTIONS_KEY) || "[]") as UserContribution[];
        setUserItems(savedItems);
      } catch {
        setUserItems([]);
      }
    });

    return () => window.cancelAnimationFrame(frame);
  }, []);

  const archiveItems = useMemo(() => {
    const officialItems = animationsData.animations.map(toArchiveItem);
    const contributionItems = userItems.map(contributionToArchiveItem);
    return [...officialItems, ...contributionItems];
  }, [userItems]);

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
        const matchesYear = year === "全部年份" || String(item.year ?? "待补充") === year;
        const matchesSource =
          source === "全部来源" ||
          (source === "馆藏收录" && item.source === "official") ||
          (source === "用户贡献" && item.source === "user");

        return matchesQuery && matchesGenre && matchesYear && matchesSource;
      })
      .sort((a, b) => {
        if (sort === "年份从早到晚") return (a.year ?? 9999) - (b.year ?? 9999);
        if (sort === "年份从晚到早") return (b.year ?? 0) - (a.year ?? 0);
        if (sort === "名称排序") return a.name.localeCompare(b.name, "zh-CN");
        if (sort === "最新收录" && a.source !== b.source) return a.source === "user" ? -1 : 1;
        return 0;
      });
  }, [archiveItems, genre, query, sort, source, year]);

  const userYearOptions = userItems.length > 0 ? ["待补充"] : [];
  const yearOptions = ["全部年份", ...allYears.map(String), ...userYearOptions];

  const resetFilters = () => {
    setQuery("");
    setGenre("全部类型");
    setYear("全部年份");
    setSource("全部来源");
    setSort("最新收录");
  };

  return (
    <section className="site-shell immersive-shell border border-[#c99a45]/18 bg-[#080d0f]/88 px-4 py-6 shadow-[0_30px_100px_rgba(0,0,0,.35)] backdrop-blur-sm sm:px-6 lg:px-8">
      <div className="grid gap-4 rounded-xl border border-[#c89a44]/24 bg-[#100d08]/72 p-4 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
        <label className="block">
          <span className="mb-2 flex items-center gap-2 text-xs font-black uppercase tracking-[0.28em] text-[#f3c76a]/72">
            <Search size={15} />
            Search
          </span>
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="搜索动画名、类型或回忆关键词"
            className="w-full rounded-lg border border-[#d8ac55]/24 bg-black/30 px-4 py-3 text-sm text-[#fff6e8] outline-none transition placeholder:text-[#d9c39a]/42 focus:border-[#ffd24d]/70"
          />
        </label>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <FilterSelect label="类型" value={genre} onChange={setGenre} options={["全部类型", ...allGenres]} />
          <FilterSelect label="年份" value={year} onChange={setYear} options={yearOptions} />
          <FilterSelect label="来源" value={source} onChange={setSource} options={["全部来源", "馆藏收录", "用户贡献"]} />
          <FilterSelect label="排序" value={sort} onChange={setSort} options={["最新收录", "年份从晚到早", "年份从早到晚", "名称排序"]} />
        </div>
      </div>

      <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-2 text-sm font-bold text-[#d9c39a]/82">
          <span className="inline-flex items-center gap-2 rounded-full border border-[#ffd24d]/22 bg-[#ffd24d]/10 px-3 py-1.5 text-[#ffe4a3]">
            <Library size={16} />
            {filteredItems.length} / {archiveItems.length} 条档案
          </span>
          <span className="rounded-full border border-[#d8ac55]/20 bg-black/24 px-3 py-1.5">馆藏 {animationsData.animations.length}</span>
          <span className="rounded-full border border-[#d8ac55]/20 bg-black/24 px-3 py-1.5">用户贡献 {userItems.length}</span>
        </div>
        <button
          onClick={resetFilters}
          className="inline-flex w-fit items-center gap-2 rounded-full border border-[#d8ac55]/35 px-4 py-2 text-xs font-black text-[#f4d57d] transition hover:-translate-y-0.5 hover:bg-[#f0c45d]/10"
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
              className="archive-poster group card-glow relative min-h-[330px] overflow-hidden rounded-xl border border-[#c89a44]/30 bg-[#100e0a]/78 shadow-[0_18px_52px_rgba(0,0,0,.28)]"
            >
              <div className="absolute inset-0 bg-cover bg-center transition duration-700 group-hover:scale-[1.055]" style={{ backgroundImage: `url(${item.poster})` }} />
              <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(7,8,6,.92)_0%,rgba(7,8,6,.58)_48%,rgba(7,8,6,.18)_100%),linear-gradient(180deg,rgba(7,8,6,.12)_0%,rgba(7,8,6,.94)_100%)]" />
              <div className="archive-poster-shine absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

              <div className="relative z-10 flex min-h-[330px] flex-col justify-between p-5">
                <div className="flex items-start justify-between gap-3">
                  <span className="rounded-full border border-[#ffd24d]/24 bg-black/32 px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em] text-[#ffe4a3] backdrop-blur-md">
                    {item.source === "official" ? "馆藏收录" : "用户贡献"}
                  </span>
                  <span className="rounded-full border border-[#ffd24d]/18 bg-[#ffd24d]/10 px-3 py-1 text-[10px] font-black text-[#f7d577]">
                    {item.year ?? "年份待补"}
                  </span>
                </div>

                <div>
                  <h2 className="font-hand text-4xl leading-none text-[#fff6e8] drop-shadow-[0_4px_18px_rgba(0,0,0,.6)]">{item.name}</h2>
                  <p className="mt-4 line-clamp-3 text-sm leading-6 text-[#f0ddba]/84">{item.description}</p>
                  {item.contributor ? <p className="mt-2 text-xs font-bold text-[#e6bd70]/78">回忆提供者：{item.contributor}</p> : null}

                  <div className="mt-5 flex flex-wrap gap-2">
                    {item.genres.map((itemGenre) => (
                      <span key={itemGenre} className="rounded-full border border-[#d4a54d]/36 bg-[#120d07]/60 px-2.5 py-1 text-[11px] font-bold text-[#f2c96a]">
                        {itemGenre}
                      </span>
                    ))}
                  </div>

                  <div className="mt-5 flex flex-wrap gap-2">
                    {item.baikeUrl ? (
                      <a
                        href={item.baikeUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 rounded-full border border-[#ffd24d]/34 bg-[#ffd24d]/12 px-4 py-2 text-xs font-black text-[#ffe4a3] transition hover:-translate-y-0.5 hover:border-[#ffd24d]/75 hover:bg-[#ffd24d]/22 hover:text-white"
                      >
                        百度百科
                        <ExternalLink size={14} />
                      </a>
                    ) : null}
                    <Link
                      href="/#contribute"
                      className="inline-flex items-center gap-2 rounded-full border border-[#d8ac55]/28 bg-black/24 px-4 py-2 text-xs font-black text-[#f4d57d] transition hover:-translate-y-0.5 hover:bg-[#f0c45d]/10"
                    >
                      <PenLine size={14} />
                      补充回忆
                    </Link>
                  </div>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      ) : (
        <div className="mt-6 rounded-xl border border-[#c89a44]/28 bg-[#100d08]/72 p-8 text-center">
          <Sparkles className="mx-auto text-[#ffd24d]" size={28} />
          <h2 className="font-hand mt-4 text-4xl text-[#fff6e8]">这部动画还没被找到</h2>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-[#d9c39a]/82">也许它正等你来补全。换个关键词试试，或者先去贡献一段回忆。</p>
          <Link
            href="/#contribute"
            className="mt-5 inline-flex items-center gap-2 rounded-full bg-[#f5dfad] px-5 py-3 text-sm font-black text-[#21170d] transition hover:-translate-y-0.5 hover:bg-[#ffe9ba]"
          >
            <PenLine size={16} />
            贡献这部动画
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
      <span className="mb-2 flex items-center gap-1.5 text-[10px] font-black uppercase tracking-[0.18em] text-[#f3c76a]/72">
        <ArrowUpDown size={12} />
        {label}
      </span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-lg border border-[#d8ac55]/24 bg-black/30 px-3 py-3 text-xs font-bold text-[#fff6e8] outline-none transition focus:border-[#ffd24d]/70"
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
