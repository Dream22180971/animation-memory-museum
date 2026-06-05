import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import HeroSection from "@/components/hero/HeroSection";
import AnimationArchive from "@/components/archive/AnimationArchive";
import ContributionPanel from "@/components/engagement/ContributionPanel";
import YearTimeline from "@/components/timeline/YearTimeline";
import MemoryQuotes from "@/components/memories/MemoryQuotes";
import FloatingRadio from "@/components/radio/FloatingRadio";
import ParticleBackground from "@/components/hero/ParticleBackground";

export default function Home() {
  return (
    <div className="relative min-h-screen bg-[#070806] text-[#fff3df] vignette">
      <ParticleBackground />
      <Navbar />
      <main>
        <HeroSection />
        <div className="site-shell immersive-shell -mt-1 border-y border-[#c99a45]/18 bg-[#080d0f]/88 shadow-[0_30px_100px_rgba(0,0,0,.35)] backdrop-blur-sm">
          <ContributionPanel />
          <AnimationArchive />
          <YearTimeline />
          <MemoryQuotes />
          <div id="radio" className="scroll-anchor" aria-hidden="true" />
        </div>
      </main>
      <FloatingRadio />
      <Footer />
    </div>
  );
}
