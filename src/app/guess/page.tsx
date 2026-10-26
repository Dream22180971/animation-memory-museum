import type { Metadata } from "next";
import QuoteGuessGame from "@/components/quotes/QuoteGuessGame";
import Footer from "@/components/layout/Footer";
import Navbar from "@/components/layout/Navbar";
import { pageMetadata } from "@/lib/metadata";
import { GUESS_ROUNDS } from "@/lib/quote-guess";

export const metadata: Metadata = pageMetadata({
  title: "台词猜出处",
  description: `随机抽 ${GUESS_ROUNDS} 句国产动画名台词，四选一猜出处：一句话就能认出是哪部，才是真的守过电视。`,
  path: "guess",
});

export default function GuessPage() {
  return (
    <div className="relative min-h-screen bg-[#070806] text-[#fff3df] vignette">
      <div className="dust-layer" aria-hidden="true" />
      <Navbar />
      <main className="pb-16 pt-[110px]">
        <section className="site-shell mx-auto max-w-[860px] px-5">
          <p className="archive-kicker text-xs font-black text-[#d8ac55]/75">Quote Guess</p>
          <h1 className="hero-title retro-title mt-3 text-5xl leading-[1.05] text-[#fff6e8] sm:text-6xl">台词猜出处</h1>
          <p className="memory-text mt-4 max-w-2xl text-base text-[#d9c39a]/85">
            只给一句台词，四个片名里挑出它的出处。每局 {GUESS_ROUNDS} 句，每次随机，答完会告诉你是谁、在什么场景说的。
          </p>
          <div className="mt-8">
            <QuoteGuessGame />
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
