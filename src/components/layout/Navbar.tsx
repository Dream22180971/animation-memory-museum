"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Search, Sun } from "lucide-react";
import { NAV_LINKS, SITE_NAME, SITE_NAME_EN } from "@/lib/constants";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className={`fixed left-0 right-0 top-0 z-50 transition-all duration-300 ${
        scrolled ? "border-b border-[#e0b85d]/15 bg-[#070705]/84 backdrop-blur-xl" : "bg-transparent"
      }`}
      aria-label="主导航"
    >
      <div className="hero-shell flex h-[70px] items-center justify-between gap-5">
        <Link href="/" className="min-w-0 leading-none">
          <div className="font-hand truncate text-[28px] tracking-wide text-[#fff1d6] drop-shadow-[0_2px_10px_rgba(224,184,93,.25)]">
            {SITE_NAME}
          </div>
          <div className="mt-1.5 truncate text-[10px] tracking-[0.24em] text-[#d8b66b]/75">{SITE_NAME_EN}</div>
        </Link>

        <div className="hidden items-center gap-6 md:flex">
          {NAV_LINKS.map((link, index) => (
            <Link
              key={link.href}
              href={link.href}
              className={`whitespace-nowrap text-sm font-medium transition-colors hover:text-[#f6d67e] ${
                index === 0 ? "text-[#f6d67e]" : "text-[#f8efd8]/82"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="flex shrink-0 items-center gap-2 text-[#f8efd8]/80">
          <button className="grid h-10 w-10 place-items-center rounded-full border border-[#e0b85d]/35 hover:border-[#f6d67e]/70" aria-label="搜索">
            <Search size={18} />
          </button>
          <button className="grid h-10 w-10 place-items-center rounded-full hover:text-[#f6d67e]" aria-label="切换主题">
            <Sun size={20} />
          </button>
        </div>
      </div>
    </nav>
  );
}
