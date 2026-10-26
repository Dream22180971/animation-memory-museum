"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, CheckCircle2, Download, RotateCcw, Share2, Sparkles, XCircle } from "lucide-react";
import { MAX_POINTS, QUIZ_QUESTIONS, getResultTier, type QuizOption } from "@/lib/quiz";
import { SITE_NAME, SITE_URL } from "@/lib/constants";
import { CARD_PADDING, CARD_WIDTH, renderShareCard, shareOrDownloadCard, wrapLines } from "@/lib/share-card";

type ShareState = "idle" | "copied" | "shared" | "error";
type CardState = "idle" | "busy" | "done" | "error";

type QuizResult = { percent: number; tier: { title: string; description: string }; correctCount: number; gradedCount: number };

/** 结果卡片：左边大号百分比，右边称号、描述和答对题数 */
function drawResultCard(result: QuizResult) {
  return renderShareCard((ctx) => {
    ctx.fillStyle = "rgba(255,210,77,.78)";
    ctx.font = "700 22px 'Noto Sans SC', sans-serif";
    ctx.fillText("童年浓度测试 · DIGITAL CHILDHOOD MUSEUM", CARD_PADDING, 130);

    ctx.fillStyle = "#d9c39a";
    ctx.font = "700 26px 'Noto Sans SC', sans-serif";
    ctx.fillText("我的童年浓度", CARD_PADDING, 220);

    const percentText = `${result.percent}%`;
    ctx.fillStyle = "#ffd24d";
    ctx.font = "900 150px 'Noto Sans SC', serif";
    ctx.fillText(percentText, CARD_PADDING - 6, 380);
    const textX = CARD_PADDING + ctx.measureText(percentText).width + 56;
    const textWidth = CARD_WIDTH - textX - CARD_PADDING;

    ctx.fillStyle = "#fff6e8";
    ctx.font = "900 54px 'Noto Sans SC', serif";
    ctx.fillText(result.tier.title, textX, 262);

    ctx.fillStyle = "#f6ead2";
    ctx.font = "400 28px 'Noto Sans SC', serif";
    wrapLines(ctx, result.tier.description, textWidth, 3).forEach((line, index) => ctx.fillText(line, textX, 322 + index * 42));

    ctx.fillStyle = "#f2c96a";
    ctx.font = "700 24px 'Noto Sans SC', sans-serif";
    ctx.fillText(`记忆题答对 ${result.correctCount} / ${result.gradedCount} 道 · 来测测你的`, textX, 470);
  });
}

export default function ChildhoodQuiz() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Array<QuizOption | null>>(() => QUIZ_QUESTIONS.map(() => null));
  const [finished, setFinished] = useState(false);
  const [shareState, setShareState] = useState<ShareState>("idle");
  const [cardState, setCardState] = useState<CardState>("idle");

  const question = QUIZ_QUESTIONS[step];
  const selected = answers[step];
  const isLast = step === QUIZ_QUESTIONS.length - 1;

  const result = useMemo(() => {
    const totalPoints = answers.reduce((sum, option) => sum + (option?.points ?? 0), 0);
    const percent = Math.round((totalPoints / MAX_POINTS) * 100);
    const gradedQuestions = QUIZ_QUESTIONS.filter((item) => item.graded);
    const correctCount = gradedQuestions.filter(
      (item) => answers[QUIZ_QUESTIONS.indexOf(item)]?.correct === true,
    ).length;
    return { percent, tier: getResultTier(percent), correctCount, gradedCount: gradedQuestions.length };
  }, [answers]);

  const handleSelect = (option: QuizOption) => {
    if (selected) return;
    setAnswers((current) => current.map((item, index) => (index === step ? option : item)));
  };

  const handleNext = () => {
    if (!selected) return;
    if (isLast) setFinished(true);
    else setStep((current) => current + 1);
  };

  const handleRestart = () => {
    setAnswers(QUIZ_QUESTIONS.map(() => null));
    setStep(0);
    setFinished(false);
    setShareState("idle");
    setCardState("idle");
  };

  const handleCard = async () => {
    setCardState("busy");
    try {
      const blob = await drawResultCard(result);
      if (!blob) throw new Error("canvas unavailable");
      const outcome = await shareOrDownloadCard(
        blob,
        `童年浓度-${result.percent}.png`,
        `${SITE_NAME} · 童年浓度测试`,
        `我的童年浓度是 ${result.percent}%，称号「${result.tier.title}」。`,
      );
      setCardState(outcome === "cancelled" ? "idle" : "done");
    } catch {
      setCardState("error");
    }
  };

  const handleShare = async () => {
    const shareText = `我在 00 后动画记忆馆测出 ${result.percent}% 的童年浓度，称号「${result.tier.title}」，来测测你的。`;
    try {
      if (navigator.share) {
        await navigator.share({ title: "童年浓度测试", text: shareText, url: `${SITE_URL}quiz` });
        setShareState("shared");
        return;
      }
      await navigator.clipboard.writeText(`${shareText} ${SITE_URL}quiz`);
      setShareState("copied");
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") return;
      setShareState("error");
    }
  };

  if (finished) {
    return (
      <motion.section
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        className="museum-card rounded-2xl px-6 py-10 text-center sm:px-12"
        aria-live="polite"
      >
        <p className="archive-kicker text-xs font-black text-[#d8ac55]/75">Your Result</p>
        <p className="mt-5 text-sm font-bold text-[#d9c39a]/80">你的童年浓度</p>
        <p className="retro-title mt-2 text-7xl text-[#ffd24d]">{result.percent}%</p>
        <h2 className="retro-title mt-4 text-5xl text-[#fff6e8]">{result.tier.title}</h2>
        <p className="memory-text mx-auto mt-4 max-w-xl text-base text-[#d9c39a]/85">{result.tier.description}</p>
        <p className="mt-3 text-sm font-bold text-[#e6bd70]/80">
          记忆题答对 {result.correctCount} / {result.gradedCount} 道
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <button onClick={handleShare} className="retro-button retro-button-secondary text-sm">
            {shareState === "idle" || shareState === "error" ? <Share2 size={17} /> : <CheckCircle2 size={17} />}
            {shareState === "shared" ? "已打开分享" : shareState === "copied" ? "结果已复制" : shareState === "error" ? "分享失败，重试" : "晒出我的童年浓度"}
          </button>
          <button onClick={handleCard} disabled={cardState === "busy"} className="retro-button retro-button-secondary text-sm">
            {cardState === "done" ? <CheckCircle2 size={17} /> : <Download size={17} />}
            {cardState === "busy" ? "卡片生成中…" : cardState === "done" ? "卡片已生成" : cardState === "error" ? "生成失败，重试" : "保存结果卡片"}
          </button>
          <button onClick={handleRestart} className="retro-button retro-button-ghost text-sm">
            <RotateCcw size={17} />
            再测一次
          </button>
          <Link href="/archive" className="retro-button retro-button-ghost text-sm">
            去翻完整档案
          </Link>
        </div>
        {shareState === "error" ? (
          <p role="alert" className="mt-4 text-xs font-bold text-[#ff9a85]">分享失败，请稍后重试。</p>
        ) : null}
      </motion.section>
    );
  }

  const showAnswerNote = Boolean(selected && question.graded);

  return (
    <section className="museum-card rounded-2xl px-6 py-8 sm:px-12">
      <div className="flex items-center justify-between gap-4">
        <p className="archive-kicker text-xs font-black text-[#d8ac55]/75">
          第 {step + 1} / {QUIZ_QUESTIONS.length} 题
        </p>
        <Sparkles className="text-[#ffd24d]" size={22} />
      </div>
      <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-[#c99a45]/18">
        <div
          className="h-full rounded-full bg-[#ffd24d]/80 transition-all"
          style={{ width: `${((step + (selected ? 1 : 0)) / QUIZ_QUESTIONS.length) * 100}%` }}
        />
      </div>

      <h2 className="retro-title mt-6 text-3xl leading-snug text-[#fff6e8] sm:text-4xl">{question.prompt}</h2>
      <p className="memory-text mt-3 text-sm text-[#d9c39a]/75">{question.hint}</p>

      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        {question.options.map((option) => {
          const isSelected = selected?.label === option.label;
          const showCorrect = Boolean(selected && question.graded && option.correct);
          const showWrong = Boolean(isSelected && question.graded && !option.correct);
          return (
            <button
              key={option.label}
              type="button"
              onClick={() => handleSelect(option)}
              aria-pressed={isSelected}
              disabled={Boolean(selected)}
              className={[
                "retro-button retro-button-ghost justify-between text-base",
                showCorrect ? "border-[#ffd24d]/80 text-[#ffe2a0]" : "",
                showWrong ? "border-[#ff9a85]/70 text-[#ff9a85]" : "",
              ].join(" ")}
            >
              {option.label}
              {showCorrect ? <CheckCircle2 size={18} /> : showWrong ? <XCircle size={18} /> : null}
            </button>
          );
        })}
      </div>

      {showAnswerNote ? (
        <p className="mt-5 text-sm font-bold text-[#e6bd70]/85">
          {selected?.correct ? "答对啦！" : "记忆偏差："}
          {question.answerNote}
        </p>
      ) : selected ? (
        <p className="mt-5 text-sm font-bold text-[#e6bd70]/85">已记录这段记忆。</p>
      ) : null}

      <button
        type="button"
        onClick={handleNext}
        disabled={!selected}
        className="retro-button retro-button-secondary mt-7 text-sm disabled:cursor-not-allowed disabled:opacity-45"
      >
        {isLast ? "查看结果" : "下一题"}
        <ArrowRight size={17} />
      </button>
    </section>
  );
}
