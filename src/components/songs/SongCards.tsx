import { ArrowUpRight, Music } from "lucide-react";
import { animations as animationRecords, neteaseSongLink } from "@/lib/animations";
import PosterImage from "@/components/ui/PosterImage";

const typeColors: Record<string, string> = {
  "主题曲": "bg-[#ffd24d]/15 text-[#ffd24d] border-[#ffd24d]/30",
  "片头曲": "bg-[#5fa867]/15 text-[#8fd99a] border-[#5fa867]/30",
  "片尾曲": "bg-[#a94b35]/15 text-[#e88a7a] border-[#a94b35]/30",
};

export default function SongCards() {
  return (
    <section id="songs" className="scroll-mt-24 px-5 py-12 sm:px-10 lg:px-14">
      <div className="mb-8">
        <p className="archive-kicker text-xs font-black text-[#d8ac55]/75">Theme Songs</p>
        <h2 className="retro-title mt-1 flex items-center gap-3 text-5xl text-[#fff6e8]">
          动画歌曲 <Music size={24} className="text-[#ffd24d]" />
        </h2>
      </div>
      <p className="memory-text mb-8 max-w-2xl text-base text-[#d9c39a]/84">
        那些年放学后响起的旋律，每一首都是打开记忆的钥匙。点一行去网易云音乐搜来听。
      </p>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {animationRecords.map((animation) => (
          <div
            key={animation.slug}
            className="museum-card group relative overflow-hidden rounded-xl p-5 transition hover:-translate-y-1"
          >
            <div className="absolute inset-0 opacity-20 transition group-hover:scale-105 group-hover:opacity-30">
              <PosterImage src={animation.poster} alt="" sizes="(max-width:640px) 92vw, (max-width:1024px) 46vw, 30vw" />
            </div>
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(7,8,6,.3),rgba(7,8,6,.92))]" />

            <div className="relative z-10">
              <div className="mb-4 flex items-baseline justify-between">
                <h3 className="retro-title text-3xl text-[#fff6e8]">{animation.name}</h3>
                <span className="cassette-label cassette-label-muted text-xs">{animation.year}</span>
              </div>

              <div className="space-y-2.5">
                {animation.songs?.map((song) => (
                  <a
                    key={`${song.name}-${song.type}`}
                    href={neteaseSongLink(song)}
                    target="_blank"
                    rel="noopener noreferrer"
                    title={song.neteaseUrl ? `在网易云音乐播放《${song.name}》` : `在网易云音乐搜索《${song.name}》`}
                    className="flex items-center gap-3 rounded-lg border border-[#c99a45]/12 bg-[#070806]/60 px-3 py-2.5 transition hover:border-[#e8505e]/45 hover:bg-[#e8505e]/[0.06]"
                  >
                    <Music size={14} className="shrink-0 text-[#d9c39a]/50" />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-bold text-[#fff7e8]">{song.name}</p>
                      <p className="mt-0.5 text-xs text-[#d9c39a]/60">{song.singer}</p>
                    </div>
                    <span
                      className={`shrink-0 rounded-md border px-2 py-0.5 text-[11px] font-bold ${
                        typeColors[song.type] ?? "bg-[#c99a45]/10 text-[#d9c39a]/70 border-[#c99a45]/20"
                      }`}
                    >
                      {song.type}
                    </span>
                    <ArrowUpRight size={14} className="shrink-0 text-[#d9c39a]/0 transition group-hover:text-[#d9c39a]/40" />
                  </a>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
