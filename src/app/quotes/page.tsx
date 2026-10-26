import type { Metadata } from "next";
import QuoteArchive from "@/components/quotes/QuoteArchive";
import Footer from "@/components/layout/Footer";
import Navbar from "@/components/layout/Navbar";
import { pageMetadata } from "@/lib/metadata";
import { animations, quoteCount } from "@/lib/animations";

export const metadata: Metadata = pageMetadata({
  title: "名台词档案馆",
  description: `${quoteCount} 条国产动画名台词按作品归档——口头禅、登场句与燃点台词的数字档案。`,
  path: "quotes",
});

export default function QuotesPage() {
  return (
    <div className="relative min-h-screen bg-[#070806] text-[#fff3df] vignette">
      <Navbar />
      <main className="pb-16 pt-[88px]">
        <div className="site-shell immersive-shell border border-[#c99a45]/18 bg-[#080d0f]/88 px-4 py-8 shadow-[0_30px_100px_rgba(0,0,0,.35)] backdrop-blur-sm sm:px-8">
          <QuoteArchive />
        </div>
        <p className="mx-auto mt-4 max-w-3xl text-center text-xs font-bold text-[#d9c39a]/55">
          共 {animations.length} 部馆藏 · {quoteCount} 条台词 · 持续整理中
        </p>
      </main>
      <Footer />
    </div>
  );
}
