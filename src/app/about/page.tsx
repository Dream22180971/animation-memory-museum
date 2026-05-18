import { Code2, Heart, Mail, MonitorPlay, Sparkles, Tv } from "lucide-react";
import Footer from "@/components/layout/Footer";
import Navbar from "@/components/layout/Navbar";
import FloatingRadio from "@/components/radio/FloatingRadio";
import { AUTHOR_GITHUB, FEEDBACK_URL, REPOSITORY_URL, SITE_DESCRIPTION, SITE_NAME } from "@/lib/constants";

const principles = [
  {
    icon: Tv,
    title: "放学后的17:30",
    text: "那是很多人一天里最期待的时刻：书包还没放稳，电视已经打开，片头曲响起，晚霞从窗外落到桌面上。",
  },
  {
    icon: MonitorPlay,
    title: "不是动画资源站",
    text: "这个网站不存储、不分发、不提供任何视频下载。它更像一间数字展厅，用氛围、档案、时间线和文字唤醒共同记忆。",
  },
  {
    icon: Heart,
    title: "收藏一代人的时间感",
    text: "我们怀念的不只是作品本身，还有那个坐在电视机前的自己、夏天的风、作业本、零食袋和等待开播的心情。",
  },
];

export default function AboutPage() {
  return (
    <div className="relative min-h-screen bg-[#070806] text-[#fff3df] vignette">
      <Navbar />
      <main className="pt-28">
        <section className="site-shell overflow-hidden rounded-3xl border border-[#c99a45]/18 bg-[#080d0f]/88 shadow-[0_30px_100px_rgba(0,0,0,.35)] backdrop-blur-sm">
          <div className="relative min-h-[560px] px-6 py-16 sm:px-10 lg:px-16">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_20%,rgba(255,157,73,.18),transparent_26%),radial-gradient(circle_at_82%_18%,rgba(240,196,93,.08),transparent_30%)]" />
            <div className="relative grid gap-12 lg:grid-cols-[1.05fr_.95fr] lg:items-center">
              <div>
                <p className="text-sm tracking-[0.38em] text-[#d8ac55]/75">ABOUT THE MUSEUM</p>
                <h1 className="hero-title font-hand mt-5 text-6xl leading-[1.08] text-[#fff6e6] sm:text-7xl">
                  关于<br />00后动画记忆馆
                </h1>
                <p className="mt-8 max-w-2xl text-lg leading-9 text-[#f7ebd4]/86">{SITE_DESCRIPTION}</p>
                <p className="mt-5 max-w-2xl text-base leading-8 text-[#d9c39a]/82">
                  {SITE_NAME} 的建站初心，是把国产动画黄金时代里那些熟悉而柔软的片段重新整理成一个可以漫游的数字空间。它不追求资料库式的冰冷完整，而是希望用户打开页面时，像重新回到一个被时间封存的房间。
                </p>
                <div className="mt-10 flex flex-wrap gap-4">
                  <a
                    href={AUTHOR_GITHUB}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-3 rounded-full bg-[#f5dfad] px-7 py-4 font-black text-[#21170d] shadow-[0_14px_40px_rgba(0,0,0,.38)]"
                  >
                    <Code2 size={20} />
                    联系作者
                  </a>
                  <a
                    href={FEEDBACK_URL}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-3 rounded-full border border-[#d8ac55]/45 px-7 py-4 font-bold text-[#f4d57d] hover:bg-[#f0c45d]/10"
                  >
                    <Mail size={20} />
                    GitHub 反馈
                  </a>
                </div>
              </div>

              <div className="rounded-2xl border border-[#c99a45]/18 bg-[#080806]/72 p-6">
                <div className="aspect-[4/3] overflow-hidden rounded-xl border border-[#c99a45]/22 bg-[url('/images/memories/tv-room.jpg')] bg-cover bg-center shadow-[inset_0_0_80px_rgba(0,0,0,.45)]" />
                <div className="mt-6 grid gap-4 sm:grid-cols-3">
                  {["CRT电视", "夏日傍晚", "国产动画"].map((item) => (
                    <div key={item} className="rounded-lg border border-[#c99a45]/16 bg-[#11100b]/70 p-4 text-center text-sm text-[#f3d99b]">
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="grid border-t border-[#c99a45]/12 lg:grid-cols-3">
            {principles.map((item) => {
              const Icon = item.icon;
              return (
                <article key={item.title} className="min-h-[280px] border-b border-[#c99a45]/12 p-8 lg:border-b-0 lg:border-r last:lg:border-r-0 lg:border-[#c99a45]/12">
                  <Icon className="text-[#ffd24d]" size={28} />
                  <h2 className="font-hand mt-6 text-4xl text-[#fff6e8]">{item.title}</h2>
                  <p className="mt-5 text-sm leading-7 text-[#d9c39a]/82">{item.text}</p>
                </article>
              );
            })}
          </div>

          <section className="border-t border-[#c99a45]/12 px-6 py-14 sm:px-10 lg:px-16">
            <div className="grid gap-8 lg:grid-cols-[.9fr_1.1fr]">
              <div>
                <p className="text-sm tracking-[0.32em] text-[#d8ac55]/75">WHY BUILD IT</p>
                <h2 className="font-hand mt-4 text-5xl text-[#fff6e8]">为什么做这个网站？</h2>
              </div>
              <div className="space-y-5 text-base leading-8 text-[#d9c39a]/84">
                <p>
                  因为很多童年记忆并不适合只用片名和年份保存。它们需要光线、声音、场景和一点点等待感。这个项目尝试把“放学回家打开电视”的体验，转译成一个可以截图、可以浏览、也可以继续扩展的网页。
                </p>
                <p>
                  第一阶段聚焦国产动画档案、年代时间线、怀旧文案和电台氛围。后续可以继续扩展角色关系、名台词档案、童年浓度测试，以及更多关于 old web 与数字记忆的互动。
                </p>
                <a
                  href={REPOSITORY_URL}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-3 rounded-full border border-[#d8ac55]/45 px-6 py-3 text-sm font-bold text-[#f4d57d] hover:bg-[#f0c45d]/10"
                >
                  <Sparkles size={18} />
                  查看项目仓库
                </a>
              </div>
            </div>
          </section>
        </section>
      </main>
      <FloatingRadio />
      <Footer />
    </div>
  );
}
