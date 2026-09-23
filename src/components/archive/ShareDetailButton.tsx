"use client";

import { useState } from "react";
import { CheckCircle2, Share2 } from "lucide-react";

export default function ShareDetailButton({ name, url }: { name: string; url: string }) {
  const [status, setStatus] = useState<"idle" | "copied" | "shared" | "error">("idle");
  const shareText = `我在动画记忆馆重温了《${name}》，这部动画也在你的童年里出现过吗？`;

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({ title: `我在动画记忆馆重温了《${name}》`, text: shareText, url });
        setStatus("shared");
        return;
      }

      await navigator.clipboard.writeText(`${shareText} ${url}`);
      setStatus("copied");
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") return;
      setStatus("error");
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <button
        onClick={handleShare}
        className="retro-button retro-button-ghost text-sm"
      >
        {status === "idle" || status === "error" ? <Share2 size={17} /> : <CheckCircle2 size={17} />}
        {status === "shared" ? "已打开分享" : status === "copied" ? "链接已复制" : status === "error" ? "分享失败，重试" : "分享这部动画"}
      </button>
      <p className="max-w-[220px] text-xs font-bold leading-5 text-[#d9c39a]/62">
        分享文案：我在动画记忆馆重温了《{name}》
      </p>
    </div>
  );
}
