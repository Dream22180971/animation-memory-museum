import type { Metadata } from "next";
import YearTimeline from "@/components/timeline/YearTimeline";
import Footer from "@/components/layout/Footer";
import Navbar from "@/components/layout/Navbar";
import { SITE_NAME, SITE_URL } from "@/lib/constants";

export const metadata: Metadata = {
  title: `动画年代时间线 | ${SITE_NAME}`,
  description: "从 1999 到 2018，按年代重访国产动画的黄金时代：每个放学后的傍晚，串起一代人的童年。",
  alternates: {
    canonical: `${SITE_URL}timeline`,
  },
};

export default function TimelinePage() {
  return (
    <div className="relative min-h-screen bg-[#070806] text-[#fff3df] vignette">
      <div className="dust-layer" aria-hidden="true" />
      <Navbar />
      <main className="pb-16 pt-[104px]">
        <YearTimeline />
      </main>
      <Footer />
    </div>
  );
}
