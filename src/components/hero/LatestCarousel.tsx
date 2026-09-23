"use client";

import { useRef } from "react";
import { motion, type Variants } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";
import { Clock, ChevronLeft, ChevronRight, Sparkles } from "lucide-react";
import Link from "next/link";
import { latestAnimations } from "@/lib/animations";
import PosterImage from "@/components/ui/PosterImage";
import "swiper/css";
import "swiper/css/pagination";

const latest = latestAnimations;

const sectionVariants: Variants = {
  hidden: { opacity: 0, y: 34 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1], staggerChildren: 0.12 },
  },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 24, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.62, ease: [0.22, 1, 0.36, 1] },
  },
};

export default function LatestCarousel() {
  const swiperRef = useRef<SwiperType | null>(null);

  return (
    <motion.section
      id="latest"
      variants={sectionVariants}
      initial="hidden"
      animate="visible"
      className="museum-section border-b border-[#c99a45]/12 px-5 py-16 lg:px-14"
    >
      <motion.div variants={cardVariants} className="mb-10 flex items-end justify-between">
        <div>
          <p className="archive-kicker text-xs font-black text-[#d8ac55]/75">Latest Additions</p>
          <h2 className="retro-title mt-1 flex items-center gap-3 text-5xl text-[#fff6e8]">
            年代新近馆藏 <Sparkles size={24} className="text-[#ffd24d]" />
          </h2>
          <p className="memory-text mt-3 max-w-xl text-base text-[#d9c39a]/82">
            按入馆先后排列，越靠前，越是刚刚归档的新鲜记忆。
          </p>
        </div>
        <div className="hidden shrink-0 gap-2 sm:flex">
          <button
            onClick={() => swiperRef.current?.slidePrev()}
            className="retro-icon-button h-10 w-10 text-[#f3c76a]"
            aria-label="上一个"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            onClick={() => swiperRef.current?.slideNext()}
            className="retro-icon-button h-10 w-10 text-[#f3c76a]"
            aria-label="下一个"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </motion.div>

      <motion.div variants={cardVariants}>
        <Swiper
          modules={[Autoplay, Pagination]}
          onSwiper={(swiper) => (swiperRef.current = swiper)}
          autoplay={{ delay: 3500, disableOnInteraction: false }}
          pagination={{ clickable: true }}
          spaceBetween={16}
          slidesPerView={1}
          breakpoints={{
            640: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
          }}
          className="latest-swiper !overflow-visible pb-12"
        >
          {latest.map((anim, idx) => (
            <SwiperSlide key={anim.slug}>
              <Link href={`/archive/${anim.slug}`} className="block">
                <motion.article
                  whileHover={{ y: -6, scale: 1.02 }}
                  transition={{ duration: 0.3 }}
                  className="museum-card group relative overflow-hidden rounded-xl"
                >
                  {/* Background poster */}
                  <div className="absolute inset-0 transition duration-500 group-hover:scale-110">
                    <PosterImage src={anim.poster} alt={`${anim.name} 海报`} sizes="(max-width:640px) 92vw, (max-width:1024px) 46vw, 30vw" />
                  </div>
                  <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(7,8,6,.25)_0%,rgba(7,8,6,.7)_50%,rgba(7,8,6,.94)_100%)]" />

                  {/* Content */}
                  <div className="relative z-10 flex min-h-[280px] flex-col justify-end p-5">
                    {/* File number badge */}
                    <span className="cassette-label absolute left-4 top-4">
                      File {String(idx + 1).padStart(2, "0")}
                    </span>

                    {/* Year badge */}
                    <div className="absolute right-4 top-4 flex items-center gap-1.5 rounded-full bg-[#070806]/70 px-3 py-1 text-xs text-[#ffd24d]">
                      <Clock size={12} />
                      {anim.year}
                    </div>

                    {/* Title & description */}
                    <h3 className="retro-title text-3xl text-[#fff6e8]">{anim.name}</h3>
                    <p className="memory-text mt-2 line-clamp-2 text-sm text-[#d9c39a]/78">
                      {anim.description}
                    </p>

                    {/* Genre tags */}
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {anim.genre.map((g) => (
                        <span key={g} className="cassette-label cassette-label-muted text-[10px]">
                          {g}
                        </span>
                      ))}
                    </div>

                    {/* Songs preview */}
                    {anim.songs && anim.songs.length > 0 && (
                      <div className="mt-3 border-t border-[#c99a45]/15 pt-3">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-[#d8ac55]/60">
                          {anim.songs[0].type}
                        </p>
                        <p className="mt-0.5 text-xs text-[#fff7e8]">
                          {anim.songs[0].name}
                          <span className="ml-1.5 text-[#d9c39a]/50">— {anim.songs[0].singer}</span>
                        </p>
                      </div>
                    )}
                  </div>
                </motion.article>
              </Link>
            </SwiperSlide>
          ))}
        </Swiper>
      </motion.div>
    </motion.section>
  );
}
