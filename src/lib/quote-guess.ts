import { animations, type AnimationRecord, type ClassicQuote } from "@/lib/animations";

/**
 * 台词猜出处：每局 10 题，每题来自不同作品，四个选项 = 正确作品 + 3 部随机作品。
 * 题目在玩家点「开始」后才在客户端随机生成，服务端只渲染开场卡片，不会出现水合不一致。
 */
export const GUESS_ROUNDS = 10;
const OPTION_COUNT = 4;

export type GuessRound = {
  quote: ClassicQuote;
  answer: Pick<AnimationRecord, "slug" | "name" | "year">;
  options: Pick<AnimationRecord, "slug" | "name">[];
};

/** 台词里直接带出片名（「我是猪猪侠！」「果宝机甲，归位！」）就等于送分，不出这种题 */
const givesAwayTitle = (line: string, title: string) => line.includes(title.slice(0, 2));

const pool = animations
  .map((animation) => ({
    animation,
    quotes: animation.classicQuotes.filter((quote) => !givesAwayTitle(quote.line, animation.name)),
  }))
  .filter((entry) => entry.quotes.length > 0);

export const guessQuoteCount = pool.reduce((total, entry) => total + entry.quotes.length, 0);

function shuffle<T>(items: readonly T[], random: () => number) {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export function createGuessRounds(random: () => number = Math.random): GuessRound[] {
  return shuffle(pool, random)
    .slice(0, GUESS_ROUNDS)
    .map(({ animation, quotes }) => {
      const distractors = shuffle(
        animations.filter((item) => item.slug !== animation.slug),
        random,
      ).slice(0, OPTION_COUNT - 1);
      return {
        quote: quotes[Math.floor(random() * quotes.length)],
        answer: { slug: animation.slug, name: animation.name, year: animation.year },
        options: shuffle([animation, ...distractors], random).map(({ slug, name }) => ({ slug, name })),
      };
    });
}

export type GuessTier = { title: string; description: string };

export const getGuessTier = (score: number): GuessTier => {
  if (score >= GUESS_ROUNDS) return { title: "台词活字典", description: "一句台词就能报出片名，你的童年是逐帧背下来的。" };
  if (score >= 8) return { title: "电视机前的老观众", description: "大部分台词一听就有画面，错的那几道只是频道太多。" };
  if (score >= 5) return { title: "记得旋律忘了词", description: "名场面都在脑海里，就是台词和片名偶尔对不上号。" };
  return { title: "该补课啦", description: "这些台词也许没陪你长大，去档案馆翻翻，正好补上。" };
};
