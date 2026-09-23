"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, Search, X } from "lucide-react";
import { NAV_LINKS, SECTION_LINKS, SITE_NAME, SITE_NAME_EN } from "@/lib/constants";
import GlobalSearch from "@/components/search/GlobalSearch";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  const closeSearch = useCallback(() => setSearchOpen(false), []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // "/" keyboard shortcut to open search
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "/" && !searchOpen && !(e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement)) {
        e.preventDefault();
        setSearchOpen(true);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [searchOpen]);

  return (
    <>
      <nav
        className={`fixed left-0 right-0 top-0 z-50 transition-all duration-300 ${
          scrolled ? "border-b border-[#e0b85d]/15 bg-[#070705]/84 backdrop-blur-xl" : "bg-transparent"
        }`}
        aria-label="主导航"
      >
        <div className="hero-shell flex h-[70px] items-center justify-between gap-5">
          <Link href="/" className="min-w-0 leading-none">
            <div className="retro-title truncate text-[28px] text-[#fff1d6]">
              {SITE_NAME}
            </div>
            <div className="archive-kicker mt-1.5 truncate text-[10px] text-[#d8b66b]/75">{SITE_NAME_EN}</div>
          </Link>

          <div className="hidden items-center gap-6 md:flex">
            {NAV_LINKS.map((link) => {
              const linkPath = link.href.split("#")[0] || "/";
              const isActive = linkPath === "/" ? pathname === "/" && link.href === "/" : pathname.startsWith(linkPath);

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`whitespace-nowrap text-sm font-normal transition-colors hover:text-[#f6d67e] ${
                    isActive ? "text-[#f6d67e]" : "text-[#f8efd8]/82"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>

          <div className="flex shrink-0 items-center gap-2 text-[#f8efd8]/80">
            <button
              className="retro-icon-button h-10 w-10"
              aria-label="搜索"
              onClick={() => setSearchOpen(true)}
            >
              <Search size={18} />
            </button>
            <div className="md:hidden">
              <button
                className="retro-icon-button h-10 w-10"
                aria-label={menuOpen ? "关闭菜单" : "打开菜单"}
                aria-expanded={menuOpen}
                onClick={() => setMenuOpen((prev) => !prev)}
              >
                {menuOpen ? <X size={18} /> : <Menu size={18} />}
              </button>
            </div>
          </div>
        </div>

        {menuOpen ? (
          <div className="border-t border-[#e0b85d]/15 bg-[#070705]/96 px-5 pb-4 pt-2 backdrop-blur-xl md:hidden">
            <div className="grid grid-cols-2 gap-x-4">
              {[...NAV_LINKS, ...SECTION_LINKS].map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className="whitespace-nowrap rounded-lg px-2 py-2.5 text-sm font-bold text-[#f8efd8]/85 transition hover:bg-[#ffd24d]/10 hover:text-[#f6d67e]"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        ) : null}
      </nav>

      <GlobalSearch open={searchOpen} onClose={closeSearch} />
    </>
  );
}
