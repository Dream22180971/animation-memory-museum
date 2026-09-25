import type { Metadata } from "next";
import SongCards from "@/components/songs/SongCards";
import Footer from "@/components/layout/Footer";
import Navbar from "@/components/layout/Navbar";
import { SITE_NAME, SITE_URL } from "@/lib/constants";

export const metadata: Metadata = {
  title: `动画歌曲 | ${SITE_NAME}`,
  description: "那些年放学后响起的旋律：片头曲、片尾曲、主题曲，全部整理成卡带，点一首歌去 B 站倒带重听。",
  alternates: {
    canonical: `${SITE_URL}songs`,
  },
};

export default function SongsPage() {
  return (
    <div className="relative min-h-screen bg-[#070806] text-[#fff3df] vignette">
      <div className="dust-layer" aria-hidden="true" />
      <Navbar />
      <main className="pb-16 pt-[104px]">
        <SongCards />
      </main>
      <Footer />
    </div>
  );
}
