import type { Metadata } from "next";
import SongCards from "@/components/songs/SongCards";
import Footer from "@/components/layout/Footer";
import Navbar from "@/components/layout/Navbar";
import { pageMetadata } from "@/lib/metadata";

export const metadata: Metadata = pageMetadata({
  title: "动画歌曲",
  description: "那些年放学后响起的旋律：片头曲、片尾曲、主题曲，全部整理成卡带，点一首歌去 B 站倒带重听。",
  path: "songs",
});

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
