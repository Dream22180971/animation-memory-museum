import { AUTHOR_GITHUB, COPYRIGHT_YEAR, FEEDBACK_URL, REPOSITORY_URL, SITE_NAME, SITE_NAME_EN } from "@/lib/constants";

export default function Footer() {
  return (
    <footer id="about" className="site-shell mb-10 mt-10 rounded-3xl border border-[#c99a45]/18 bg-[#070807]/88 px-8 py-8">
      <div className="flex flex-col justify-between gap-6 text-sm text-[#d9c39a]/78 md:flex-row md:items-center">
        <div>
          <div className="font-hand text-3xl text-[#fff3dc]">{SITE_NAME}</div>
          <div className="mt-1 text-xs">{SITE_NAME_EN}</div>
        </div>
        <div className="flex flex-wrap gap-x-10 gap-y-3 text-[#fff0d6]">
          <a href="/about">关于我们</a>
          <a href={AUTHOR_GITHUB} target="_blank" rel="noreferrer">联系作者</a>
          <a href={FEEDBACK_URL} target="_blank" rel="noreferrer">GitHub 反馈</a>
          <a href={REPOSITORY_URL} target="_blank" rel="noreferrer">项目仓库</a>
        </div>
        <div className="text-xs">© {COPYRIGHT_YEAR} {SITE_NAME}. 我们仍然怀念过去的童年。</div>
      </div>
    </footer>
  );
}
