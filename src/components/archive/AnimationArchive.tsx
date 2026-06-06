"use client";

import { motion, type Variants } from "framer-motion";
import Link from "next/link";
import { ArrowRight, ExternalLink, Star } from "lucide-react";
import animations from "@/data/animations.json";

const sectionVariants: Variants = {
  hidden: { opacity: 0, y: 36 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1], staggerChildren: 0.08 },
  },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 34, scale: 0.96 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.62, ease: [0.22, 1, 0.36, 1] },
  },
};

export default function AnimationArchive() {
  return (
    <motion.section
      id="archive"
      variants={sectionVariants}
      initial="hidden"
      animate="visible"
      className="museum-section border-b border-[#c99a45]/12 px-4 py-14 sm:px-8 lg:px-12"
    >
      <motion.div variants={cardVariants} className="mb-9 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="archive-kicker mb-3 text-xs font-black text-[#f3c76a]/70">Classic Archive</p>
          <h2 className="retro-title flex items-center gap-3 text-5xl text-[#fff6e8]">
            经典动画档案 <Star size={24} className="text-[#ffd24d]" />
          </h2>
          <p className="memory-text mt-4 max-w-2xl text-base text-[#d9c39a]/82">
            不做模糊截图堆叠，把每部动画整理成一张清晰、发光、适合停留的主题海报。
          </p>
        </div>
        <motion.div
          whileHover={{ x: 4 }}
          className="retro-button retro-button-ghost w-fit text-sm"
        >
          <Link href="/archive" className="inline-flex items-center gap-2">
            查看全部 <ArrowRight size={16} />
          </Link>
        </motion.div>
      </motion.div>

      <div className="archive-wall grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {animations.animations.map((anim, index) => (
          <motion.article
            key={anim.id}
            variants={cardVariants}
            whileHover={{ y: -8, scale: 1.012 }}
            transition={{ type: "spring", stiffness: 260, damping: 24 }}
            className="archive-poster archive-card museum-card group card-glow relative min-h-[290px] rounded-[1.35rem] sm:min-h-[320px]"
          >
            <motion.div
              className="archive-poster-image absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url(${anim.poster})` }}
              whileHover={{ scale: 1.055 }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            />
            <div className="archive-poster-overlay absolute inset-0 transition-opacity duration-500" />
            <div className="archive-poster-shine absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

            <div className="relative z-10 flex h-full min-h-[290px] flex-col justify-between p-5 sm:min-h-[320px] sm:p-6">
              <div className="flex items-start justify-between gap-4">
                <span className="cassette-label">
                  File {String(index + 1).padStart(2, "0")}
                </span>
              </div>

              <div className="max-w-[88%]">
                <h3 className="retro-title text-4xl leading-none text-[#fff6e8]">
                  {anim.name}
                </h3>
                <p className="memory-text mt-4 line-clamp-2 text-sm text-[#f0ddba]/82">{anim.description}</p>
                <div className="mt-5 flex flex-wrap gap-2">
                  <span className="cassette-label cassette-label-muted">
                    {anim.year}
                  </span>
                  {anim.genre.map((genre) => (
                    <span key={genre} className="cassette-label cassette-label-muted">
                      {genre}
                    </span>
                  ))}
                </div>
                <Link
                  href={`/archive/${anim.slug}`}
                  className="retro-button retro-button-primary mt-5 mr-2 w-fit text-xs"
                >
                  查看详情
                  <ArrowRight size={14} />
                </Link>
                <a
                  href={anim.baikeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="retro-button retro-button-secondary mt-5 w-fit text-xs"
                  aria-label={`查看${anim.name}的百度百科介绍`}
                >
                  百度百科介绍
                  <ExternalLink size={14} />
                </a>
              </div>
            </div>
          </motion.article>
        ))}
      </div>
    </motion.section>
  );
}
