import type { Metadata } from "next";
import ChildhoodQuiz from "@/components/quiz/ChildhoodQuiz";
import Footer from "@/components/layout/Footer";
import Navbar from "@/components/layout/Navbar";
import { SITE_NAME, SITE_URL } from "@/lib/constants";

export const metadata: Metadata = {
  title: `童年浓度测试 | ${SITE_NAME}`,
  description: "六道题，测出你的童年浓度：守电视的频率、追更的记忆，还有那些台词、主题曲和角色。",
  alternates: {
    canonical: `${SITE_URL}quiz`,
  },
};

export default function QuizPage() {
  return (
    <div className="relative min-h-screen bg-[#070806] text-[#fff3df] vignette">
      {/* 规范 §10：胶片颗粒 + 尘埃氛围，替代科技粒子背景 */}
      <div className="dust-layer" aria-hidden="true" />
      <Navbar />
      <main className="pb-16 pt-[110px]">
        <section className="site-shell mx-auto max-w-[860px] px-5">
          <p className="archive-kicker text-xs font-black text-[#d8ac55]/75">Childhood Test</p>
          <h1 className="hero-title retro-title mt-3 text-5xl leading-[1.05] text-[#fff6e6] sm:text-6xl">
            童年浓度测试
          </h1>
          <p className="memory-text mt-4 max-w-2xl text-base text-[#d9c39a]/85">
            六道题，测出你的童年浓度。有守着电视的记忆，也有台词、主题曲和角色的默契。凭第一感觉选就好。
          </p>
          <div className="mt-8">
            <ChildhoodQuiz />
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
