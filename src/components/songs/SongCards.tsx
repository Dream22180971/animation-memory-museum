import { ArrowUpRight, Disc3 } from "lucide-react";
import { animations as animationRecords, bilibiliSongUrl } from "@/lib/animations";

const typeColors: Record<string, string> = {
  "主题曲": "bg-[#ffd24d]/15 text-[#ffd24d] border-[#ffd24d]/30",
  "片头曲": "bg-[#5fa867]/15 text-[#8fd99a] border-[#5fa867]/30",
  "片尾曲": "bg-[#a94b35]/15 text-[#e88a7a] border-[#a94b35]/30",
};

/** 卡带 A/B 面编号，最多展示 4 首 */
const SIDE_LETTERS = ["A1", "A2", "B1", "B2"];

export default function SongCards() {
  return (
    <section id="songs" className="scroll-mt-24 px-5 py-12 sm:px-10 lg:px-14">
      <div className="mb-8">
        <p className="archive-kicker text-xs font-black text-[#d8ac55]/75">Theme Songs</p>
        <h2 className="retro-title mt-1 flex items-center gap-3 text-5xl text-[#fff6e8]">
          动画歌曲 <Disc3 size={24} className="text-[#ffd24d]" />
        </h2>
      </div>
      <p className="memory-text mb-8 max-w-2xl text-base text-[#d9c39a]/84">
        那些年放学后响起的旋律，每一首都值得倒带重听。点一首歌去 B 站搜来听。
      </p>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {animationRecords.map((animation) => (
          <article
            key={animation.slug}
            className="group/cassette cassette-shell relative p-4 transition duration-300 hover:-translate-y-1.5"
          >
            {/* 四角螺丝 */}
            <span className="cassette-screw left-2 top-2" aria-hidden />
            <span className="cassette-screw right-2 top-2" aria-hidden />
            <span className="cassette-screw bottom-6 left-2" aria-hidden />
            <span className="cassette-screw bottom-6 right-2" aria-hidden />

            <div className="relative z-10">
              {/* 贴纸区：标题 + 双卷轴窗口 */}
              <div className="cassette-face">
                <div className="flex items-baseline justify-between gap-3">
                  <h3 className="retro-title truncate text-2xl leading-tight text-[#fff6e8]">{animation.name}</h3>
                  <span className="cassette-side shrink-0">{animation.year}</span>
                </div>
                <div className="cassette-window mt-3" aria-hidden>
                  <span className="cassette-reel" />
                  <span className="cassette-reel" />
                </div>
              </div>

              {/* 曲目列表：A/B 面 */}
              <ol className="mt-3 space-y-1 px-1">
                {animation.songs?.slice(0, 4).map((song, index) => (
                  <li key={`${song.name}-${song.type}`}>
                    <a
                      href={bilibiliSongUrl(song)}
                      target="_blank"
                      rel="noopener noreferrer"
                      title={`在 B 站搜索《${song.name}》`}
                      className="cassette-track"
                    >
                      <span className="cassette-side">{SIDE_LETTERS[index] ?? `·${index + 1}`}</span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-sm font-bold text-[#fff7e8]">{song.name}</span>
                        <span className="mt-0.5 block truncate text-[11px] text-[#d9c39a]/60">{song.singer}</span>
                      </span>
                      <span
                        className={`shrink-0 rounded-md border px-1.5 py-0.5 text-[10px] font-bold ${
                          typeColors[song.type] ?? "bg-[#c99a45]/10 text-[#d9c39a]/70 border-[#c99a45]/20"
                        }`}
                      >
                        {song.type}
                      </span>
                      <ArrowUpRight size={13} className="shrink-0 text-[#d9c39a]/0 transition group-hover/cassette:text-[#d9c39a]/45" />
                    </a>
                  </li>
                ))}
              </ol>

              <div className="cassette-grip" aria-hidden />
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
