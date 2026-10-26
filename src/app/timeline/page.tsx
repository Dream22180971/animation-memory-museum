import type { Metadata } from "next";
import ChildhoodLineup from "@/components/timeline/ChildhoodLineup";
import YearTimeline from "@/components/timeline/YearTimeline";
import Footer from "@/components/layout/Footer";
import Navbar from "@/components/layout/Navbar";
import { pageMetadata } from "@/lib/metadata";

export const metadata: Metadata = pageMetadata({
  title: "动画年代时间线",
  description: "从 1999 到 2018，按年代重访国产动画的黄金时代；选出你哪年上小学，看看那六年首播了哪些动画。",
  path: "timeline",
});

export default function TimelinePage() {
  return (
    <div className="relative min-h-screen bg-[#070806] text-[#fff3df] vignette">
      <div className="dust-layer" aria-hidden="true" />
      <Navbar />
      <main className="pb-16 pt-[104px]">
        <ChildhoodLineup />
        <YearTimeline />
      </main>
      <Footer />
    </div>
  );
}
