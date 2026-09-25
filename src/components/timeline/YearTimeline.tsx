"use client";

import { useEffect, useRef, useState } from "react";
import { motion, type Variants } from "framer-motion";
import { ArrowRight, Tv } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { deriveTimeline } from "@/lib/animations";

const timeline = deriveTimeline();

type YearTimelineProps = {
  /** 预览模式：首页只放最近两个年代，正片在 /timeline */
  preview?: boolean;
};

const sectionVariants: Variants = {
  hidden: { opacity: 0, y: 34 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] },
  },
};

const nodeVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.62, ease: [0.16, 1, 0.3, 1] },
  },
};

/* 规范 §22：每个年代只整组淡入一次，不做逐卡 stagger（避免累计超过 300ms） */
const eraVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
  },
};

export default function YearTimeline({ preview = false }: YearTimelineProps) {
  const [activeIdx, setActiveIdx] = useState(0);
  const eraRefs = useRef<(HTMLElement | null)[]>([]);
  const eras = preview ? timeline.slice(0, 2) : timeline;

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const idx = Number((entry.target as HTMLElement).dataset.eraIdx);
          if (!Number.isNaN(idx)) setActiveIdx(idx);
        });
      },
      /* 只认视口中线附近的年代，滚动位置直接决定当前巨年 */
      { rootMargin: "-42% 0px -42% 0px" },
    );
    eraRefs.current.forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <motion.section
      id="timeline"
      variants={sectionVariants}
      initial="hidden"
      animate="visible"
      className="museum-section min-h-[560px] border-b border-[#c99a45]/12 px-5 py-16 lg:px-14"
    >
      <motion.div variants={nodeVariants} className="mb-10">
        <h2 className="retro-title flex items-center gap-3 text-5xl text-[#fff6e8]">
          动画年代时间线 <Tv size={24} className="text-[#ffd24d]" />
        </h2>
        <p className="memory-text mt-4 text-base text-[#d9c39a]/82">国产动画的黄金时代，从一个个放学后的傍晚串起来。</p>
      </motion.div>

      <div className="relative">
        {/* 规范 §17：巨型年份背景，换代时 blur 4px → 0（300ms）；纯装饰，禁止遮挡交互 */}
        <div className="pointer-events-none sticky top-[32vh] z-0 h-0 select-none" aria-hidden="true">
          <div className="flex w-full justify-center">
            <span key={timeline[activeIdx]?.period ?? "none"} className="timeline-year-backdrop retro-title">
              {timeline[activeIdx]?.period ?? ""}
            </span>
          </div>
        </div>

        <div className="relative z-10 mx-auto flex max-w-[1180px] flex-col gap-20 pt-6">
          {eras.map((period, idx) => (
            <motion.div
              key={period.period}
              ref={(el) => {
                eraRefs.current[idx] = el;
              }}
              data-era-idx={idx}
              variants={eraVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.12 }}
              className="relative"
            >
              <header className="mb-6 flex flex-wrap items-baseline gap-x-4 gap-y-2">
                <span className="h-3 w-3 shrink-0 self-center rounded-full bg-[#ffd24d] shadow-[0_0_18px_rgba(255,210,77,.55)]" />
                <h3 className="retro-title text-3xl text-[#ffd24d] sm:text-4xl">{period.period}</h3>
                <span className="cassette-label cassette-label-muted">{period.label}</span>
                <span className="ml-auto font-mono text-xs tracking-[.2em] text-[#d9c39a]/55">
                  {period.items.length} 部
                </span>
              </header>

              <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 sm:gap-4 lg:grid-cols-6">
                {period.items.map((item) => (
                  <Link
                    key={item.name}
                    href={item.slug ? `/archive/${item.slug}` : "#"}
                    className="group/card block"
                  >
                    <div className="archive-card grid aspect-square place-items-center overflow-hidden rounded-lg border border-[#d8ac55]/60 bg-[#140e09] p-1.5 shadow-[0_18px_42px_rgba(0,0,0,.35)]">
                      <Image
                        src={item.poster}
                        alt={item.name}
                        width={220}
                        height={220}
                        className="h-full w-full rounded-md object-cover transition duration-300 group-hover/card:scale-[1.04]"
                        sizes="(max-width:640px) 30vw, (max-width:1024px) 22vw, 15vw"
                      />
                    </div>
                    <p className="mt-2 truncate text-center text-xs text-[#e8d9b8]/85">{item.name}</p>
                    <p className="text-center font-mono text-[10px] tracking-[.12em] text-[#d9c39a]/50">{item.year}</p>
                  </Link>
                ))}
              </div>
            </motion.div>
          ))}

          {preview ? (
            <div className="flex justify-center">
              <Link href="/timeline" className="retro-button retro-button-ghost text-sm">
                查看完整时间线（{timeline.length} 个年代 · {timeline.reduce((n, p) => n + p.items.length, 0)} 部）
                <ArrowRight size={15} />
              </Link>
            </div>
          ) : null}
        </div>
      </div>
    </motion.section>
  );
}
