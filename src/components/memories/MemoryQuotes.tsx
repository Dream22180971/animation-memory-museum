"use client";

import { motion, type Variants } from "framer-motion";
import { Heart } from "lucide-react";
import animations from "@/data/animations.json";

const sectionVariants: Variants = {
  hidden: { opacity: 0, y: 34 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1], staggerChildren: 0.08 },
  },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 30, scale: 0.96 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.62, ease: [0.22, 1, 0.36, 1] },
  },
};

export default function MemoryQuotes() {
  return (
    <motion.section
      id="memories"
      variants={sectionVariants}
      initial="hidden"
      animate="visible"
      className="museum-section px-5 py-16 pb-28 lg:px-14 lg:pb-32"
    >
      <motion.div variants={cardVariants} className="mb-10">
        <h2 className="font-hand flex items-center gap-3 text-5xl text-[#fff6e8]">
          你还记得吗？ <Heart size={24} className="text-[#ffd24d]" />
        </h2>
        <p className="mt-4 text-base text-[#d9c39a]/82">那些藏在记忆里的小瞬间</p>
      </motion.div>

      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-5">
        {animations.memories.map((memory) => (
          <motion.article
            key={memory.image}
            variants={cardVariants}
            whileHover={{ y: -8, scale: 1.015 }}
            transition={{ type: "spring", stiffness: 260, damping: 24 }}
            className="min-h-[420px] overflow-hidden rounded-lg border border-[#c89a44]/38 bg-[#100e0a]/78 shadow-[0_18px_40px_rgba(0,0,0,.25)]"
          >
            <div className="relative h-[205px] overflow-hidden">
              <motion.div
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: `url(${memory.image})` }}
                whileHover={{ scale: 1.08 }}
                transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
              />
              <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-[#090806] to-transparent" />
            </div>
            <div className="flex min-h-[215px] flex-col p-5">
              <p className="text-[15px] font-semibold leading-7 text-[#f7ecd7]">“{memory.quote}”</p>
              <p className="mt-auto pt-6 text-xs leading-5 text-[#d6b476]/80">— {memory.attribution}</p>
            </div>
          </motion.article>
        ))}

      </div>
    </motion.section>
  );
}
