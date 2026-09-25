"use client";

import { useEffect, useRef, useState } from "react";
import { CheckCircle2, Heart } from "lucide-react";

const STORAGE_KEY = "animation-memory-watched";

const readWatchedItems = () => {
  try {
    const parsedItems: unknown = JSON.parse(window.localStorage.getItem(STORAGE_KEY) || "[]");
    return Array.isArray(parsedItems) ? parsedItems.filter((item): item is string => typeof item === "string") : [];
  } catch {
    return [];
  }
};

export default function WatchedButton({ slug, name }: { slug: string; name: string }) {
  const [watched, setWatched] = useState(false);
  const [storageError, setStorageError] = useState(false);
  const [stampVisible, setStampVisible] = useState(false);
  const stampTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      setWatched(readWatchedItems().includes(slug));
    });

    return () => {
      window.cancelAnimationFrame(frame);
      if (stampTimerRef.current) clearTimeout(stampTimerRef.current);
    };
  }, [slug]);

  const toggleWatched = () => {
    try {
      const savedItems = readWatchedItems();
      const nextItems = watched ? savedItems.filter((item) => item !== slug) : Array.from(new Set([slug, ...savedItems]));
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(nextItems));
      setWatched(!watched);
      setStorageError(false);
      /* 规范 §21：完成记录时盖章一次，非普通点击都盖 */
      if (!watched) {
        setStampVisible(true);
        if (stampTimerRef.current) clearTimeout(stampTimerRef.current);
        stampTimerRef.current = setTimeout(() => setStampVisible(false), 1700);
      }
    } catch {
      setStorageError(true);
    }
  };

  return (
    <div className="relative flex flex-col gap-2">
      <button
        onClick={toggleWatched}
        className={[
        "retro-button text-sm",
        watched
          ? "retro-button-success"
          : "retro-button-secondary",
      ].join(" ")}
      aria-pressed={watched}
      aria-label={watched ? `取消标记看过${name}` : `标记我也看过${name}`}
    >
        {watched ? <CheckCircle2 size={17} /> : <Heart size={17} />}
        {watched ? "已经点亮这段记忆" : "我也看过"}
      </button>
      {stampVisible ? (
        <span className="pointer-events-none absolute -top-9 right-0 z-20" aria-hidden="true">
          <span className="stamp-seal">
            <span className="text-[10px] font-black tracking-[.28em]">ARCHIVED</span>
            <span className="text-base font-black leading-none">童年入馆</span>
          </span>
        </span>
      ) : null}
      {storageError ? <span role="alert" className="text-xs font-bold text-[#ff9a85]">浏览器无法保存此标记</span> : null}
    </div>
  );
}
