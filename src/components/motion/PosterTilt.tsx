"use client";

import { useCallback, useRef, type PointerEvent as ReactPointerEvent, type ReactNode } from "react";

/**
 * 规范 §11/§12：档案卡 3D Tilt + 手电筒光斑。
 * 只负责把指针位置写进 CSS 变量（--tilt-x/--tilt-y/--spot-x/--spot-y），
 * 变换、光斑、归位缓动全部由 .tilt-card 的 CSS 承担；
 * 触屏（pointerType !== "mouse"）与 reduced-motion 的降级在 CSS 侧完成。
 */
export default function PosterTilt({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  const onPointerMove = useCallback((e: ReactPointerEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el || e.pointerType !== "mouse") return;
    const rect = el.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width;
    const py = (e.clientY - rect.top) / rect.height;
    // §12：rotateX/Y 上限 ±5°
    el.style.setProperty("--tilt-y", `${((px - 0.5) * 10).toFixed(2)}deg`);
    el.style.setProperty("--tilt-x", `${((0.5 - py) * 10).toFixed(2)}deg`);
    el.style.setProperty("--spot-x", `${(px * 100).toFixed(1)}%`);
    el.style.setProperty("--spot-y", `${(py * 100).toFixed(1)}%`);
  }, []);

  const onPointerLeave = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    // 归位由 CSS transition（420ms + nostalgia）接管，这里只清变量
    el.style.setProperty("--tilt-x", "0deg");
    el.style.setProperty("--tilt-y", "0deg");
  }, []);

  return (
    <div
      ref={ref}
      className={`tilt-card ${className}`}
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
    >
      {children}
    </div>
  );
}
