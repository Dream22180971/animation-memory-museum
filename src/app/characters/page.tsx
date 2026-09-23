import type { Metadata } from "next";
import CharacterGraph from "@/components/characters/CharacterGraph";
import Footer from "@/components/layout/Footer";
import Navbar from "@/components/layout/Navbar";
import { SITE_NAME } from "@/lib/constants";

export const metadata: Metadata = {
  title: `角色关系图谱 | ${SITE_NAME}`,
  description: "从虹猫蓝兔到熊出没——用一张星座图看懂馆藏动画里的角色羁绊。",
  alternates: { canonical: "https://museum.seanwalter.top/characters" },
};

export default function CharactersPage() {
  return (
    <div className="relative min-h-screen bg-[#070806] text-[#fff3df] vignette">
      <Navbar />
      <main className="pb-16 pt-[88px]">
        <div className="site-shell immersive-shell border border-[#c99a45]/18 bg-[#080d0f]/88 px-4 py-8 shadow-[0_30px_100px_rgba(0,0,0,.35)] backdrop-blur-sm sm:px-8">
          <CharacterGraph />
        </div>
      </main>
      <Footer />
    </div>
  );
}
