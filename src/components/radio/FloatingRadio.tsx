"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Music2, Pause, Play, SkipForward, Volume2 } from "lucide-react";

const tracks = [
  {
    title: "放学后的17:30",
    subtitle: "8-bit 主题曲",
    notes: [392, 523, 587, 659, 587, 523, 440, 392],
  },
  {
    title: "电视雪花片头",
    subtitle: "CRT Prelude",
    notes: [330, 392, 494, 523, 494, 392, 349, 330],
  },
  {
    title: "夏日晚霞回放",
    subtitle: "Memory Loop",
    notes: [262, 330, 392, 440, 392, 330, 294, 262],
  },
];

export default function FloatingRadio() {
  const [isOpen, setIsOpen] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [trackIndex, setTrackIndex] = useState(0);
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
      const track = tracks[trackIndex];
      const frequency = track.notes[stepRef.current % track.notes.length];
      stepRef.current += 1;

      const oscillator = context.createOscillator();
      const gain = context.createGain();
      oscillator.type = "triangle";
      oscillator.frequency.setValueAtTime(frequency, context.currentTime);
      gain.gain.setValueAtTime(0.0001, context.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.035, context.currentTime + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, context.currentTime + 0.32);
      oscillator.connect(gain);
      gain.connect(context.destination);
      oscillator.start();
      oscillator.stop(context.currentTime + 0.34);
    };

    playNote();
    timerRef.current = window.setInterval(playNote, 360);
    return () => {
      if (timerRef.current) window.clearInterval(timerRef.current);
      timerRef.current = null;
    };
  }, [isPlaying, trackIndex]);

  const nextTrack = () => {
    stepRef.current = 0;
    setTrackIndex((index) => (index + 1) % tracks.length);
  };

  if (!isOpen) {
    return (
      <motion.button
        id="radio"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 grid h-14 w-14 place-items-center rounded-full border border-[#f0c45d]/55 bg-[#120d08]/90 text-[#f0c45d] shadow-[0_16px_40px_rgba(0,0,0,.42)] backdrop-blur-md"
        aria-label="打开怀旧电台"
      >
        <Music2 size={22} />
      </motion.button>
    );
  }

  const track = tracks[trackIndex];

  return (
    <motion.aside
      id="radio"
      initial={{ opacity: 0, y: 24, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      className="fixed bottom-6 right-6 z-50 w-[320px] rounded-2xl border border-[#f0c45d]/30 bg-[#120d08]/88 p-4 text-[#fff1d8] shadow-[0_22px_60px_rgba(0,0,0,.5)] backdrop-blur-xl max-sm:left-4 max-sm:right-4 max-sm:w-auto"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="grid h-12 w-12 place-items-center rounded-xl border border-[#f0c45d]/30 bg-[#21160c] text-[#f0c45d]">
            <Volume2 size={20} />
          </div>
          <div>
            <p className="font-hand text-2xl leading-none">怀旧电台</p>
            <p className="mt-1 text-xs text-[#d9c39a]/70">{track.subtitle}</p>
          </div>
        </div>
        <button onClick={() => setIsOpen(false)} className="text-xs text-[#d9c39a]/60 hover:text-[#fff1d8]">
          收起
        </button>
      </div>

      <div className="mt-4 rounded-xl border border-[#c99a45]/18 bg-[#070806]/70 p-3">
        <p className="truncate text-sm font-bold">{track.title}</p>
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
          className="grid h-12 w-12 place-items-center rounded-full bg-[#f0c45d] text-[#1b1208]"
          aria-label={isPlaying ? "暂停主题曲" : "播放主题曲"}
        >
          {isPlaying ? <Pause size={18} /> : <Play size={18} fill="currentColor" />}
        </motion.button>
        <button
          onClick={nextTrack}
          className="grid h-11 w-11 place-items-center rounded-full border border-[#f0c45d]/35 text-[#f0c45d] hover:bg-[#f0c45d]/10"
          aria-label="下一首"
        >
          <SkipForward size={17} />
        </button>
        <p className="text-xs leading-5 text-[#d9c39a]/72">点击播放会生成一段 8-bit 怀旧旋律。</p>
      </div>
    </motion.aside>
  );
}
