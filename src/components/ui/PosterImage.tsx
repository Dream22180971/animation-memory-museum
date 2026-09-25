"use client";

import { useState } from "react";
import Image from "next/image";

type PosterImageProps = {
  src: string;
  alt: string;
  /** 首屏关键图传 preload（Next 16 中替代已废弃的 priority） */
  preload?: boolean;
  className?: string;
  sizes?: string;
  /** fill 模式的裁切方式；默认 cover 防竖版海报被拉伸变形 */
  fit?: "cover" | "contain";
};

/** SVG 海报 Next 会自动跳过优化；webp 走优化管线 + 视口外懒加载 */
export default function PosterImage({ src, alt, preload, className, sizes, fit = "cover" }: PosterImageProps) {
  const [loaded, setLoaded] = useState(false);
  return (
    <Image
      src={src}
      alt={alt}
      fill
      unoptimized={src.endsWith(".svg")}
      preload={preload}
      loading={preload ? "eager" : "lazy"}
      decoding={preload ? "sync" : "async"}
      sizes={sizes ?? "min(92vw, 480px)"}
      onLoad={() => setLoaded(true)}
      className={`${fit === "contain" ? "object-contain" : "object-cover"} image-fade ${loaded ? "is-loaded" : ""} ${className ?? ""}`}
    />
  );
}
