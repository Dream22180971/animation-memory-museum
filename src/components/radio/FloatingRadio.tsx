"use client";

import { useCallback, useEffect, useRef, useState, type PointerEvent } from "react";
import { motion } from "framer-motion";
import { Music2, Pause, Play, Volume2 } from "lucide-react";

const radioTrack = {
  title: "大风车",
  subtitle: "童年片头单曲",
  notes: [392, 440, 494, 523, 587, 523, 494, 440, 392, 440, 494, 523, 494, 440, 392, 330],
};

const STORAGE_KEY = "animation-memory-radio-position";
const VIEWPORT_GUTTER = 12;

type RadioPosition = {
  x: number;
  y: number;
};

type DragState = {
  startX: number;
  startY: number;
  origin: RadioPosition;
  lastPosition: RadioPosition;
  moved: boolean;
};

export default function FloatingRadio() {
  const [isOpen, setIsOpen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [position, setPosition] = useState<RadioPosition>({ x: VIEWPORT_GUTTER, y: VIEWPORT_GUTTER });
  const [wasDragged, setWasDragged] = useState(false);
  const radioRef = useRef<HTMLElement | null>(null);
  const dragStateRef = useRef<DragState | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const timerRef = useRef<number | null>(null);
  const stepRef = useRef(0);

  const clampPosition = useCallback((nextPosition: RadioPosition, node = radioRef.current) => {
    const width = node?.offsetWidth ?? (isOpen ? 320 : 56);
    const height = node?.offsetHeight ?? (isOpen ? 230 : 56);
    const maxX = Math.max(VIEWPORT_GUTTER, window.innerWidth - width - VIEWPORT_GUTTER);
    const maxY = Math.max(VIEWPORT_GUTTER, window.innerHeight - height - VIEWPORT_GUTTER);

    return {
      x: Math.min(Math.max(VIEWPORT_GUTTER, nextPosition.x), maxX),
      y: Math.min(Math.max(VIEWPORT_GUTTER, nextPosition.y), maxY),
    };
  }, [isOpen]);

  const savePosition = useCallback((nextPosition: RadioPosition) => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(nextPosition));
  }, []);

  const updatePosition = useCallback((nextPosition: RadioPosition) => {
    const clampedPosition = clampPosition(nextPosition);
    setPosition(clampedPosition);
    savePosition(clampedPosition);
  }, [clampPosition, savePosition]);

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

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      const savedPosition = window.localStorage.getItem(STORAGE_KEY);
      if (savedPosition) {
        try {
          updatePosition(JSON.parse(savedPosition) as RadioPosition);
          return;
        } catch {
          window.localStorage.removeItem(STORAGE_KEY);
        }
      }

      updatePosition({ x: window.innerWidth - 84, y: window.innerHeight - 84 });
    });

    return () => window.cancelAnimationFrame(frame);
  }, [updatePosition]);

  useEffect(() => {
    const keepRadioInViewport = () => {
      setPosition((currentPosition) => {
        const clampedPosition = clampPosition(currentPosition);
        savePosition(clampedPosition);
        return clampedPosition;
      });
    };
    window.addEventListener("resize", keepRadioInViewport);
    return () => window.removeEventListener("resize", keepRadioInViewport);
  }, [clampPosition, savePosition]);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      setPosition((currentPosition) => {
        const clampedPosition = clampPosition(currentPosition);
        savePosition(clampedPosition);
        return clampedPosition;
      });
    });

    return () => window.cancelAnimationFrame(frame);
  }, [clampPosition, savePosition, isOpen]);

  const startRadioDrag = (event: PointerEvent<HTMLElement>) => {
    if (event.button !== 0) return;

    dragStateRef.current = {
      startX: event.clientX,
      startY: event.clientY,
      origin: position,
      lastPosition: position,
      moved: false,
    };

    const handlePointerMove = (moveEvent: globalThis.PointerEvent) => {
      const dragState = dragStateRef.current;
      if (!dragState) return;

      const deltaX = moveEvent.clientX - dragState.startX;
      const deltaY = moveEvent.clientY - dragState.startY;
      if (Math.abs(deltaX) + Math.abs(deltaY) > 6) {
        dragState.moved = true;
        setWasDragged(true);
      }

      const nextPosition = clampPosition({
        x: dragState.origin.x + deltaX,
        y: dragState.origin.y + deltaY,
      });

      dragState.lastPosition = nextPosition;
      setPosition(nextPosition);
    };

    const handlePointerUp = () => {
      const dragState = dragStateRef.current;
      if (dragState) {
        savePosition(dragState.lastPosition);
      }

      dragStateRef.current = null;
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
      window.setTimeout(() => setWasDragged(false), 140);
    };

    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", handlePointerUp);
  };

  if (!isOpen) {
    return (
      <div className="pointer-events-none fixed inset-0 z-50">
        <motion.button
          ref={(node) => {
            radioRef.current = node;
          }}
          style={{ left: position.x, top: position.y }}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          onPointerDown={startRadioDrag}
          onClick={() => {
            if (!wasDragged) setIsOpen(true);
          }}
          className="pointer-events-auto absolute grid h-14 w-14 cursor-grab touch-none select-none place-items-center rounded-full border border-[#f0c45d]/55 bg-[#120d08]/90 text-[#f0c45d] shadow-[0_16px_40px_rgba(0,0,0,.42)] backdrop-blur-md active:cursor-grabbing"
          aria-label="打开怀旧电台"
          title="拖动移动电台，点击打开"
        >
          <Music2 size={22} />
        </motion.button>
      </div>
    );
  }

  return (
    <div className="pointer-events-none fixed inset-0 z-50">
      <motion.aside
        ref={(node) => {
          radioRef.current = node;
        }}
        style={{ left: position.x, top: position.y }}
        initial={{ opacity: 0, y: 24, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        className="pointer-events-auto absolute w-[min(320px,calc(100vw-24px))] rounded-2xl border border-[#f0c45d]/30 bg-[#120d08]/88 p-4 text-[#fff1d8] shadow-[0_22px_60px_rgba(0,0,0,.5)] backdrop-blur-xl"
      >
        <div
          className="flex cursor-grab touch-none items-start justify-between gap-4 active:cursor-grabbing"
          onPointerDown={startRadioDrag}
          title="拖动这里移动电台"
        >
          <div className="flex items-center gap-3">
            <div className="grid h-12 w-12 place-items-center rounded-xl border border-[#f0c45d]/30 bg-[#21160c] text-[#f0c45d]">
              <Volume2 size={20} />
            </div>
            <div>
              <p className="font-hand text-2xl leading-none">怀旧电台</p>
              <p className="mt-1 text-xs text-[#d9c39a]/70">{radioTrack.subtitle}</p>
            </div>
          </div>
          <button onClick={() => setIsOpen(false)} className="text-xs text-[#d9c39a]/60 hover:text-[#fff1d8]">
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
            className="grid h-12 w-12 place-items-center rounded-full bg-[#f0c45d] text-[#1b1208]"
            aria-label={isPlaying ? "暂停主题曲" : "播放主题曲"}
          >
            {isPlaying ? <Pause size={18} /> : <Play size={18} fill="currentColor" />}
          </motion.button>
          <p className="text-xs leading-5 text-[#d9c39a]/72">默认单曲循环，后面可以继续加入更多童年片头。</p>
        </div>
      </motion.aside>
    </div>
  );
}
