import HeroContent from "./HeroContent";
import HeroSwiper from "./HeroSwiper";
import StatsBar from "./StatsBar";

export default function HeroSection() {
  return (
    <section className="relative min-h-screen overflow-hidden">
      <div className="absolute inset-0 bg-[#080706]" />
      <div className="absolute inset-0 hero-room" />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(5,4,3,.36)_0%,rgba(5,4,3,.08)_42%,rgba(5,4,3,.56)_100%)]" />
      <div className="absolute inset-x-0 bottom-0 h-56 bg-gradient-to-t from-[#080806] to-transparent" />

      <div className="hero-shell relative z-10 flex min-h-[calc(100vh-132px)] items-center pt-24">
        <div className="grid w-full items-center gap-12 lg:grid-cols-[1fr_560px]">
          <HeroContent />
          <HeroSwiper />
        </div>
      </div>
      <div className="site-shell relative z-10 pb-10">
        <StatsBar />
      </div>
    </section>
  );
}
