"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Play, Pause, SkipForward, SkipBack } from "lucide-react";

const tracks = [
  "虹猫蓝兔七侠传 OP",
  "超兽武装 OP",
  "果宝特攻 OP",
  "秦时明月 OP",
  "星游记 OP",
];

export default function NostalgicRadio() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState(0);

  const togglePlay = () => setIsPlaying(!isPlaying);

  const prev = () => setCurrentTrack((i) => (i - 1 + tracks.length) % tracks.length);
  const next = () => setCurrentTrack((i) => (i + 1) % tracks.length);

  return (
    <section className="relative py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-end">
          <div className="w-full max-w-xs">
            <div className="relative rounded-2xl border border-card-border bg-card overflow-hidden shadow-xl">
              {/* Cassette window */}
              <div className="bg-gradient-to-b from-card to-[#151008] p-4 border-b border-card-border">
                <div className="flex items-center gap-3">
                  {/* Cassette reels */}
                  <div className="flex gap-4">
                    <div className="w-10 h-10 rounded-full border-2 border-primary/50 flex items-center justify-center shadow-[0_0_10px_rgba(212,168,84,0.2)]">
                      <div
                        className={`w-4 h-4 rounded-full border border-primary/40 ${
                          isPlaying ? "animate-spin" : ""
                        }`}
                        style={{ animationDuration: "3s" }}
                      >
                        <div className="w-full h-full rounded-full border border-dashed border-primary/30" />
                      </div>
                    </div>
                    <div className="w-10 h-10 rounded-full border-2 border-primary/50 flex items-center justify-center shadow-[0_0_10px_rgba(212,168,84,0.2)]">
                      <div
                        className={`w-4 h-4 rounded-full border border-primary/40 ${
                          isPlaying ? "animate-spin" : ""
                        }`}
                        style={{ animationDuration: "4s" }}
                      >
                        <div className="w-full h-full rounded-full border border-dashed border-primary/30" />
                      </div>
                    </div>
                  </div>

                  <div className="flex-1">
                    <div className="text-xs text-primary/70">怀旧电台</div>
                    <div className="text-sm text-foreground mt-0.5 font-medium">童年BGM</div>
                  </div>
                </div>

                {/* Tape window */}
                <div className="mt-3 p-2 rounded bg-background border border-card-border">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-muted">{isPlaying ? "PLAY" : "PAUSE"}</span>
                    <div className="flex-1 mx-2 h-1 bg-card-border rounded overflow-hidden">
                      <motion.div
                        className="h-full bg-primary/60 rounded"
                        animate={{ width: isPlaying ? "100%" : "33%" }}
                        transition={{ duration: isPlaying ? 10 : 0.3, ease: "linear" }}
                      />
                    </div>
                    <span className="text-[10px] text-muted">03:42</span>
                  </div>
                </div>
              </div>

              {/* Controls */}
              <div className="p-4">
                <div className="flex items-center justify-center gap-4">
                  <button
                    onClick={prev}
                    aria-label="上一曲"
                    className="text-muted hover:text-primary transition-colors hover:scale-110"
                  >
                    <SkipBack size={18} />
                  </button>

                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={togglePlay}
                    aria-label={isPlaying ? "暂停" : "播放"}
                    className="w-10 h-10 rounded-full bg-primary/20 border border-primary/50 flex items-center justify-center text-primary hover:bg-primary/30 transition-all duration-300 shadow-[0_0_15px_rgba(212,168,84,0.2)]"
                  >
                    {isPlaying ? <Pause size={18} /> : <Play size={18} fill="currentColor" />}
                  </motion.button>

                  <button
                    onClick={next}
                    aria-label="下一曲"
                    className="text-muted hover:text-primary transition-colors hover:scale-110"
                  >
                    <SkipForward size={18} />
                  </button>
                </div>

                {/* Track list */}
                <div className="mt-4 space-y-1.5">
                  {tracks.map((track, i) => (
                    <div
                      key={track}
                      onClick={() => setCurrentTrack(i)}
                      className={`flex items-center gap-2 px-2 py-1.5 rounded text-xs cursor-pointer transition-all duration-300 ${
                        i === currentTrack
                          ? "text-primary bg-primary/10"
                          : "text-muted hover:text-foreground hover:bg-card-hover"
                      }`}
                    >
                      <span className="w-3">{i + 1}</span>
                      <span className="truncate">{track}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
