import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import HeroSection from "@/components/hero/HeroSection";
import FilmStrip from "@/components/hero/FilmStrip";
import AnimationArchive from "@/components/archive/AnimationArchive";
import ContributionPanel from "@/components/engagement/ContributionPanel";
import YearTimeline from "@/components/timeline/YearTimeline";
import MemoryQuotes from "@/components/memories/MemoryQuotes";
import SongCards from "@/components/songs/SongCards";

export default function Home() {
  return (
    <div className="relative min-h-screen bg-[#070806] text-[#fff3df] vignette">
      {/* 规范 §10：胶片颗粒 + 尘埃氛围，替代科技粒子背景 */}
      <div className="dust-layer" aria-hidden="true" />
      <Navbar />
      <main>
        <HeroSection />
        <FilmStrip />
        <div className="site-shell immersive-shell -mt-1 border-y border-[#c99a45]/18 bg-[#080d0f]/88 shadow-[0_30px_100px_rgba(0,0,0,.35)] backdrop-blur-sm">
          <ContributionPanel />
          <AnimationArchive />
          <YearTimeline preview />
          <MemoryQuotes preview />
          <SongCards preview />
        </div>
      </main>
      <Footer />
    </div>
  );
}
