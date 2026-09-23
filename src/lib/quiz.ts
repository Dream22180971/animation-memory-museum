import { animations } from "@/lib/animations";

/**
 * 童年浓度测试题库。
 * 知识题全部由 src/data/animations.json 数据生成，出题顺序固定（不随机），
 * 保证 E2E 测试可预期；引用的台词/歌曲/角色索引与馆藏数据对应。
 */
export type QuizOption = {
  label: string;
  points: number;
  correct?: boolean;
};

export type QuizQuestion = {
  id: string;
  prompt: string;
  hint: string;
  /** 自报题（无标准答案）还是知识题 */
  graded: boolean;
  /** 知识题答错时提示的答案 */
  answerNote?: string;
  options: QuizOption[];
};

const bySlug = (slug: string) => {
  const animation = animations.find((item) => item.slug === slug);
  if (!animation) throw new Error(`题库引用了不存在的馆藏: ${slug}`);
  return animation;
};

const showName = (slug: string) => bySlug(slug).name;

const firstSong = (slug: string) => {
  const song = bySlug(slug).songs[0];
  if (!song) throw new Error(`题库引用了无歌曲的馆藏: ${slug}`);
  return song;
};

const quoteQuestion = (id: string, slug: string, quoteIndex: number, distractorSlugs: string[]): QuizQuestion => {
  const animation = bySlug(slug);
  const quote = animation.classicQuotes[quoteIndex];
  const distractors = distractorSlugs.map((item) => ({ label: showName(item), points: 0 }));
  return {
    id,
    prompt: `台词「${quote.line}」出自哪部动画？`,
    hint: `提示：${quote.speaker} 的名场面`,
    graded: true,
    answerNote: `答案是《${animation.name}》`,
    options: [
      ...distractors.slice(0, 1),
      { label: animation.name, points: 2, correct: true },
      ...distractors.slice(1),
    ],
  };
};

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: "tv-time",
    prompt: "放学后 17:30，你守在电视机前的频率是？",
    hint: "凭第一感觉选，这里没有标准答案。",
    graded: false,
    options: [
      { label: "几乎每天", points: 3 },
      { label: "每周几次", points: 2 },
      { label: "偶尔看看", points: 1 },
      { label: "基本没印象", points: 0 },
    ],
  },
  {
    id: "binge",
    prompt: "这些馆藏里，你「追更」过（每天等下一集）的有几部？",
    hint: "追更 = 宁可不写作业也要等的主题曲时刻。",
    graded: false,
    options: [
      { label: "5 部以上", points: 3 },
      { label: "3-4 部", points: 2 },
      { label: "1-2 部", points: 1 },
      { label: "只是换台路过", points: 0 },
    ],
  },
  quoteQuestion("quote-chaoshou", "chaoshou-wuzhuang", 0, ["zhuzhuxia", "guobao-tegong", "shenbing-xiaojiang"]),
  quoteQuestion("quote-luoluo", "luoluo-lixianji", 2, ["guobao-tegong", "hongmao-lantu-qixia", "chaoshou-wuzhuang"]),
  {
    id: "song-hongmao",
    prompt: `${firstSong("hongmao-lantu-qixia").type}《${firstSong("hongmao-lantu-qixia").name}》属于哪部动画？`,
    hint: `演唱：${firstSong("hongmao-lantu-qixia").singer}`,
    graded: true,
    answerNote: `答案是《${showName("hongmao-lantu-qixia")}》`,
    options: [
      { label: showName("shenbing-xiaojiang"), points: 0 },
      { label: showName("hongmao-lantu-qixia"), points: 2, correct: true },
      { label: showName("luoluo-lixianji"), points: 0 },
      { label: showName("zhuzhuxia"), points: 0 },
    ],
  },
  {
    id: "character-shenbing",
    prompt: `角色「${bySlug("shenbing-xiaojiang").characters[0].name}」出自哪部动画？`,
    hint: "他有一只可以变身的天晶兽。",
    graded: true,
    answerNote: `答案是《${showName("shenbing-xiaojiang")}》`,
    options: [
      { label: showName("guobao-tegong"), points: 0 },
      { label: showName("chaoshou-wuzhuang"), points: 0 },
      { label: showName("shenbing-xiaojiang"), points: 2, correct: true },
      { label: showName("hongmao-lantu-qixia"), points: 0 },
    ],
  },
];

export const MAX_POINTS = QUIZ_QUESTIONS.reduce(
  (total, question) => total + Math.max(...question.options.map((option) => option.points)),
  0,
);

export type QuizTier = {
  title: string;
  description: string;
};

export const getResultTier = (percent: number): QuizTier => {
  if (percent >= 85) return { title: "镇馆之宝", description: "你的童年浓度高到可以住进展柜，晚饭前的电视光就是你的日出。" };
  if (percent >= 60) return { title: "资深馆藏员", description: "片头曲一响，你就能接上下一句，这份记忆值得收藏。" };
  if (percent >= 30) return { title: "常驻观众", description: "你对这些画面不陌生，只是遥控器偶尔会换台。" };
  return { title: "路过的小朋友", description: "你的童年可能在别的频道，欢迎留下来逛逛这段时光。" };
};
