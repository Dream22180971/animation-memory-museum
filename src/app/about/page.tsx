import { Code2, Heart, Mail, MonitorPlay, Music, Sparkles, Tv } from "lucide-react";
import Footer from "@/components/layout/Footer";
import Navbar from "@/components/layout/Navbar";
import { AUTHOR_GITHUB, FEEDBACK_URL, REPOSITORY_URL, SITE_DESCRIPTION, SITE_NAME } from "@/lib/constants";

const principles = [
  {
    icon: Tv,
    title: "放学后的 17:30",
    text: "书包还没放稳，电视已经亮起来。这里保存的是开播前那几秒的心跳。",
  },
  {
    icon: MonitorPlay,
    title: "不是资源站",
    text: "不存储、不分发视频。它更像一间会发光的数字展厅，用氛围、档案和时间线唤醒记忆。",
  },
  {
    icon: Heart,
    title: "收藏一代人的时间感",
    text: "我们怀念的不只是作品，还有夏天的风、作业本、零食袋和片头曲响起时的自己。",
  },
];

const roomTags = ["CRT 电视", "夏日晚霞", "国产动画", "放学回家", "童年片头"];

export default function AboutPage() {
  return (
    <div className="relative min-h-screen bg-[#070806] text-[#fff3df] vignette">
      <Navbar />
      <main className="pt-24">
        <section className="museum-card site-shell rounded-2xl backdrop-blur-sm">
          <div className="about-hero relative min-h-[640px] px-5 py-14 sm:px-10 lg:px-16 lg:py-20">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_20%,rgba(255,157,73,.22),transparent_28%),radial-gradient(circle_at_84%_22%,rgba(255,210,77,.14),transparent_30%),linear-gradient(180deg,rgba(255,210,77,.03),transparent_58%)]" />
            <div className="absolute inset-x-10 top-10 hidden h-px bg-gradient-to-r from-transparent via-[#ffd24d]/32 to-transparent lg:block" />

            <div className="relative grid gap-12 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
              <div>
                <p className="archive-kicker text-xs font-black text-[#d8ac55]/78">About The Museum</p>
                <h1 className="hero-title retro-title mt-5 text-5xl leading-[1.08] text-[#fff6e6] sm:text-6xl lg:text-7xl">
                  关于<br />动画记忆馆
                </h1>
                <p className="memory-text mt-7 max-w-2xl text-lg text-[#f7ebd4]/88">{SITE_DESCRIPTION}</p>
                <p className="memory-text mt-5 max-w-2xl text-base text-[#d9c39a]/84">
                  {SITE_NAME} 想把国产动画黄金时代里那些熟悉、柔软、带着颗粒感的片段，重新整理成一间可以慢慢逛的数字房间。
                  它不追求资料库式的冰冷完整，而是让人一打开页面，就像回到一间被时间封存的客厅。
                </p>

                <div className="mt-9 flex flex-wrap gap-3">
                  <a
                    href={AUTHOR_GITHUB}
                    target="_blank"
                    rel="noreferrer"
                    className="retro-button retro-button-primary text-sm"
                  >
                    <Code2 size={19} />
                    联系作者
                  </a>
                  <a
                    href={FEEDBACK_URL}
                    target="_blank"
                    rel="noreferrer"
                    className="retro-button retro-button-ghost text-sm"
                  >
                    <Mail size={19} />
                    GitHub 反馈
                  </a>
                </div>
              </div>

              <div className="about-crt archive-card relative overflow-hidden rounded-[1.2rem] border border-[#c99a45]/26 bg-[#080806]/74 p-3 shadow-[0_24px_70px_rgba(0,0,0,.42)]">
                <div className="relative aspect-[16/11] overflow-hidden rounded-xl border border-[#c99a45]/24 bg-[url('/images/memories/tv-room-hero.webp')] bg-cover bg-center shadow-[inset_0_0_90px_rgba(0,0,0,.52)]">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_48%_43%,rgba(255,210,77,.12),transparent_30%),linear-gradient(180deg,transparent,rgba(0,0,0,.72))]" />
                  <div className="crt-scanlines absolute inset-0" />
                  <div className="absolute bottom-5 left-5 right-5">
                    <p className="archive-kicker text-xs text-[#ffd24d]/80">Now Playing</p>
                    <p className="retro-title mt-2 text-4xl text-[#fff6e8]">一间回忆客厅</p>
                  </div>
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  {roomTags.map((item) => (
                    <span key={item} className="cassette-label cassette-label-muted">
                      {item}
                    </span>
                  ))}
                </div>
                <div className="cassette-label absolute -right-5 -top-5 hidden px-4 py-3 lg:flex">
                  Signal On
                </div>
              </div>
            </div>
          </div>

          <div className="grid border-t border-[#c99a45]/12 lg:grid-cols-3">
            {principles.map((item) => {
              const Icon = item.icon;
              return (
                <article key={item.title} className="group relative min-h-[230px] overflow-hidden border-b border-[#c99a45]/12 p-7 transition hover:bg-[#ffd24d]/[0.035] lg:border-b-0 lg:border-r last:lg:border-r-0 lg:border-[#c99a45]/12">
                  <div className="absolute inset-x-0 top-0 h-px origin-left scale-x-0 bg-gradient-to-r from-[#ffd24d] to-transparent transition duration-500 group-hover:scale-x-100" />
                  <Icon className="text-[#ffd24d]" size={28} />
                  <h2 className="retro-title mt-5 text-4xl text-[#fff6e8]">{item.title}</h2>
                  <p className="memory-text mt-4 max-w-sm text-sm text-[#d9c39a]/84">{item.text}</p>
                </article>
              );
            })}
          </div>

          <section className="relative overflow-hidden border-t border-[#c99a45]/12 px-5 py-14 sm:px-10 lg:px-16">
            <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(255,210,77,.045),transparent_22%,transparent_78%,rgba(255,210,77,.045))]" />
            <div className="relative grid gap-8 lg:grid-cols-[0.82fr_1.18fr]">
              <div>
                <p className="archive-kicker text-xs font-black text-[#d8ac55]/75">Why Build It</p>
                <h2 className="retro-title mt-4 text-5xl leading-tight text-[#fff6e8]">为什么做这个网站？</h2>
              </div>
              <div className="memory-text space-y-5 text-base text-[#d9c39a]/84">
                <p>
                  很多童年记忆不适合只用片名和年份保存。它们需要光线、声音、场景和一点点等待感。
                  这个项目尝试把“放学回家打开电视”的体验，翻译成一个可以浏览、截图、继续扩展的网页。
                </p>
                <p>
                  角色关系图谱、名台词档案馆与童年浓度测试已经上线。后续可以继续扩展更多 old web 与数字记忆的互动。
                </p>
                <a
                  href={REPOSITORY_URL}
                  target="_blank"
                  rel="noreferrer"
                  className="retro-button retro-button-ghost text-sm"
                >
                  <Sparkles size={18} />
                  查看项目仓库
                </a>
              </div>
            </div>
          </section>

          <section id="copyright" className="relative border-t border-[#c99a45]/12 px-5 py-14 sm:px-10 lg:px-16">
            <div className="grid gap-8 lg:grid-cols-[0.82fr_1.18fr]">
              <div>
                <p className="archive-kicker text-xs font-black text-[#d8ac55]/75">Copyright &amp; Credits</p>
                <h2 className="retro-title mt-4 text-5xl leading-tight text-[#fff6e8]">版权与致谢</h2>
                <p className="memory-text mt-4 text-sm text-[#d9c39a]/72">
                  本站为非商业的个人怀旧项目，不提供任何影片或音频资源的在线播放与下载。
                </p>
              </div>
              <div className="memory-text space-y-4 text-base text-[#d9c39a]/84">
                <p>
                  所有动画名称、海报、角色、台词与歌曲等素材的版权归原作者及出品方所有。
                  海报图片收集自 Bangumi（bgm.tv）等公开社区数据库，仅用于本站非商业的展示与介绍；
                  数据考据参考了百度百科等公开资料，来源均在各条目中注明。
                </p>
                <p>
                  若你是相关权利人，不希望自己的作品素材在本站展示，请通过 GitHub Issue 联系我们，
                  说明对应条目即可，核实后会在 24 小时内下架或替换。
                </p>
                <a
                  href={FEEDBACK_URL}
                  target="_blank"
                  rel="noreferrer"
                  className="retro-button retro-button-ghost text-sm"
                >
                  <Mail size={16} />
                  联系作者 · 提交下架申请
                </a>
              </div>
            </div>
          </section>

          <section className="relative border-t border-[#c99a45]/12 px-5 py-10 sm:px-10 lg:px-16">
            <div className="museum-card flex flex-col gap-4 rounded-2xl p-5 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-4">
                <span className="grid h-12 w-12 place-items-center rounded-full bg-[#ffd24d]/12 text-[#ffd24d]">
                  <Music size={22} />
                </span>
                <div>
                  <p className="retro-title text-3xl text-[#fff6e8]">歌曲还在播放</p>
                  <p className="mt-1 text-sm text-[#d9c39a]/78">这个页面现在和主页共享同一套展馆语气、光效和复古互动。</p>
                </div>
              </div>
              <span className="cassette-label">
                Archive Alive
              </span>
            </div>
          </section>
        </section>
      </main>
      <Footer />
    </div>
  );
}
