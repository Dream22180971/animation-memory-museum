"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Music2, Pause, Play, Volume2 } from "lucide-react";

const radioTrack = {
  title: "大风车",
  subtitle: "童年片头单曲",
  notes: [392, 440, 494, 523, 587, 523, 494, 440, 392, 440, 494, 523, 494, 440, 392, 330],
};

export default function FloatingRadio() {
  const [isOpen, setIsOpen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioContextRef = useRef<AudioContext | null>(null);
  const timerRef = useRef<number | null>(null);
  const stepRef = useRef(0);

  useEffect(() => {
    return () => {
      if (timerRef.current) window.clearInterval(timerRef.current);
      audioContextRef.current?.close();
    };
  }, []);

  useEffect(() => {
    if (!isPlaying) {
      if (timerRef.current) window.clearInterval(timerRef.current);
      timerRef.current = null;
      return;
    }

    const AudioCtx = window.AudioContext || (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtx) return;

    if (!audioContextRef.current) audioContextRef.current = new AudioCtx();
    audioContextRef.current.resume();

    const playNote = () => {
      const context = audioContextRef.current;
      if (!context) return;
      const frequency = radioTrack.notes[stepRef.current % radioTrack.notes.length];
      stepRef.current += 1;

      const oscillator = context.createOscillator();
      const gain = context.createGain();
      oscillator.type = "sine";
      oscillator.frequency.setValueAtTime(frequency, context.currentTime);
      gain.gain.setValueAtTime(0.0001, context.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.045, context.currentTime + 0.025);
      gain.gain.exponentialRampToValueAtTime(0.0001, context.currentTime + 0.38);
      oscillator.connect(gain);
      gain.connect(context.destination);
      oscillator.start();
      oscillator.stop(context.currentTime + 0.4);
    };

    playNote();
    timerRef.current = window.setInterval(playNote, 420);
    return () => {
      if (timerRef.current) window.clearInterval(timerRef.current);
      timerRef.current = null;
    };
  }, [isPlaying]);

  if (!isOpen) {
    return (
      <motion.button
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        onClick={() => setIsOpen(true)}
        className="retro-icon-button fixed bottom-5 right-5 z-50 h-14 w-14 text-[#f0c45d] backdrop-blur-md sm:bottom-6 sm:right-6"
        aria-label="打开怀旧电台"
        title="打开怀旧电台"
      >
        <Music2 size={22} />
      </motion.button>
    );
  }

  return (
    <motion.aside
      initial={{ opacity: 0, y: 24, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      className="museum-card fixed bottom-5 right-5 z-50 w-[min(320px,calc(100vw-40px))] rounded-2xl p-4 text-[#fff1d8] backdrop-blur-xl sm:bottom-6 sm:right-6"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="grid h-12 w-12 place-items-center rounded-xl border border-[#f0c45d]/30 bg-[#21160c] text-[#f0c45d]">
            <Volume2 size={20} />
          </div>
          <div>
            <p className="retro-title text-2xl leading-none">怀旧电台</p>
            <p className="mt-1 text-xs text-[#d9c39a]/70">{radioTrack.subtitle}</p>
          </div>
        </div>
        <button onClick={() => setIsOpen(false)} className="retro-button retro-button-ghost text-xs">
          收起
        </button>
      </div>

      <div className="mt-4 rounded-xl border border-[#c99a45]/18 bg-[#070806]/70 p-3">
        <p className="truncate text-sm font-bold">{radioTrack.title}</p>
        <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-[#3a2a14]">
          <motion.div
            className="h-full rounded-full bg-[#f0c45d]"
            animate={{ width: isPlaying ? ["12%", "95%"] : "24%" }}
            transition={{ duration: 6, repeat: isPlaying ? Infinity : 0, ease: "linear" }}
          />
        </div>
      </div>

      <div className="mt-4 flex items-center gap-3">
        <motion.button
          onClick={() => setIsPlaying((value) => !value)}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.94 }}
          className="retro-icon-button h-12 w-12 bg-[#f0c45d] text-[#1b1208]"
          aria-label={isPlaying ? "暂停主题曲" : "播放主题曲"}
        >
          {isPlaying ? <Pause size={18} /> : <Play size={18} fill="currentColor" />}
        </motion.button>
        <p className="text-xs leading-5 text-[#d9c39a]/72">默认单曲循环，后面可以继续加入更多童年片头。</p>
      </div>
    </motion.aside>
  );
}
