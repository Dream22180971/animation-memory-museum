import HeroContent from "./HeroContent";
import CRTFrame from "./CRTFrame";
import StatsBar from "./StatsBar";

export default function HeroSection() {
  return (
    <section className="relative min-h-screen overflow-hidden">
      <div className="absolute inset-0 bg-[#080706]" />
      <div className="absolute inset-0 hero-room" />
      <div className="sunset-window" aria-hidden="true" />
      <div className="hero-wall-posters" aria-hidden="true" />
      <div className="hero-desk" aria-hidden="true" />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(5,4,3,.2)_0%,rgba(5,4,3,.03)_36%,rgba(5,4,3,.48)_100%)]" />
      <div className="absolute inset-x-0 bottom-0 h-56 bg-gradient-to-t from-[#080806] to-transparent" />

      <div className="hero-shell relative z-10 flex min-h-[calc(100vh-132px)] items-center pt-24">
        <div className="grid w-full items-center gap-12 lg:grid-cols-[1fr_540px]">
          <HeroContent />
          <CRTFrame />
        </div>
      </div>
      <div className="site-shell relative z-10 pb-10">
        <StatsBar />
      </div>
    </section>
  );
}
