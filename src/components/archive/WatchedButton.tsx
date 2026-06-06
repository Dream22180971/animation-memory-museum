"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, Heart } from "lucide-react";

const STORAGE_KEY = "animation-memory-watched";

export default function WatchedButton({ slug, name }: { slug: string; name: string }) {
  const [watched, setWatched] = useState(false);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      const savedItems = JSON.parse(window.localStorage.getItem(STORAGE_KEY) || "[]") as string[];
      setWatched(savedItems.includes(slug));
    });

    return () => window.cancelAnimationFrame(frame);
  }, [slug]);

  const toggleWatched = () => {
    const savedItems = JSON.parse(window.localStorage.getItem(STORAGE_KEY) || "[]") as string[];
    const nextItems = watched ? savedItems.filter((item) => item !== slug) : Array.from(new Set([slug, ...savedItems]));
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(nextItems));
    setWatched(!watched);
  };

  return (
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
  );
}
