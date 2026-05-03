import { motion, useScroll, useTransform, useSpring, useMotionValue } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, Mail, Phone, MessageCircle, Github, Globe, Download, Sparkles } from "lucide-react";

/* --------- helpers --------- */
const Reveal = ({ children, delay = 0, y = 24 }: any) => (
  <motion.div
    initial={{ opacity: 0, y }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-80px" }}
    transition={{ duration: 0.7, delay, ease: [0.2, 0.8, 0.2, 1] }}
  >
    {children}
  </motion.div>
);

const SectionLabel = ({ n, t }: { n: string; t: string }) => (
  <div className="flex items-center gap-3 font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
    <span className="text-accent">{n}</span>
    <span className="h-px w-8 bg-border" />
    <span>{t}</span>
  </div>
);

/* --------- Cute Mouse Cursor --------- */
const Cursor = () => {
  const x = useMotionValue(-100), y = useMotionValue(-100);
  const sx = useSpring(x, { stiffness: 400, damping: 28, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 400, damping: 28, mass: 0.4 });
  const [hover, setHover] = useState(false);
  const [down, setDown] = useState(false);
  useEffect(() => {
    const m = (e: MouseEvent) => { x.set(e.clientX); y.set(e.clientY); };
    const o = (e: any) => setHover(!!e.target.closest?.("a,button,[data-cursor]"));
    const d = () => setDown(true);
    const u = () => setDown(false);
    window.addEventListener("mousemove", m);
    window.addEventListener("mouseover", o);
    window.addEventListener("mousedown", d);
    window.addEventListener("mouseup", u);
    return () => {
      window.removeEventListener("mousemove", m);
      window.removeEventListener("mouseover", o);
      window.removeEventListener("mousedown", d);
      window.removeEventListener("mouseup", u);
    };
  }, [x, y]);
  return (
    <motion.div
      className="pointer-events-none fixed left-0 top-0 z-[100] hidden md:block"
      style={{ x: sx, y: sy }}
    >
      <motion.div
        animate={{ scale: down ? 0.85 : hover ? 1.2 : 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        style={{ filter: "drop-shadow(0 6px 16px hsl(335 85% 65% / 0.45))" }}
      >
        {/* Arrow-shaped mouse pointer: pink border + frosted glass fill */}
        <svg width="56" height="64" viewBox="0 0 56 64" className="overflow-visible">
          <defs>
            <clipPath id="arrow-clip">
              <path d="M6 4 L6 50 L18 40 L26 58 L34 54 L26 36 L42 36 Z" />
            </clipPath>
            <linearGradient id="arrow-glass" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="hsl(340 100% 98%)" stopOpacity="0.85"/>
              <stop offset="50%" stopColor="hsl(335 90% 88%)" stopOpacity="0.45"/>
              <stop offset="100%" stopColor="hsl(320 90% 80%)" stopOpacity="0.55"/>
            </linearGradient>
          </defs>
          {/* frosted glass body */}
          <foreignObject x="0" y="0" width="56" height="64" clipPath="url(#arrow-clip)">
            <div
              // @ts-ignore
              xmlns="http://www.w3.org/1999/xhtml"
              style={{
                width: "100%",
                height: "100%",
                background: "linear-gradient(135deg, hsla(340,100%,98%,0.55), hsla(320,90%,80%,0.35))",
                backdropFilter: "blur(8px) saturate(160%)",
                WebkitBackdropFilter: "blur(8px) saturate(160%)",
              }}
            />
          </foreignObject>
          {/* gradient sheen overlay */}
          <path d="M6 4 L6 50 L18 40 L26 58 L34 54 L26 36 L42 36 Z" fill="url(#arrow-glass)" />
          {/* pink border */}
          <path
            d="M6 4 L6 50 L18 40 L26 58 L34 54 L26 36 L42 36 Z"
            fill="none"
            stroke="hsl(335 90% 60%)"
            strokeWidth="2.2"
            strokeLinejoin="round"
          />
          {/* highlight shimmer */}
          <path d="M9 8 L9 22" stroke="hsl(0 0% 100% / 0.7)" strokeWidth="1.2" strokeLinecap="round"/>
        </svg>
      </motion.div>
    </motion.div>
  );
};

/* --------- Falling Petals --------- */
const Petals = () => {
  const petals = Array.from({ length: 22 }, (_, i) => {
    const left = Math.random() * 100;
    const size = 14 + Math.random() * 22;
    const duration = 12 + Math.random() * 14;
    const delay = -Math.random() * 20;
    const drift = (Math.random() - 0.5) * 240;
    const hue = 320 + Math.random() * 25;
    const sat = 80 + Math.random() * 15;
    const light = 75 + Math.random() * 12;
    return (
      <svg
        key={i}
        className="petal"
        style={{
          left: `${left}vw`,
          width: size,
          height: size,
          animationDuration: `${duration}s`,
          animationDelay: `${delay}s`,
          // @ts-ignore
          "--drift": `${drift}px`,
        }}
        viewBox="0 0 24 24"
      >
        <path
          d="M12 2 C 16 6, 18 12, 12 22 C 6 12, 8 6, 12 2 Z"
          fill={`hsl(${hue} ${sat}% ${light}%)`}
          stroke={`hsl(${hue} 60% 60% / 0.5)`}
          strokeWidth="0.5"
        />
      </svg>
    );
  });
  return <div aria-hidden className="pointer-events-none fixed inset-0 z-[2] overflow-hidden">{petals}</div>;
};

/* --------- Hero --------- */
const Hero = () => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const op = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <section ref={ref} className="relative min-h-screen overflow-hidden bg-cream">
      <motion.div style={{ y, opacity: op }} className="relative z-10 mx-auto max-w-7xl px-6 pt-28 md:pt-36 pb-20">
        <Reveal>
          <div className="flex items-center gap-3 font-mono text-xs uppercase tracking-[0.25em] text-muted-foreground">
            <span className="h-2 w-2 rounded-full bg-accent animate-pulse" />
            2027 届 · 浙江财经大学 · 现可入职
          </div>
        </Reveal>

        <h1 className="mt-8 font-serif text-[14vw] leading-[0.88] tracking-tight md:text-[10vw] lg:text-[180px]">
          <Reveal delay={0.05}><span className="block">钱奕彤</span></Reveal>
          <Reveal delay={0.15}>
            <span className="block italic text-muted-foreground">Yvette<span className="text-accent">.</span></span>
          </Reveal>
        </h1>

        <Reveal delay={0.3}>
          <div className="mt-10 grid gap-8 md:grid-cols-12">
            <p className="md:col-span-7 text-2xl md:text-3xl leading-snug font-light text-balance">
              我在做<span className="bg-highlight/60 px-1">运营类实习生</span>。
              三个账号矩阵 <span className="font-mono text-base align-middle">·</span> 一个上线 App <span className="font-mono text-base align-middle">·</span> 30+ 场校园活动传播 <span className="font-mono text-base align-middle">·</span> 一等奖商赛策划。
            </p>
            <div className="md:col-span-5 md:pl-8 md:border-l border-border">
              <p className="text-sm text-muted-foreground leading-relaxed">
                市场营销（中美合作）本科 · 大三在读 · 浙江杭州。
                擅长内容运营、账号增长、活动传播与产品策划，能从选题到数据复盘独立闭环。
              </p>
              <div className="mt-6 flex flex-wrap gap-2 font-mono text-xs">
                {["内容运营", "账号增长", "活动传播", "AI 协作", "产品策划"].map(t => (
                  <span key={t} className="rounded-full border border-border px-3 py-1">{t}</span>
                ))}
              </div>
            </div>
          </div>
        </Reveal>
      </motion.div>

      {/* ticker */}
      <div className="absolute bottom-0 left-0 right-0 border-y border-border bg-ink text-cream py-4 overflow-hidden">
        <div className="ticker font-mono text-sm">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="flex shrink-0 items-center gap-10 pr-10">
              <span>兴趣种草号 · 粉丝 2,147</span><span className="text-accent">★</span>
              <span>获赞与收藏 10.3w+</span><span className="text-accent">★</span>
              <span>单篇最高浏览 202,890</span><span className="text-accent">★</span>
              <span>单篇最高点赞 2.5w</span><span className="text-accent">★</span>
              <span>美妆个护 · 小红书 35,327 浏览</span><span className="text-accent">★</span>
              <span>抖音单条最高播放 46,820</span><span className="text-accent">★</span>
              <span>Luv Bunny App 已上线</span><span className="text-accent">★</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

/* --------- Tools --------- */
const Tools = () => {
  const groups = [
    { title: "内容创作", items: ["剪映", "Pr", "Ps", "Lr", "美图秀秀", "Canva"] },
    { title: "账号运营", items: ["小红书后台", "抖音创作者", "视频号", "微信公众号"] },
    { title: "数据与办公", items: ["Excel", "问卷星", "SPSS 基础", "PPT"] },
    { title: "AI 与产品", items: ["ChatGPT", "Midjourney", "Cursor", "Notion", "Figma"] },
  ];
  return (
    <section id="tools" className="border-t border-border bg-paper py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-6">
        <Reveal><SectionLabel n="01" t="工具与方法" /></Reveal>
        <Reveal delay={0.1}>
          <h2 className="mt-6 font-serif text-5xl md:text-7xl tracking-tight max-w-4xl">
            从选题到复盘，<span className="italic text-accent">工具链</span>已就绪。
          </h2>
        </Reveal>
        <div className="mt-16 grid gap-8 md:grid-cols-4">
          {groups.map((g, i) => (
            <Reveal key={g.title} delay={i * 0.08}>
              <div className="lift group rounded-2xl border border-border bg-card p-6 h-full">
                <div className="font-mono text-xs uppercase tracking-widest text-muted-foreground">0{i + 1}</div>
                <div className="mt-2 font-serif text-2xl">{g.title}</div>
                <div className="mt-6 flex flex-wrap gap-2">
                  {g.items.map(t => (
                    <span key={t} className="rounded-full bg-secondary px-3 py-1 text-xs font-mono">{t}</span>
                  ))}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
};

/* --------- Stat counter --------- */
const Counter = ({ to, suffix = "", prefix = "" }: { to: number; suffix?: string; prefix?: string }) => {
  const [v, setV] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        const start = performance.now(), dur = 1400;
        const tick = (t: number) => {
          const p = Math.min(1, (t - start) / dur);
          setV(Math.floor(to * (1 - Math.pow(1 - p, 3))));
          if (p < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
        obs.disconnect();
      }
    }, { threshold: 0.5 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [to]);
  return <span ref={ref}>{prefix}{v.toLocaleString()}{suffix}</span>;
};

/* --------- Account showcase --------- */
type Account = {
  id: string;
  tag: string;
  name: string;
  sub: string;
  stats: { label: string; value: number; suffix?: string; prefix?: string }[];
  bullets: string[];
  images: string[];
  accent: string;
};

const accounts: Account[] = [
  {
    id: "pin",
    tag: "小红书 · 兴趣种草",
    name: "兴趣种草类账号",
    sub: "AI 原图 / 教程 / 用户复刻 / 连续更新",
    accent: "hsl(14 88% 55%)",
    stats: [
      { label: "粉丝", value: 2147 },
      { label: "获赞与收藏", value: 103000, suffix: "+" },
      { label: "单篇最高浏览", value: 202890 },
      { label: "最高点赞", value: 25000 },
      { label: "最高收藏", value: 6212 },
      { label: "最高评论", value: 470 },
      { label: "最高转发", value: 1560 },
      { label: "粉丝群", value: 2, suffix: " · 近 100 人" },
    ],
    bullets: [
      "持续更新 5 个视频 + 17 篇图文，单账号驱动 10w+ 收藏",
      "评论区话题预设 + 催更图纸返图机制，沉淀两个粉丝群",
      "AI 原图 + 教程拆解，用户主动复刻、艾特好友讨论",
    ],
    images: ["pin_IMG_4524", "pin_IMG_4525", "pin_IMG_4527", "pin_IMG_4530", "pin_IMG_4532", "pin_IMG_4536", "pin_IMG_4540", "pin_IMG_4548"],
  },
  {
    id: "xhs",
    tag: "小红书 · 美妆个护",
    name: "美妆个护账号",
    sub: "小红书内容运营",
    accent: "hsl(340 85% 55%)",
    stats: [
      { label: "粉丝", value: 1678 },
      { label: "获赞与收藏", value: 23000 },
      { label: "图文", value: 10, suffix: " 篇" },
      { label: "最高浏览", value: 35327 },
      { label: "最高点赞", value: 8730 },
      { label: "最高收藏", value: 2106 },
      { label: "最高评论", value: 78 },
    ],
    bullets: [
      "妆容 / 个护 / 测评 / 平价种草四线内容矩阵",
      "封面调色 + 标题 A/B + 画质修复 + 收藏需求拆解",
      "高点赞 + 高收藏 + 评论反馈明确，单篇破 3.5w 浏览",
    ],
    images: ["beauty_xhs_IMG_4549", "beauty_xhs_IMG_4550", "beauty_xhs_IMG_4552", "beauty_xhs_IMG_4554", "beauty_xhs_IMG_4556", "beauty_xhs_IMG_4566"],
  },
  {
    id: "dy",
    tag: "抖音 · 美妆个护",
    name: "美妆个护账号",
    sub: "抖音短视频内容运营",
    accent: "hsl(195 90% 50%)",
    stats: [
      { label: "粉丝", value: 1521 },
      { label: "总点赞", value: 5375 },
      { label: "作品", value: 11, suffix: " 条" },
      { label: "最高播放", value: 46820 },
      { label: "最高点赞", value: 1057 },
    ],
    bullets: [
      "短视频脚本 / 拍摄 / 剪辑 / 封面 / 发布全流程独立闭环",
      "针对完播率与互动率持续打磨节奏与钩子",
    ],
    images: ["beauty_douyin_IMG_4558", "beauty_douyin_IMG_4568"],
  },
];

const AccountBlock = ({ a, idx }: { a: Account; idx: number }) => {
  const reverse = idx % 2 === 1;
  return (
    <div className="border-t border-border py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-6 grid gap-12 md:grid-cols-12">
        <div className={`md:col-span-5 ${reverse ? "md:order-2" : ""}`}>
          <Reveal>
            <div className="font-mono text-xs uppercase tracking-widest text-accent">{a.tag}</div>
            <h3 className="mt-4 font-serif text-4xl md:text-5xl leading-tight">{a.name}</h3>
            <div className="mt-2 text-muted-foreground">{a.sub}</div>
          </Reveal>
          <Reveal delay={0.1}>
            <ul className="mt-8 space-y-3">
              {a.bullets.map(b => (
                <li key={b} className="flex gap-3 text-sm leading-relaxed">
                  <span className="mt-2 h-1 w-3 shrink-0 rounded-full bg-accent" />
                  <span>{b}</span>
                </li>
              ))}
            </ul>
          </Reveal>
          <Reveal delay={0.2}>
            <div className="mt-10 grid grid-cols-2 gap-x-6 gap-y-5">
              {a.stats.map(s => (
                <div key={s.label} className="border-t border-border pt-3">
                  <div className="font-serif text-3xl tabular-nums">
                    <Counter to={s.value} suffix={s.suffix} prefix={s.prefix} />
                  </div>
                  <div className="mt-1 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">{s.label}</div>
                </div>
              ))}
            </div>
          </Reveal>
        </div>

        <div className={`md:col-span-7 ${reverse ? "md:order-1" : ""}`}>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {a.images.map((src, i) => (
              <Reveal key={src} delay={i * 0.04} y={40}>
                <motion.div
                  whileHover={{ scale: 1.04, rotate: i % 2 ? 1 : -1 }}
                  transition={{ type: "spring", stiffness: 200, damping: 15 }}
                  className="overflow-hidden rounded-xl border border-border bg-secondary aspect-[3/4] shadow-soft"
                >
                  <img src={`/portfolio/${src}.webp`} alt={a.name} loading="lazy" className="h-full w-full object-cover" />
                </motion.div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const Accounts = () => (
  <section id="accounts" className="bg-cream">
    <div className="mx-auto max-w-7xl px-6 pt-24">
      <Reveal><SectionLabel n="02" t="账号数据" /></Reveal>
      <Reveal delay={0.1}>
        <h2 className="mt-6 font-serif text-5xl md:text-7xl tracking-tight max-w-4xl">
          三个账号，<span className="italic text-accent">真数据</span>。
        </h2>
      </Reveal>
      <Reveal delay={0.2}>
        <p className="mt-4 max-w-2xl text-muted-foreground">从兴趣种草到美妆个护，跨平台内容运营，封面、标题、节奏、社群、复盘——全流程亲手做。</p>
      </Reveal>
    </div>
    {accounts.map((a, i) => <AccountBlock key={a.id} a={a} idx={i} />)}
  </section>
);

/* --------- Luv Bunny --------- */
const LuvBunny = () => {
  const screens = ["luv_IMG_4506", "luv_IMG_4508", "luv_IMG_4510", "luv_IMG_4512", "luv_IMG_4514", "luv_IMG_4516", "luv_IMG_4519", "luv_IMG_4521", "luv_IMG_4523"];
  const v2 = ["luv2_55", "luv2_56", "luv2_57", "luv2_58"];
  return (
    <section id="luvbunny" className="bg-ink text-cream py-24 md:py-32 overflow-hidden">
      <div className="mx-auto max-w-7xl px-6">
        <Reveal>
          <div className="flex items-center gap-3 font-mono text-xs uppercase tracking-[0.2em] text-cream/60">
            <span className="text-accent">03</span>
            <span className="h-px w-8 bg-cream/20" />
            <span>Luv Bunny App · 产品实践</span>
          </div>
        </Reveal>
        <Reveal delay={0.1}>
          <h2 className="mt-6 font-serif text-5xl md:text-7xl tracking-tight max-w-4xl">
            一个上线的 <span className="italic text-accent">AI 陪伴</span> App。
          </h2>
        </Reveal>
        <Reveal delay={0.2}>
          <p className="mt-4 max-w-2xl text-cream/70">
            从产品定位、信息架构、视觉风格、AI 管家对话体验到活动机制——独立完成产品策划，并在 GitHub 持续迭代到 2.0。
          </p>
        </Reveal>

        <div className="mt-12 flex flex-wrap gap-3">
          {[
            { icon: Globe, label: "Web 在线体验", href: "https://cheeseci.web.app" },
            { icon: Github, label: "GitHub 项目", href: "https://github.com/jinxicici/luv-bunny-app" },
            { icon: Download, label: "Release / APK", href: "https://github.com/jinxicici/luv-bunny-app/releases" },
          ].map(({ icon: Icon, label, href }) => (
            <a key={label} href={href} target="_blank" rel="noreferrer"
              className="lift group inline-flex items-center gap-2 rounded-full border border-cream/20 bg-cream/5 px-5 py-3 text-sm backdrop-blur hover:bg-accent hover:border-accent">
              <Icon className="h-4 w-4" />
              <span>{label}</span>
              <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
            </a>
          ))}
        </div>

        {/* phone gallery */}
        <div className="mt-16 -mx-6 overflow-hidden">
          <div className="marquee gap-4 px-6">
            {[...screens, ...screens].map((s, i) => (
              <div key={i} className="shrink-0 w-[200px] md:w-[240px] aspect-[9/19] rounded-[2rem] overflow-hidden border-4 border-cream/10 bg-cream/5 shadow-bold">
                <img src={`/portfolio/${s}.webp`} loading="lazy" alt="Luv Bunny" className="h-full w-full object-cover" />
              </div>
            ))}
          </div>
        </div>

        {/* feature cards */}
        <div className="mt-20 grid gap-6 md:grid-cols-3">
          {[
            { t: "AI 管家对话", d: "拟人化陪伴对话，覆盖问候 / 任务 / 情绪反馈" },
            { t: "社区花园 + 活动中心", d: "用户养成、轻社交与运营活动机制" },
            { t: "主题 DIY", d: "可个性化的视觉主题，提升用户停留" },
          ].map((f, i) => (
            <Reveal key={f.t} delay={i * 0.08}>
              <div className="group rounded-2xl border border-cream/10 bg-cream/5 p-6 hover:bg-accent transition-colors">
                <Sparkles className="h-5 w-5 text-accent group-hover:text-cream" />
                <div className="mt-4 font-serif text-2xl">{f.t}</div>
                <div className="mt-2 text-sm text-cream/70 group-hover:text-cream/90">{f.d}</div>
              </div>
            </Reveal>
          ))}
        </div>

        {/* 2.0 */}
        <div className="mt-24 rounded-3xl border border-cream/10 bg-cream/5 p-8 md:p-12">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <div className="font-mono text-xs uppercase tracking-widest text-accent">后续迭代</div>
              <h3 className="mt-2 font-serif text-3xl md:text-4xl">Luv Bunny 2.0 · 功能预览</h3>
              <p className="mt-2 text-cream/70 max-w-xl text-sm">AI 管家体验、活动机制、视觉风格与页面体验持续优化方向。</p>
            </div>
            <div className="font-mono text-xs text-cream/50">v2.0 · in progress</div>
          </div>
          <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
            {v2.map((s, i) => (
              <Reveal key={s} delay={i * 0.06}>
                <motion.div whileHover={{ y: -4 }} className="aspect-[9/19] overflow-hidden rounded-2xl border border-cream/10 bg-cream/5">
                  <img src={`/portfolio/${s}.webp`} loading="lazy" alt="Luv Bunny 2.0" className="h-full w-full object-cover" />
                </motion.div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

/* --------- Campus media --------- */
const Campus = () => {
  const videos = ["video_IMG_4573", "video_IMG_4574", "video_IMG_4575", "video_IMG_4576", "video_IMG_4578", "video_IMG_4579"];
  const wechat = ["wechat_IMG_4581", "wechat_IMG_4583", "wechat_IMG_4584", "wechat_IMG_4585", "wechat_IMG_4586"];
  return (
    <section id="campus" className="border-t border-border bg-paper py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-6">
        <Reveal><SectionLabel n="04" t="校园新媒体" /></Reveal>
        <Reveal delay={0.1}>
          <h2 className="mt-6 font-serif text-5xl md:text-7xl tracking-tight max-w-4xl">
            <span className="italic text-accent">30+</span> 场校园活动传播。
          </h2>
        </Reveal>

        <div className="mt-16 grid gap-12 lg:grid-cols-2">
          <Reveal>
            <div>
              <div className="font-mono text-xs uppercase tracking-widest text-muted-foreground">视频号 · 校园招聘会等</div>
              <h3 className="mt-2 font-serif text-3xl">脚本 · 拍摄 · 采访 · 剪辑 · 字幕</h3>
              <div className="mt-2 text-sm text-muted-foreground">代表视频 5,000+ 播放</div>
              <div className="mt-6 grid grid-cols-3 gap-3">
                {videos.map((v, i) => (
                  <Reveal key={v} delay={i * 0.05}>
                    <motion.div whileHover={{ scale: 1.05 }} className="aspect-[9/16] overflow-hidden rounded-xl border border-border bg-secondary shadow-soft">
                      <img src={`/portfolio/${v}.webp`} loading="lazy" alt="视频号" className="h-full w-full object-cover" />
                    </motion.div>
                  </Reveal>
                ))}
              </div>
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <div>
              <div className="font-mono text-xs uppercase tracking-widest text-muted-foreground">微信公众号 · 校园活动推文</div>
              <h3 className="mt-2 font-serif text-3xl">排版 · 封面 · 文案 · 数据观察</h3>
              <div className="mt-2 text-sm text-muted-foreground">参与 30+ 场活动传播相关工作</div>
              <div className="mt-6 grid grid-cols-3 gap-3">
                {wechat.map((v, i) => (
                  <Reveal key={v} delay={i * 0.05}>
                    <motion.div whileHover={{ scale: 1.05 }} className="aspect-[3/4] overflow-hidden rounded-xl border border-border bg-secondary shadow-soft">
                      <img src={`/portfolio/${v}.webp`} loading="lazy" alt="公众号" className="h-full w-full object-cover" />
                    </motion.div>
                  </Reveal>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
};

/* --------- Business / Brand projects --------- */
const Business = () => {
  const items = [
    {
      tag: "校一等奖 · 5 人团队",
      title: "螺霸王螺蛳粉 高校市场深度渗透策略研究与商业策划",
      meta: "中华香皂项目延续 / 浙江财经大学 啊对对队",
      points: ["市场调研 + 用户画像 + 渠道策略 + 内容传播 + 商业模式整合"],
    },
    {
      tag: "B2B 产品策划 · 跨境贸易",
      title: "One Click Fabric Style Designer Website",
      meta: "用户痛点 → 产品功能 → 商业模式 → 3D 上身 / 网站原型",
      points: ["跨境面料采购痛点拆解、AI 生成上身效果、商业模式与 SWOT 分析"],
    },
    {
      tag: "餐饮门店线上运营",
      title: "野云雀 · 餐饮门店线上运营",
      meta: "选题 / 拍摄 / 发布 / 评论整理 / 团购 / 寻味节",
      points: ["理解门店如何用线上内容完成曝光、种草与转化闭环"],
    },
  ];
  return (
    <section id="business" className="bg-cream py-24 md:py-32 border-t border-border">
      <div className="mx-auto max-w-7xl px-6">
        <Reveal><SectionLabel n="05" t="商业与门店运营" /></Reveal>
        <Reveal delay={0.1}>
          <h2 className="mt-6 font-serif text-5xl md:text-7xl tracking-tight max-w-4xl">
            从<span className="italic text-accent">策划书</span>到落地动作。
          </h2>
        </Reveal>
        <div className="mt-16 space-y-4">
          {items.map((it, i) => (
            <Reveal key={it.title} delay={i * 0.08}>
              <motion.div
                whileHover={{ x: 8 }}
                className="group flex flex-col md:flex-row md:items-center justify-between gap-4 border-t border-border py-8 cursor-default"
                data-cursor
              >
                <div className="flex-1">
                  <div className="font-mono text-xs uppercase tracking-widest text-accent">{it.tag}</div>
                  <h3 className="mt-3 font-serif text-3xl md:text-4xl group-hover:text-accent transition-colors">{it.title}</h3>
                  <div className="mt-2 text-sm text-muted-foreground">{it.meta}</div>
                  <div className="mt-3 text-sm">{it.points[0]}</div>
                </div>
                <ArrowUpRight className="h-8 w-8 text-muted-foreground group-hover:text-accent transition-all group-hover:rotate-45" />
              </motion.div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
};

/* --------- Timeline --------- */
const Timeline = () => {
  const items = [
    { date: "2023.12 – 2024.04", t: "B2B 产品策划 · 市场营销赛", d: "One Click Fabric · 跨境面料采购数字化方案" },
    { date: "2024 全年", t: "校园新媒体运营", d: "30+ 场校园活动传播 · 视频号 / 公众号" },
    { date: "2024 – 2025", t: "账号矩阵实战", d: "兴趣种草 + 美妆个护小红书 + 抖音三号并行" },
    { date: "2024 – 至今", t: "Luv Bunny App", d: "独立产品策划 · 已上线并持续迭代到 2.0" },
    { date: "2025", t: "螺霸王 · 高校市场策略", d: "5 人团队 · 校一等奖" },
  ];
  return (
    <section className="bg-paper border-t border-border py-24 md:py-32">
      <div className="mx-auto max-w-5xl px-6">
        <Reveal><SectionLabel n="06" t="时间线" /></Reveal>
        <Reveal delay={0.1}>
          <h2 className="mt-6 font-serif text-5xl md:text-6xl">一路在做事。</h2>
        </Reveal>
        <div className="mt-16 relative">
          <div className="absolute left-3 top-2 bottom-2 w-px bg-border md:left-1/2" />
          {items.map((it, i) => (
            <Reveal key={it.t} delay={i * 0.06}>
              <div className={`relative pl-12 md:pl-0 md:grid md:grid-cols-2 md:gap-12 mb-10 ${i % 2 ? "md:text-left" : "md:text-right"}`}>
                <div className="absolute left-1.5 top-2 h-3 w-3 rounded-full bg-accent ring-4 ring-cream md:left-1/2 md:-translate-x-1/2" />
                <div className={i % 2 ? "md:col-start-2" : ""}>
                  <div className="font-mono text-xs text-accent">{it.date}</div>
                  <div className="mt-2 font-serif text-2xl">{it.t}</div>
                  <div className="mt-1 text-sm text-muted-foreground">{it.d}</div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
};

/* --------- Contact --------- */
const Contact = () => (
  <section id="contact" className="relative bg-ink text-cream py-32 md:py-40 overflow-hidden">
    <div className="mx-auto max-w-7xl px-6">
      <Reveal>
        <div className="font-mono text-xs uppercase tracking-[0.25em] text-cream/60">07 · 联系我</div>
      </Reveal>
      <Reveal delay={0.1}>
        <h2 className="mt-6 font-serif text-[14vw] md:text-[10vw] leading-[0.9] tracking-tight">
          来聊聊<span className="italic text-accent">。</span>
        </h2>
      </Reveal>
      <Reveal delay={0.2}>
        <p className="mt-6 max-w-xl text-cream/70">
          运营类实习生 · 现可入职 · 杭州 / 远程皆可。欢迎邮件、微信或电话直接聊。
        </p>
      </Reveal>

      <div className="mt-16 grid gap-4 md:grid-cols-3">
        {[
          { icon: Mail, label: "邮箱", value: "jinxi_cici@163.com", href: "mailto:jinxi_cici@163.com" },
          { icon: MessageCircle, label: "微信", value: "Paranoiavine", href: "#" },
          { icon: Phone, label: "电话", value: "139 0585 5692", href: "tel:13905855692" },
        ].map(({ icon: Icon, label, value, href }) => (
          <Reveal key={label}>
            <a href={href} className="lift group block rounded-2xl border border-cream/10 bg-cream/5 p-6 hover:bg-accent hover:border-accent">
              <Icon className="h-5 w-5 text-accent group-hover:text-cream" />
              <div className="mt-6 font-mono text-xs uppercase tracking-widest text-cream/50 group-hover:text-cream/80">{label}</div>
              <div className="mt-1 font-serif text-2xl break-all">{value}</div>
            </a>
          </Reveal>
        ))}
      </div>

      <div className="mt-20 pt-8 border-t border-cream/10 flex flex-wrap justify-between gap-4 font-mono text-xs text-cream/50">
        <div>© 2026 钱奕彤 Yvette · 浙江财经大学 · 市场营销（中美合作）</div>
        <div className="cursor-blink">运营类实习生</div>
      </div>
    </div>
  </section>
);

/* --------- Nav --------- */
const Nav = () => {
  const [s, setS] = useState(false);
  useEffect(() => {
    const f = () => setS(window.scrollY > 60);
    window.addEventListener("scroll", f);
    return () => window.removeEventListener("scroll", f);
  }, []);
  const links = [
    { h: "#tools", t: "工具" },
    { h: "#accounts", t: "账号数据" },
    { h: "#luvbunny", t: "Luv Bunny" },
    { h: "#campus", t: "校园新媒体" },
    { h: "#business", t: "商业策划" },
    { h: "#contact", t: "联系" },
  ];
  return (
    <header className={`fixed top-0 z-50 w-full transition-all ${s ? "bg-cream/80 backdrop-blur-xl border-b border-border" : ""}`}>
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <a href="#" className="font-serif text-xl">钱奕彤<span className="text-accent">.</span></a>
        <nav className="hidden md:flex items-center gap-8 font-mono text-xs uppercase tracking-widest">
          {links.map(l => (
            <a key={l.h} href={l.h} className="underline-grow text-foreground/80 hover:text-foreground">{l.t}</a>
          ))}
        </nav>
        <a href="#contact" className="rounded-full bg-ink text-cream px-4 py-2 text-xs font-mono hover:bg-accent transition-colors">现可入职 →</a>
      </div>
    </header>
  );
};

/* --------- Page --------- */
const Index = () => {
  useEffect(() => {
    document.title = "钱奕彤 Yvette · 运营类实习生作品集";
    const meta = document.querySelector('meta[name="description"]') || document.head.appendChild(Object.assign(document.createElement('meta'), { name: 'description' }));
    meta.setAttribute('content', '钱奕彤 Yvette · 浙江财经大学 2027 届 · 运营类实习生作品集：账号矩阵、Luv Bunny App、校园新媒体、商业策划。');
  }, []);
  return (
    <main className="grain min-h-screen bg-cream text-foreground">
      <Cursor />
      <Petals />
      <Nav />
      <Hero />
      <Tools />
      <Accounts />
      <LuvBunny />
      <Campus />
      <Business />
      <Timeline />
      <Contact />
    </main>
  );
};

export default Index;
