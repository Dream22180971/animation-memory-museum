"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, CheckCircle2, Download, Play, Quote, RotateCcw, Share2, XCircle } from "lucide-react";
import { GUESS_ROUNDS, createGuessRounds, getGuessTier, guessQuoteCount, type GuessRound, type GuessTier } from "@/lib/quote-guess";
import { SITE_NAME, SITE_URL } from "@/lib/constants";
import { CARD_PADDING, CARD_WIDTH, renderShareCard, shareOrDownloadCard, wrapLines } from "@/lib/share-card";

type ShareState = "idle" | "copied" | "shared" | "error";
type CardState = "idle" | "busy" | "done" | "error";

/** 结果卡片：左边大号「答对数 / 10」，右边称号和描述 */
function drawGuessCard(score: number, tier: GuessTier) {
  return renderShareCard((ctx) => {
    ctx.fillStyle = "rgba(255,210,77,.78)";
    ctx.font = "700 22px 'Noto Sans SC', sans-serif";
    ctx.fillText("台词猜出处 · DIGITAL CHILDHOOD MUSEUM", CARD_PADDING, 130);

    ctx.fillStyle = "#d9c39a";
    ctx.font = "700 26px 'Noto Sans SC', sans-serif";
    ctx.fillText(`${GUESS_ROUNDS} 句台词，我认出了`, CARD_PADDING, 220);

    const scoreText = `${score}/${GUESS_ROUNDS}`;
    ctx.fillStyle = "#ffd24d";
    ctx.font = "900 150px 'Noto Sans SC', serif";
    ctx.fillText(scoreText, CARD_PADDING - 6, 380);
    const textX = CARD_PADDING + ctx.measureText(scoreText).width + 56;
    const textWidth = CARD_WIDTH - textX - CARD_PADDING;

    ctx.fillStyle = "#fff6e8";
    ctx.font = "900 50px 'Noto Sans SC', serif";
    wrapLines(ctx, tier.title, textWidth, 1).forEach((line) => ctx.fillText(line, textX, 262));

    ctx.fillStyle = "#f6ead2";
    ctx.font = "400 28px 'Noto Sans SC', serif";
    wrapLines(ctx, tier.description, textWidth, 3).forEach((line, index) => ctx.fillText(line, textX, 322 + index * 42));

    ctx.fillStyle = "#f2c96a";
    ctx.font = "700 24px 'Noto Sans SC', sans-serif";
    ctx.fillText("一句台词，你能认出是哪部吗？", textX, 470);
  });
}

export default function QuoteGuessGame() {
  /* 题目只在点「开始」后生成：服务端和首帧都渲染开场卡片，避免随机数导致水合不一致 */
  const [rounds, setRounds] = useState<GuessRound[] | null>(null);
  const [step, setStep] = useState(0);
  const [picks, setPicks] = useState<string[]>([]);
  const [finished, setFinished] = useState(false);
  const [shareState, setShareState] = useState<ShareState>("idle");
  const [cardState, setCardState] = useState<CardState>("idle");

  const score = rounds ? picks.filter((slug, index) => slug === rounds[index].answer.slug).length : 0;
  const tier = getGuessTier(score);

  const start = () => {
    setRounds(createGuessRounds());
    setStep(0);
    setPicks([]);
    setFinished(false);
    setShareState("idle");
    setCardState("idle");
  };

  const handleCard = async () => {
    setCardState("busy");
    try {
      const blob = await drawGuessCard(score, tier);
      if (!blob) throw new Error("canvas unavailable");
      const outcome = await shareOrDownloadCard(
        blob,
        `台词猜出处-${score}分.png`,
        `${SITE_NAME} · 台词猜出处`,
        `${GUESS_ROUNDS} 句国产动画台词，我认出了 ${score} 句，称号「${tier.title}」。`,
      );
      setCardState(outcome === "cancelled" ? "idle" : "done");
    } catch {
      setCardState("error");
    }
  };

  const handleShare = async () => {
    const shareText = `我在 00 后动画记忆馆玩台词猜出处，${GUESS_ROUNDS} 句认出了 ${score} 句，称号「${tier.title}」，你也来试试。`;
    try {
      if (navigator.share) {
        await navigator.share({ title: "台词猜出处", text: shareText, url: `${SITE_URL}guess` });
        setShareState("shared");
        return;
      }
      await navigator.clipboard.writeText(`${shareText} ${SITE_URL}guess`);
      setShareState("copied");
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") return;
      setShareState("error");
    }
  };

  if (!rounds) {
    return (
      <section className="museum-card rounded-2xl px-6 py-10 text-center sm:px-12">
        <Quote className="mx-auto text-[#ffd24d]" size={30} />
        <h2 className="retro-title mt-4 text-4xl text-[#fff6e8]">一句台词，认出是哪部</h2>
        <p className="memory-text mx-auto mt-4 max-w-xl text-base text-[#d9c39a]/85">
          从 {guessQuoteCount} 句馆藏台词里随机抽 {GUESS_ROUNDS} 句，每句来自不同的动画。台词里直接喊出片名的已经剔掉了，全凭记忆。
        </p>
        <button type="button" onClick={start} className="retro-button retro-button-secondary mt-8 text-sm">
          <Play size={17} />
          开始猜台词
        </button>
      </section>
    );
  }

  if (finished) {
    return (
      <motion.section
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        className="museum-card rounded-2xl px-6 py-10 text-center sm:px-12"
        aria-live="polite"
      >
        <p className="archive-kicker text-xs font-black text-[#d8ac55]/75">Your Score</p>
        <p className="mt-5 text-sm font-bold text-[#d9c39a]/80">{GUESS_ROUNDS} 句台词，你认出了</p>
        <p className="retro-title mt-2 text-7xl text-[#ffd24d]">
          {score} / {GUESS_ROUNDS}
        </p>
        <h2 className="retro-title mt-4 text-5xl text-[#fff6e8]">{tier.title}</h2>
        <p className="memory-text mx-auto mt-4 max-w-xl text-base text-[#d9c39a]/85">{tier.description}</p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <button onClick={handleShare} className="retro-button retro-button-secondary text-sm">
            {shareState === "idle" || shareState === "error" ? <Share2 size={17} /> : <CheckCircle2 size={17} />}
            {shareState === "shared" ? "已打开分享" : shareState === "copied" ? "结果已复制" : shareState === "error" ? "分享失败，重试" : "晒出我的成绩"}
          </button>
          <button onClick={handleCard} disabled={cardState === "busy"} className="retro-button retro-button-secondary text-sm">
            {cardState === "done" ? <CheckCircle2 size={17} /> : <Download size={17} />}
            {cardState === "busy" ? "卡片生成中…" : cardState === "done" ? "卡片已生成" : cardState === "error" ? "生成失败，重试" : "保存成绩卡片"}
          </button>
          <button onClick={start} className="retro-button retro-button-ghost text-sm">
            <RotateCcw size={17} />
            再来一局
          </button>
          <Link href="/quotes" className="retro-button retro-button-ghost text-sm">
            去名台词档案馆
          </Link>
        </div>
        {shareState === "error" ? (
          <p role="alert" className="mt-4 text-xs font-bold text-[#ff9a85]">分享失败，请稍后重试。</p>
        ) : null}
      </motion.section>
    );
  }

  const round = rounds[step];
  const picked = picks[step];
  const isLast = step === rounds.length - 1;

  return (
    <section className="museum-card rounded-2xl px-6 py-8 sm:px-12">
      <div className="flex items-center justify-between gap-4">
        <p className="archive-kicker text-xs font-black text-[#d8ac55]/75">
          第 {step + 1} / {rounds.length} 句
        </p>
        <p className="font-mono text-xs font-bold tracking-[.16em] text-[#d9c39a]/70">已答对 {score}</p>
      </div>
      <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-[#c99a45]/18">
        <div
          className="h-full rounded-full bg-[#ffd24d]/80 transition-all"
          style={{ width: `${((step + (picked ? 1 : 0)) / rounds.length) * 100}%` }}
        />
      </div>

      <blockquote className="retro-title mt-7 break-words text-3xl leading-snug text-[#fff6e8] [overflow-wrap:anywhere] sm:text-4xl">
        “{round.quote.line}”
      </blockquote>
      <p className="memory-text mt-3 text-sm text-[#d9c39a]/75">这句台词出自哪部动画？</p>

      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        {round.options.map((option) => {
          const isAnswer = option.slug === round.answer.slug;
          const isPicked = picked === option.slug;
          return (
            <button
              key={option.slug}
              type="button"
              onClick={() => setPicks((current) => [...current.slice(0, step), option.slug])}
              aria-pressed={isPicked}
              disabled={Boolean(picked)}
              className={[
                "retro-button retro-button-ghost justify-between text-base",
                picked && isAnswer ? "border-[#ffd24d]/80 text-[#ffe2a0]" : "",
                isPicked && !isAnswer ? "border-[#ff9a85]/70 text-[#ff9a85]" : "",
              ].join(" ")}
            >
              {option.name}
              {picked && isAnswer ? <CheckCircle2 size={18} /> : isPicked ? <XCircle size={18} /> : null}
            </button>
          );
        })}
      </div>

      {picked ? (
        <div className="mt-5 text-sm font-bold text-[#e6bd70]/85" aria-live="polite">
          <p>
            {picked === round.answer.slug ? "答对啦！" : "记忆偏差："}
            出自《{round.answer.name}》（{round.answer.year}） · {round.quote.speaker} · {round.quote.context}
          </p>
          <Link
            href={`/archive/${round.answer.slug}`}
            className="mt-2 inline-flex text-xs font-black text-[#ffd24d]/80 underline-offset-4 transition hover:text-[#ffd24d] hover:underline"
          >
            查看《{round.answer.name}》档案 →
          </Link>
        </div>
      ) : null}

      <button
        type="button"
        onClick={() => (isLast ? setFinished(true) : setStep((current) => current + 1))}
        disabled={!picked}
        className="retro-button retro-button-secondary mt-7 text-sm disabled:cursor-not-allowed disabled:opacity-45"
      >
        {isLast ? "查看成绩" : "下一句"}
        <ArrowRight size={17} />
      </button>
    </section>
  );
}
