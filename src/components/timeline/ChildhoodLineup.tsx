"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Backpack, CheckCircle2, Download } from "lucide-react";
import { animations } from "@/lib/animations";
import { SITE_NAME } from "@/lib/constants";
import { useUrlParam } from "@/lib/use-url-param";
import { CARD_PADDING, CARD_WIDTH, renderShareCard, shareOrDownloadCard, wrapLines } from "@/lib/share-card";

/** 小学六年：入学当年到第六年 */
const SCHOOL_YEARS = 6;

const minYear = Math.min(...animations.map((animation) => animation.year));
const maxYear = Math.max(...animations.map((animation) => animation.year));
/** 入学年份往前多给几年：入学前首播的作品，小学时多半还在重播 */
const entryYears = Array.from({ length: maxYear - (minYear - SCHOOL_YEARS + 1) + 1 }, (_, i) => maxYear - i);

const lineupFor = (entry: number) =>
  animations
    .filter((animation) => animation.year >= entry && animation.year < entry + SCHOOL_YEARS)
    .sort((a, b) => a.year - b.year || a.id - b.id);

type CardState = "idle" | "busy" | "done" | "error";

function drawLineupCard(entry: number, names: string[]) {
  return renderShareCard((ctx) => {
    ctx.fillStyle = "rgba(255,210,77,.78)";
    ctx.font = "700 22px 'Noto Sans SC', sans-serif";
    ctx.fillText("我的童年片单 · DIGITAL CHILDHOOD MUSEUM", CARD_PADDING, 130);

    ctx.fillStyle = "#fff6e8";
    ctx.font = "900 58px 'Noto Sans SC', serif";
    ctx.fillText(`${entry} 年上小学`, CARD_PADDING, 218);

    ctx.fillStyle = "#d9c39a";
    ctx.font = "700 28px 'Noto Sans SC', sans-serif";
    ctx.fillText(`${entry}–${entry + SCHOOL_YEARS - 1} 年首播的国产动画，一共 ${names.length} 部：`, CARD_PADDING, 276);

    /* 卡片只放得下四行：片单太长就列前 12 部，剩下的用「等 N 部」收尾 */
    const shown = names.slice(0, 12).map((name) => `《${name}》`).join("");
    const text = names.length > 12 ? `${shown}等 ${names.length} 部` : shown;
    ctx.fillStyle = "#ffd24d";
    ctx.font = "900 40px 'Noto Sans SC', serif";
    wrapLines(ctx, text, CARD_WIDTH - CARD_PADDING * 2, 4).forEach((line, index) =>
      ctx.fillText(line, CARD_PADDING, 350 + index * 56),
    );
  });
}

export default function ChildhoodLineup() {
  const urlEntry = Number(useUrlParam("entry"));
  const [picked, setPicked] = useState<number | null>(null);
  const [cardState, setCardState] = useState<CardState>("idle");
  const entry = picked ?? (entryYears.includes(urlEntry) ? urlEntry : null);
  const lineup = entry === null ? [] : lineupFor(entry);

  const choose = (value: string) => {
    const year = Number(value);
    setPicked(year);
    setCardState("idle");
    /* 写回 ?entry=，链接可以直接分享给同届同学 */
    const url = new URL(window.location.href);
    url.searchParams.set("entry", value);
    window.history.replaceState(null, "", url);
  };

  const handleCard = async () => {
    if (entry === null) return;
    setCardState("busy");
    try {
      const names = lineup.map((animation) => animation.name);
      const blob = await drawLineupCard(entry, names);
      if (!blob) throw new Error("canvas unavailable");
      const outcome = await shareOrDownloadCard(
        blob,
        `${entry}年上小学的童年片单.png`,
        `${SITE_NAME} · 我的童年片单`,
        `我 ${entry} 年上小学，那六年首播的国产动画有 ${names.length} 部。`,
      );
      setCardState(outcome === "cancelled" ? "idle" : "done");
    } catch {
      setCardState("error");
    }
  };

  return (
    <section id="lineup" className="site-shell mx-auto max-w-[1180px] px-5 pt-10">
      <div className="museum-card rounded-2xl px-6 py-8 sm:px-10">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="archive-kicker flex items-center gap-2 text-xs font-black text-[#d8ac55]/75">
              <Backpack size={14} />
              My Childhood Lineup
            </p>
            <h2 className="retro-title mt-2 text-4xl text-[#fff6e8]">你哪年上小学？</h2>
            <p className="memory-text mt-3 max-w-xl text-sm text-[#d9c39a]/82">
              选出入学年份，看看小学六年里首播了哪些国产动画——那就是你放学后守着的电视。
            </p>
          </div>
          <label className="block w-full sm:w-56">
            <span className="archive-kicker mb-2 block text-[10px] font-black text-[#f3c76a]/72">入学年份</span>
            <select
              value={entry ?? ""}
              onChange={(event) => choose(event.target.value)}
              className="retro-field w-full rounded-lg px-3 py-3 text-sm font-bold outline-none transition"
            >
              <option value="" disabled className="bg-[#100d08] text-[#fff6e8]">
                选择入学年份
              </option>
              {entryYears.map((year) => (
                <option key={year} value={year} className="bg-[#100d08] text-[#fff6e8]">
                  {year} 年
                </option>
              ))}
            </select>
          </label>
        </div>

        {entry !== null ? (
          <motion.div
            key={entry}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="mt-7"
          >
            <p className="text-sm font-bold text-[#e6bd70]/90" role="status">
              {lineup.length > 0
                ? `${entry}–${entry + SCHOOL_YEARS - 1} 年，馆里有 ${lineup.length} 部动画首播`
                : `${entry}–${entry + SCHOOL_YEARS - 1} 年首播的作品馆里还没收录，往下翻翻时间线吧`}
            </p>
            {lineup.length > 0 ? (
              <>
                <div className="mt-4 grid grid-cols-3 gap-3 sm:grid-cols-4 lg:grid-cols-6">
                  {lineup.map((animation) => (
                    <Link key={animation.slug} href={`/archive/${animation.slug}`} className="group/card block">
                      <div className="archive-card grid aspect-square place-items-center overflow-hidden rounded-lg border border-[#d8ac55]/60 bg-[#140e09] p-1.5">
                        <Image
                          src={animation.poster}
                          alt={animation.name}
                          width={220}
                          height={220}
                          className="h-full w-full rounded-md object-cover transition duration-300 group-hover/card:scale-[1.04]"
                          sizes="(max-width:640px) 30vw, (max-width:1024px) 22vw, 15vw"
                        />
                      </div>
                      <p className="mt-2 truncate text-center text-xs text-[#e8d9b8]/85">{animation.name}</p>
                      <p className="text-center font-mono text-[10px] tracking-[.12em] text-[#d9c39a]/50">
                        {animation.year} · {animation.year - entry + 1} 年级
                      </p>
                    </Link>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={handleCard}
                  disabled={cardState === "busy"}
                  className="retro-button retro-button-secondary mt-6 text-sm"
                >
                  {cardState === "done" ? <CheckCircle2 size={17} /> : <Download size={17} />}
                  {cardState === "busy" ? "卡片生成中…" : cardState === "done" ? "卡片已生成" : cardState === "error" ? "生成失败，重试" : "保存我的童年片单"}
                </button>
              </>
            ) : null}
          </motion.div>
        ) : null}
      </div>
    </section>
  );
}
