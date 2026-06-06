import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ExternalLink, MessageSquareQuote, PenLine, Sparkles } from "lucide-react";
import ShareDetailButton from "@/components/archive/ShareDetailButton";
import WatchedButton from "@/components/archive/WatchedButton";
import Footer from "@/components/layout/Footer";
import Navbar from "@/components/layout/Navbar";
import FloatingRadio from "@/components/radio/FloatingRadio";
import animationsData from "@/data/animations.json";
import { SITE_NAME, SITE_URL } from "@/lib/constants";

type ArchiveDetailProps = {
  params: Promise<{ slug: string }>;
};

const getAnimationBySlug = (slug: string) => animationsData.animations.find((animation) => animation.slug === slug);
const DEFAULT_QUOTE_COUNT = 8;
const EXTRA_QUOTE_SLOT_COUNT = 4;

export function generateStaticParams() {
  return animationsData.animations.map((animation) => ({ slug: animation.slug }));
}

export async function generateMetadata({ params }: ArchiveDetailProps): Promise<Metadata> {
  const { slug } = await params;
  const animation = getAnimationBySlug(slug);

  if (!animation) return {};

  return {
    title: `${animation.name} | ${SITE_NAME}`,
    description: animation.description,
    alternates: {
      canonical: `${SITE_URL}archive/${animation.slug}`,
    },
    openGraph: {
      title: `${animation.name} | ${SITE_NAME}`,
      description: animation.description,
      images: [animation.poster],
    },
  };
}

export default async function ArchiveDetailPage({ params }: ArchiveDetailProps) {
  const { slug } = await params;
  const animation = getAnimationBySlug(slug);

  if (!animation) notFound();

  const relatedAnimations = animationsData.animations
    .filter((item) => item.slug !== animation.slug && item.genre.some((genre) => animation.genre.includes(genre)))
    .slice(0, 3);
  const quoteSlots = [
    ...Array.from({ length: DEFAULT_QUOTE_COUNT }, (_, index) => animation.classicQuotes[index] ?? null),
    ...Array.from({ length: EXTRA_QUOTE_SLOT_COUNT }, () => null),
  ];
  const detailUrl = `${SITE_URL}archive/${animation.slug}`;

  return (
    <div className="relative min-h-screen bg-[#070806] text-[#fff3df] vignette">
      <Navbar />
      <main className="pb-16 pt-[88px]">
        <section className="museum-card site-shell relative rounded-2xl backdrop-blur-sm">
          <div className="absolute inset-0 bg-cover bg-center opacity-22 blur-[1px]" style={{ backgroundImage: `url(${animation.poster})` }} />
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(7,8,6,.96)_0%,rgba(7,8,6,.82)_48%,rgba(7,8,6,.48)_100%),linear-gradient(180deg,rgba(255,210,77,.04),rgba(7,8,6,.96)_72%)]" />

          <div className="relative grid gap-8 px-5 py-8 sm:px-10 lg:min-h-[calc(100svh-112px)] lg:grid-cols-[0.86fr_1.14fr] lg:items-center lg:px-14 lg:py-8">
            <div className="max-w-[620px]">
              <Link href="/archive" className="retro-button retro-button-ghost text-sm">
                <ArrowLeft size={17} />
                返回完整档案
              </Link>
              <p className="archive-kicker mt-6 text-xs font-black text-[#d8ac55]/78">Archive Detail</p>
              <h1 className="hero-title retro-title mt-4 text-6xl leading-[1.02] text-[#fff6e6] sm:text-7xl lg:text-[5.4rem]">
                {animation.name}
              </h1>
              <p className="memory-text mt-5 max-w-xl text-base text-[#f7ebd4]/88 lg:text-lg">{animation.description}</p>

              <div className="mt-6 flex flex-wrap gap-2">
                <span className="cassette-label cassette-label-muted">
                  {animation.year}
                </span>
                {animation.genre.map((genre) => (
                  <span key={genre} className="cassette-label cassette-label-muted">
                    {genre}
                  </span>
                ))}
              </div>

              <div className="mt-7 flex flex-wrap gap-3">
                <WatchedButton slug={animation.slug} name={animation.name} />
                <a
                  href={animation.baikeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="retro-button retro-button-secondary text-sm"
                >
                  百度百科介绍
                  <ExternalLink size={17} />
                </a>
                <Link
                  href="/#contribute"
                  className="retro-button retro-button-ghost text-sm"
                >
                  <PenLine size={17} />
                  贡献这部动画的回忆
                </Link>
                <ShareDetailButton name={animation.name} url={detailUrl} />
              </div>
            </div>

            <div className="archive-card relative w-full max-w-[860px] justify-self-end overflow-hidden rounded-[1.35rem] border border-[#c99a45]/28 bg-[#080806]/78 p-3 shadow-[0_24px_70px_rgba(0,0,0,.42)]">
              <div className="relative aspect-[16/10] max-h-[min(62svh,620px)] overflow-hidden rounded-xl border border-[#c99a45]/24 bg-[#050403] bg-contain bg-center bg-no-repeat shadow-[inset_0_0_90px_rgba(0,0,0,.46)]" style={{ backgroundImage: `url(${animation.poster})` }}>
                <div className="crt-scanlines absolute inset-0" />
                <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_38%,rgba(0,0,0,.72))]" />
                <div className="absolute bottom-5 left-5 right-5">
                  <p className="archive-kicker text-xs text-[#ffd24d]/80">Now Viewing</p>
                  <p className="retro-title mt-2 text-4xl text-[#fff6e8]">{animation.year}</p>
                </div>
              </div>
            </div>
          </div>

          <section className="relative border-t border-[#c99a45]/12 px-5 py-10 sm:px-10 lg:px-14">
            <div className="mb-6 flex items-center gap-3">
              <MessageSquareQuote className="text-[#ffd24d]" size={24} />
              <h2 className="retro-title text-5xl text-[#fff6e8]">经典台词</h2>
            </div>
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              {quoteSlots.map((quote, index) =>
                quote ? (
                  <figure key={quote.line} className="museum-card rounded-xl p-5">
                    <blockquote className="break-words text-xl font-black leading-snug text-[#fff7e8] [overflow-wrap:anywhere]">“{quote.line}”</blockquote>
                    <figcaption className="mt-4 flex flex-wrap items-center gap-2 text-sm font-bold text-[#e6bd70]/85">
                      <span>{quote.speaker}</span>
                      <span className="h-1 w-1 rounded-full bg-[#ffd24d]/55" />
                      <span>{quote.context}</span>
                    </figcaption>
                  </figure>
                ) : (
                  <Link
                    key={`quote-placeholder-${index}`}
                    href="/#contribute"
                    className="museum-card group rounded-xl border-dashed p-5 transition hover:-translate-y-1 hover:border-[#ffd24d]/55"
                  >
                    <p className="archive-kicker text-[11px] font-black text-[#f2c96a]/68">
                      Quote {String(index + 1).padStart(2, "0")}
                    </p>
                    <p className="mt-4 text-xl font-black leading-snug text-[#fff7e8]/78">待补充经典台词</p>
                    <p className="mt-4 text-sm font-bold leading-6 text-[#e6bd70]/72 group-hover:text-[#ffe4a3]">
                      记得这部动画的名场面？来补一句。
                    </p>
                  </Link>
                ),
              )}
            </div>
          </section>

          <section className="relative border-t border-[#c99a45]/12 px-5 py-10 sm:px-10 lg:px-14">
            <div className="mb-6 flex items-center justify-between gap-4">
              <div>
                <p className="archive-kicker text-xs font-black text-[#d8ac55]/75">Related Archive</p>
                <h2 className="retro-title mt-3 text-5xl text-[#fff6e8]">相似记忆</h2>
              </div>
              <Sparkles className="hidden text-[#ffd24d] sm:block" size={26} />
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              {relatedAnimations.map((item) => (
                <Link
                  key={item.slug}
                  href={`/archive/${item.slug}`}
                  className="archive-card museum-card group relative min-h-[190px] rounded-xl p-5 transition hover:-translate-y-1"
                >
                  <div className="absolute inset-0 bg-cover bg-center opacity-32 transition group-hover:scale-105 group-hover:opacity-45" style={{ backgroundImage: `url(${item.poster})` }} />
                  <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(7,8,6,.36),rgba(7,8,6,.94))]" />
                  <div className="relative z-10 flex h-full flex-col justify-end">
                    <p className="cassette-label cassette-label-muted">{item.year}</p>
                    <h3 className="retro-title mt-2 text-4xl text-[#fff6e8]">{item.name}</h3>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        </section>
      </main>
      <FloatingRadio />
      <Footer />
    </div>
  );
}
