"use client";

import { FormEvent, useEffect, useState } from "react";
import { motion, type Variants } from "framer-motion";
import { BookMarked, CheckCircle2, Download, HeartHandshake, PenLine, Share2, Trash2 } from "lucide-react";
import { FEEDBACK_URL, SITE_NAME, SITE_URL } from "@/lib/constants";

const sectionVariants: Variants = {
  hidden: { opacity: 0, y: 34 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1], staggerChildren: 0.08 },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.56, ease: [0.22, 1, 0.36, 1] },
  },
};

const STORAGE_KEY = "animation-memory-user-contributions";
const MAX_ENTRIES = 20;

type MemoryEntry = {
  animationName: string;
  memory: string;
  nickname: string;
  createdAt: string;
};

function readEntries(): MemoryEntry[] {
  try {
    const parsed = JSON.parse(window.localStorage.getItem(STORAGE_KEY) || "[]") as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (entry): entry is MemoryEntry =>
        !!entry &&
        typeof (entry as MemoryEntry).animationName === "string" &&
        typeof (entry as MemoryEntry).memory === "string",
    );
  } catch {
    return [];
  }
}

function formatDate(iso: string) {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";
  return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, "0")}.${String(date.getDate()).padStart(2, "0")}`;
}

function wrapLines(ctx: CanvasRenderingContext2D, text: string, maxWidth: number, maxLines: number) {
  const lines: string[] = [];
  let current = "";
  for (const char of text) {
    if (current && ctx.measureText(current + char).width > maxWidth) {
      lines.push(current);
      current = char;
      if (lines.length >= maxLines) return lines;
    } else {
      current += char;
    }
  }
  if (current && lines.length < maxLines) lines.push(current);
  return lines;
}

/** 卡片用 canvas 画，避免为一张分享图引入截图依赖 */
async function drawMemoryCard(entry: MemoryEntry) {
  const width = 1200;
  const height = 630;
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;

  await document.fonts.ready;

  const background = ctx.createLinearGradient(0, 0, width, height);
  background.addColorStop(0, "#17120a");
  background.addColorStop(1, "#060505");
  ctx.fillStyle = background;
  ctx.fillRect(0, 0, width, height);

  const glow = ctx.createRadialGradient(210, 130, 0, 210, 130, 620);
  glow.addColorStop(0, "rgba(255,210,77,.24)");
  glow.addColorStop(1, "rgba(255,210,77,0)");
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, width, height);

  ctx.fillStyle = "rgba(255,255,255,.035)";
  for (let y = 0; y < height; y += 6) ctx.fillRect(0, y, width, 1);

  ctx.strokeStyle = "rgba(255,210,77,.42)";
  ctx.lineWidth = 2;
  ctx.strokeRect(46, 46, width - 92, height - 92);

  ctx.fillStyle = "rgba(255,210,77,.78)";
  ctx.font = "700 22px 'Noto Sans SC', sans-serif";
  ctx.fillText("我的回忆册 · DIGITAL CHILDHOOD MUSEUM", 92, 130);

  ctx.fillStyle = "#fff6e8";
  ctx.font = "900 56px 'Noto Sans SC', serif";
  ctx.fillText(`《${entry.animationName}》`, 92, 210);

  ctx.fillStyle = "#f2c96a";
  ctx.font = "700 26px 'Noto Sans SC', sans-serif";
  ctx.fillText(`—— ${entry.nickname || "匿名观众"} · ${formatDate(entry.createdAt)}`, 92, 262);

  ctx.fillStyle = "#f6ead2";
  ctx.font = "400 34px 'Noto Sans SC', serif";
  const lines = wrapLines(ctx, entry.memory, width - 196, 6);
  lines.forEach((line, index) => ctx.fillText(line, 92, 340 + index * 52));

  ctx.fillStyle = "rgba(217,195,154,.62)";
  ctx.font = "600 22px 'Geist Mono', monospace";
  ctx.fillText(SITE_URL.replace(/^https?:\/\//, "").replace(/\/$/, ""), 92, height - 92);

  return new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/png"));
}

function fileNameFor(entry: MemoryEntry) {
  const safe = entry.animationName.replace(/[\\/:*?"<>|\s]+/g, "-").slice(0, 24) || "memory";
  return `回忆册-${safe}.png`;
}

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

/**
 * 桌面 Chrome 上 canShare(文件) 会返回 true，但 navigator.share 在没有分享目标时
 * 可能永远不 settle，所以必须带超时兜底，否则按钮会卡在「生成中」。
 */
async function tryShareFile(file: File, title: string, text: string): Promise<"shared" | "cancelled" | "unsupported"> {
  const data = { files: [file], title, text };
  if (!navigator.canShare?.(data)) return "unsupported";

  let timer: ReturnType<typeof setTimeout> | undefined;
  try {
    await Promise.race([
      navigator.share(data),
      new Promise<never>((_, reject) => {
        timer = setTimeout(() => reject(new DOMException("timeout", "TimeoutError")), 4000);
      }),
    ]);
    return "shared";
  } catch (error) {
    if (error instanceof DOMException && error.name === "AbortError") return "cancelled";
    return "unsupported";
  } finally {
    if (timer) clearTimeout(timer);
  }
}

export default function ContributionPanel() {
  const [draft, setDraft] = useState({ animationName: "", memory: "", nickname: "" });
  const [entries, setEntries] = useState<MemoryEntry[]>([]);
  const [submitState, setSubmitState] = useState<"idle" | "saved" | "error">("idle");
  const [shareState, setShareState] = useState<"idle" | "copied" | "shared" | "error">("idle");
  const [cardState, setCardState] = useState<{ key: string; tone: "busy" | "done" | "error" } | null>(null);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => setEntries(readEntries()));
    return () => window.cancelAnimationFrame(frame);
  }, []);

  const persist = (next: MemoryEntry[]) => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    setEntries(next);
  };

  const updateDraft = (field: keyof typeof draft, value: string) => {
    setSubmitState("idle");
    setDraft((current) => ({ ...current, [field]: value }));
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      const entry: MemoryEntry = { ...draft, createdAt: new Date().toISOString() };
      persist([entry, ...readEntries()].slice(0, MAX_ENTRIES));
      setDraft({ animationName: "", memory: "", nickname: "" });
      setSubmitState("saved");
    } catch {
      setSubmitState("error");
    }
  };

  const handleDelete = (target: MemoryEntry) => {
    persist(entries.filter((entry) => entry !== target));
  };

  const handleCard = async (entry: MemoryEntry) => {
    const key = entry.createdAt + entry.animationName;
    setCardState({ key, tone: "busy" });
    try {
      const blob = await drawMemoryCard(entry);
      if (!blob) throw new Error("canvas unavailable");
      const file = new File([blob], fileNameFor(entry), { type: "image/png" });
      const outcome = await tryShareFile(
        file,
        `${SITE_NAME} · 我的回忆册`,
        `我和《${entry.animationName}》的那段回忆。`,
      );
      if (outcome === "unsupported") downloadBlob(blob, fileNameFor(entry));
      setCardState(outcome === "cancelled" ? null : { key, tone: "done" });
    } catch {
      setCardState({ key, tone: "error" });
    }
  };

  const handleInvite = async () => {
    const shareText = `${SITE_NAME}：放学后的 17:30，是我们等了很久的动画时间。`;
    try {
      if (navigator.share) {
        await navigator.share({ title: SITE_NAME, text: shareText, url: SITE_URL });
        setShareState("shared");
        return;
      }
      await navigator.clipboard.writeText(`${shareText} ${SITE_URL}`);
      setShareState("copied");
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") return;
      setShareState("error");
    }
  };

  return (
    <motion.section
      id="contribute"
      variants={sectionVariants}
      initial="hidden"
      animate="visible"
      className="museum-section border-b border-[#c99a45]/12 px-4 py-14 sm:px-8 lg:px-12"
    >
      <div className="grid gap-5 lg:grid-cols-[0.92fr_1.08fr] lg:items-stretch">
        <motion.div variants={itemVariants} className="museum-card rounded-xl p-6">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_12%_10%,rgba(255,210,77,.18),transparent_32%),linear-gradient(135deg,rgba(255,210,77,.08),transparent_52%)]" />
          <div className="relative z-10">
            <p className="archive-kicker mb-3 text-xs font-black text-[#f3c76a]/70">Private Memory Book</p>
            <h2 className="retro-title text-5xl leading-none text-[#fff6e8]">我的回忆册</h2>
            <p className="memory-text mt-5 text-base text-[#d9c39a]/84">
              这本册子写给自己，不写给站方。回忆只存在这台设备的浏览器里，不上传、不公开、别人看不见；
              想给谁看，就导出成一张卡片带走。
            </p>
            <div className="mt-7 grid gap-3 text-sm font-bold text-[#ffe4a3] sm:grid-cols-3">
              {["写下动画", "存进册子", "导出卡片"].map((label, index) => (
                <div key={label} className="museum-card rounded-lg p-3">
                  <span className="cassette-label">0{index + 1}</span>
                  <p className="mt-1">{label}</p>
                </div>
              ))}
            </div>
            <button onClick={handleInvite} className="retro-button retro-button-secondary mt-7 text-sm">
              <Share2 size={17} />
              把记忆馆分享给朋友
            </button>
            <p className="mt-3 text-xs font-bold text-[#d9c39a]/72">
              {shareState === "shared"
                ? "已打开分享面板。"
                : shareState === "copied"
                  ? "分享文案和链接已复制。"
                  : shareState === "error"
                    ? "分享失败，请稍后重试。"
                    : "分享链接会带上本站地址。"}
            </p>
          </div>
        </motion.div>

        <motion.form variants={itemVariants} onSubmit={handleSubmit} className="museum-card rounded-xl p-5 sm:p-6">
          <div className="mb-5 flex items-center gap-3">
            <span className="grid h-11 w-11 place-items-center rounded-xl border border-[#f0c45d]/30 bg-[#21160c] text-[#f0c45d]">
              <HeartHandshake size={20} />
            </span>
            <div>
              <h3 className="text-lg font-black text-[#fff6e8]">记一段回忆</h3>
              <p className="mt-1 text-xs font-bold text-[#d9c39a]/72">
                只写入本机浏览器，最多留 {MAX_ENTRIES} 条，可随时导出或删除。
              </p>
            </div>
          </div>

          <label className="block text-sm font-black text-[#ffe4a3]">
            动画名称
            <input
              required
              value={draft.animationName}
              onChange={(event) => updateDraft("animationName", event.target.value)}
              placeholder="例如：超兽武装"
              className="retro-field mt-2 w-full rounded-lg px-4 py-3 text-sm outline-none transition"
            />
          </label>

          <label className="mt-4 block text-sm font-black text-[#ffe4a3]">
            你的回忆
            <textarea
              required
              value={draft.memory}
              onChange={(event) => updateDraft("memory", event.target.value)}
              placeholder="写一句最难忘的片段、台词或当时的心情。"
              rows={4}
              className="retro-field mt-2 w-full resize-none rounded-lg px-4 py-3 text-sm leading-6 outline-none transition"
            />
          </label>

          <label className="mt-4 block text-sm font-black text-[#ffe4a3]">
            昵称
            <input
              required
              value={draft.nickname}
              onChange={(event) => updateDraft("nickname", event.target.value)}
              placeholder="例如：放学别跑"
              className="retro-field mt-2 w-full rounded-lg px-4 py-3 text-sm outline-none transition"
            />
          </label>

          <div className="mt-5 flex flex-wrap items-center gap-3">
            <button type="submit" className="retro-button retro-button-primary text-sm">
              <PenLine size={17} />
              存进我的回忆册
            </button>
            {submitState === "saved" ? (
              <>
                <span className="inline-flex items-center gap-2 text-sm font-bold text-[#9ee6a8]">
                  <CheckCircle2 size={16} />
                  已写进册子，往下翻就能看到
                </span>
                <span aria-hidden="true">
                  <span className="stamp-seal">
                    <span className="text-[10px] font-black tracking-[.28em]">MEMORY SAVED</span>
                    <span className="text-base font-black leading-none">已收藏</span>
                  </span>
                </span>
              </>
            ) : submitState === "error" ? (
              <span role="alert" className="text-sm font-bold text-[#ff9a85]">
                保存失败，请检查浏览器存储权限后重试
              </span>
            ) : null}
          </div>
        </motion.form>
      </div>

      <motion.div variants={itemVariants} className="mt-6">
        <div className="flex flex-wrap items-center gap-3 border-t border-[#c99a45]/14 pt-6">
          <BookMarked size={18} className="text-[#f2c96a]" />
          <h3 className="retro-title text-2xl text-[#fff6e8]">册子里的回忆</h3>
          <span className="cassette-label">{entries.length} 条</span>
          <a
            href={FEEDBACK_URL}
            target="_blank"
            rel="noreferrer noopener"
            className="ml-auto text-[11px] font-bold text-[#d9c39a]/70 underline decoration-dotted underline-offset-4 transition hover:text-[#ffd24d]"
          >
            想让某段回忆进入公开馆藏？提 issue
          </a>
        </div>

        {entries.length === 0 ? (
          <p className="memory-text mt-4 text-sm text-[#d9c39a]/72">
            册子还是空的。写下第一部在你记忆里亮着的动画吧。
          </p>
        ) : (
          <ul className="mt-4 grid gap-3 md:grid-cols-2">
            {entries.map((entry) => {
              const key = entry.createdAt + entry.animationName;
              const state = cardState?.key === key ? cardState.tone : null;
              return (
                <li key={key} className="museum-card flex flex-col justify-between gap-4 rounded-xl p-5 sm:flex-row sm:items-end">
                  <div className="min-w-0">
                    <h4 className="text-base font-black text-[#fff6e8]">《{entry.animationName}》</h4>
                    <p className="memory-text mt-1.5 line-clamp-3 text-sm leading-6 text-[#e6cf9f]">{entry.memory}</p>
                    <p className="mt-2 font-mono text-[11px] font-bold text-[#d9c39a]/66">
                      {entry.nickname || "匿名观众"}
                      {formatDate(entry.createdAt) ? ` · ${formatDate(entry.createdAt)}` : ""}
                    </p>
                  </div>
                  <div className="flex shrink-0 flex-col items-start gap-1.5 sm:items-end">
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleCard(entry)}
                        disabled={state === "busy"}
                        className="retro-button retro-button-ghost text-xs"
                      >
                        <Download size={14} />
                        {state === "busy" ? "生成中…" : state === "done" ? "已导出" : "导出卡片"}
                      </button>
                      <button
                        type="button"
                        aria-label={`删除《${entry.animationName}》的回忆`}
                        onClick={() => handleDelete(entry)}
                        className="graph-tool"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                    {state === "error" ? (
                      <p role="alert" className="text-[11px] font-bold text-[#ff9a85]">
                        这台设备的浏览器没能生成图片。
                      </p>
                    ) : null}
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </motion.div>
    </motion.section>
  );
}
