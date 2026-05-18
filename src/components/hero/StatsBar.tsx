import { Volume2 } from "lucide-react";

export default function StatsBar() {
  return (
    <div className="mx-auto mt-7 flex max-w-[1180px] flex-col items-center justify-between gap-4 rounded-full border border-[#d8ac55]/28 bg-[#090b0b]/45 px-7 py-4 text-sm text-[#ead6ad]/86 shadow-[0_16px_50px_rgba(0,0,0,.35)] backdrop-blur-md sm:flex-row">
      <div className="flex items-center gap-3">
        <Volume2 size={18} className="text-[#f0c45d]" />
        <span>最新收录：《围棋少年》《铁甲小宝》《天眼神虎》</span>
      </div>
      <div className="flex items-center gap-4">
        <div className="flex -space-x-2">
          {["超", "猪", "果", "虹", "神"].map((label, index) => (
            <span
              key={label}
              className="grid h-8 w-8 place-items-center rounded-full border-2 border-[#17110b] text-xs font-bold text-white"
              style={{ background: ["#9b4a35", "#d45a48", "#b7892c", "#7067a7", "#5c8d62"][index] }}
            >
              {label}
            </span>
          ))}
        </div>
        <span>已有 <b className="text-[#ffd45a]">8,921</b> 位小伙伴一起回忆童年</span>
      </div>
    </div>
  );
}
