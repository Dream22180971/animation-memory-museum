import Link from "next/link";
import { AUTHOR_GITHUB, COPYRIGHT_YEAR, FEEDBACK_URL, NAV_LINKS, REPOSITORY_URL, SECTION_LINKS, SITE_NAME, SITE_NAME_EN } from "@/lib/constants";

/** 移动端没有常驻导航，页脚是到达各展区的第二条路径 */
const SITE_LINKS = [...NAV_LINKS.filter((link) => link.href !== "/"), ...SECTION_LINKS];

export default function Footer() {
  return (
    <footer id="about" className="museum-card site-shell mb-10 mt-10 rounded-2xl px-8 py-8">
      <div className="flex flex-col justify-between gap-6 text-sm text-[#d9c39a]/78 md:flex-row md:items-center">
        <div>
          <div className="retro-title text-3xl text-[#fff3dc]">{SITE_NAME}</div>
          <div className="archive-kicker mt-1 text-xs">{SITE_NAME_EN}</div>
        </div>
        <nav aria-label="页脚导航" className="flex flex-wrap gap-x-8 gap-y-3 text-[#fff0d6]">
          {SITE_LINKS.map((link) => (
            <Link key={link.href} className="transition hover:text-[#f6d67e]" href={link.href}>
              {link.label}
            </Link>
          ))}
          <a className="transition hover:text-[#f6d67e]" href={AUTHOR_GITHUB} target="_blank" rel="noreferrer">联系作者</a>
          <a className="transition hover:text-[#f6d67e]" href={FEEDBACK_URL} target="_blank" rel="noreferrer">GitHub 反馈</a>
          <a className="transition hover:text-[#f6d67e]" href={REPOSITORY_URL} target="_blank" rel="noreferrer">项目仓库</a>
        </nav>
        <div className="text-xs">
          <div>© {COPYRIGHT_YEAR} {SITE_NAME}. 我们仍然怀念过去的童年。</div>
          <div className="mt-2 text-[#d9c39a]/55">
            动画名称、海报与台词等素材版权归原作者所有，本站仅作非商业展示 ·{" "}
            <Link
              className="underline decoration-[#c99a45]/40 underline-offset-4 transition hover:text-[#f6d67e]"
              href="/about#copyright"
            >
              版权与致谢
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
