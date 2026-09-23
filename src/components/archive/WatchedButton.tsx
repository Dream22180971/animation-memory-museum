"use client";

import { useEffect, useState } from "react";
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

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      setWatched(readWatchedItems().includes(slug));
    });

    return () => window.cancelAnimationFrame(frame);
  }, [slug]);

  const toggleWatched = () => {
    try {
      const savedItems = readWatchedItems();
      const nextItems = watched ? savedItems.filter((item) => item !== slug) : Array.from(new Set([slug, ...savedItems]));
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(nextItems));
      setWatched(!watched);
      setStorageError(false);
    } catch {
      setStorageError(true);
    }
  };

  return (
    <div className="flex flex-col gap-2">
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
      {storageError ? <span role="alert" className="text-xs font-bold text-[#ff9a85]">浏览器无法保存此标记</span> : null}
    </div>
  );
}
