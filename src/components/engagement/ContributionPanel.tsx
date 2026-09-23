"use client";

import { FormEvent, useState } from "react";
import { motion, type Variants } from "framer-motion";
import { CheckCircle2, Clipboard, HeartHandshake, PenLine, Share2 } from "lucide-react";
import { SITE_URL } from "@/lib/constants";

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

type ContributionDraft = {
  animationName: string;
  memory: string;
  nickname: string;
};

export default function ContributionPanel() {
  const [draft, setDraft] = useState<ContributionDraft>({ animationName: "", memory: "", nickname: "" });
  const [submitState, setSubmitState] = useState<"idle" | "saved" | "error">("idle");
  const [shareState, setShareState] = useState<"idle" | "copied" | "shared" | "error">("idle");

  const updateDraft = (field: keyof ContributionDraft, value: string) => {
    setSubmitState("idle");
    setDraft((currentDraft) => ({ ...currentDraft, [field]: value }));
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      let parsedItems: unknown = [];
      try {
        parsedItems = JSON.parse(window.localStorage.getItem(STORAGE_KEY) || "[]");
      } catch {
        // Replace malformed local drafts with the newly submitted entry.
      }
      const savedItems = Array.isArray(parsedItems) ? parsedItems : [];
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify([{ ...draft, createdAt: new Date().toISOString() }, ...savedItems].slice(0, 20)));
      setDraft({ animationName: "", memory: "", nickname: "" });
      setSubmitState("saved");
    } catch {
      setSubmitState("error");
    }
  };

  const handleShare = async () => {
    const shareText = "我在 00 后动画记忆馆重温童年国产动画，一起补全我们的动画记忆库。";
    try {
      if (navigator.share) {
        await navigator.share({ title: "00后动画记忆馆", text: shareText, url: SITE_URL });
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
        <motion.div
          variants={itemVariants}
          className="museum-card rounded-xl p-6"
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_12%_10%,rgba(255,210,77,.18),transparent_32%),linear-gradient(135deg,rgba(255,210,77,.08),transparent_52%)]" />
          <div className="relative z-10">
            <p className="archive-kicker mb-3 text-xs font-black text-[#f3c76a]/70">Join the Archive</p>
            <h2 className="retro-title text-5xl leading-none text-[#fff6e8]">一起补全童年记忆</h2>
            <p className="memory-text mt-5 text-base text-[#d9c39a]/84">
              先从一段文字开始。你可以写下某部动画、某句台词，或者放学后守在电视机前的一个瞬间。
            </p>
            <div className="mt-7 grid gap-3 text-sm font-bold text-[#ffe4a3] sm:grid-cols-3">
              {["写下动画", "留下回忆", "邀请朋友"].map((label, index) => (
                <div key={label} className="museum-card rounded-lg p-3">
                  <span className="cassette-label">0{index + 1}</span>
                  <p className="mt-1">{label}</p>
                </div>
              ))}
            </div>
            <button
              onClick={handleShare}
              className="retro-button retro-button-secondary mt-7 text-sm"
            >
              <Share2 size={17} />
              邀请朋友一起回忆
            </button>
            <p className="mt-3 text-xs font-bold text-[#d9c39a]/64">
              {shareState === "shared" ? "已打开分享面板。" : shareState === "copied" ? "分享文案和链接已复制。" : shareState === "error" ? "分享失败，请稍后重试。" : "分享链接会带上本站地址。"}
            </p>
          </div>
        </motion.div>

        <motion.form
          variants={itemVariants}
          onSubmit={handleSubmit}
          className="museum-card rounded-xl p-5 sm:p-6"
        >
          <div className="mb-5 flex items-center gap-3">
            <span className="grid h-11 w-11 place-items-center rounded-xl border border-[#f0c45d]/30 bg-[#21160c] text-[#f0c45d]">
              <HeartHandshake size={20} />
            </span>
            <div>
              <h3 className="text-lg font-black text-[#fff6e8]">贡献我的回忆</h3>
              <p className="mt-1 text-xs font-bold text-[#d9c39a]/68">当前为前端暂存版本，后续可接入审核与公开展示。</p>
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
            <button
              type="submit"
              className="retro-button retro-button-primary text-sm"
            >
              <PenLine size={17} />
              暂存这段回忆
            </button>
            {submitState === "saved" ? (
              <span className="inline-flex items-center gap-2 text-sm font-bold text-[#9ee6a8]">
                <CheckCircle2 size={16} />
                已保存到本地草稿
              </span>
            ) : submitState === "error" ? (
              <span role="alert" className="text-sm font-bold text-[#ff9a85]">
                保存失败，请检查浏览器存储权限后重试
              </span>
            ) : (
              <span className="inline-flex items-center gap-2 text-xs font-bold text-[#d9c39a]/64">
                <Clipboard size={15} />
                后续可升级为公开投稿
              </span>
            )}
          </div>
        </motion.form>
      </div>
    </motion.section>
  );
}
