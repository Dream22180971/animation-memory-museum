import { Volume2 } from "lucide-react";
import { animations, quoteCount, recentAnimationsLabel, statsAvatars } from "@/lib/animations";

export default function StatsBar() {
  return (
    <div className="mx-auto mt-7 flex max-w-[1180px] flex-col items-center justify-between gap-4 rounded-full border border-[#d8ac55]/28 bg-[#090b0b]/45 px-7 py-4 text-sm text-[#ead6ad]/86 shadow-[0_16px_50px_rgba(0,0,0,.35)] backdrop-blur-md sm:flex-row">
      <div className="flex items-center gap-3">
        <Volume2 size={18} className="text-[#f0c45d]" />
        <span>最新入馆：{recentAnimationsLabel}</span>
      </div>
      <div className="flex items-center gap-4">
        <div className="flex -space-x-2">
          {statsAvatars.map((avatar) => (
            <span
              key={avatar.slug}
              className="grid h-8 w-8 place-items-center rounded-full border-2 border-[#17110b] text-xs font-bold text-white"
              style={{ background: avatar.color }}
            >
              {avatar.label}
            </span>
          ))}
        </div>
        <span>
          已整理 <b className="text-[#ffd45a]">{animations.length}</b> 部馆藏 · {quoteCount} 条台词
        </span>
      </div>
    </div>
  );
}
