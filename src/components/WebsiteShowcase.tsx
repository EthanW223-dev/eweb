import { useEffect, useState } from "react";
import {
  ArrowRight,
  ArrowUpRight,
  Check,
  ChevronLeft,
  ChevronRight,
  Copy,
  Globe,
  Megaphone,
  Monitor,
  PanelLeft,
  Phone,
  Plus,
  RotateCw,
  Share2,
} from "lucide-react";

const CONTENT_HEIGHT = 560;

/* ====================================================================== */
/*  Each slide is a UNIQUE Eweb landing page — different menu, layout,     */
/*  palette and composition. All about what Eweb sells.                    */
/* ====================================================================== */

/* 1 — WEBSITES — editorial / agency, light cream, left-aligned, full menu */
function SiteWebsites() {
  return (
    <div className="relative h-full w-full overflow-hidden bg-[#f6f2ea] text-[#171717]">
      <header className="flex items-center justify-between px-12 py-7">
        <span className="text-xl font-semibold tracking-tight">Eweb</span>
        <nav className="hidden items-center gap-8 text-[13px] text-[#171717]/70 md:flex">
          <span>Websites</span>
          <span>Work</span>
          <span>Process</span>
          <span>Journal</span>
        </nav>
        <button className="rounded-full bg-[#171717] px-5 py-2 text-[13px] font-medium text-white">
          Get a quote
        </button>
      </header>

      <div className="grid grid-cols-1 gap-8 px-12 pt-6 md:grid-cols-[1.1fr_0.9fr]">
        <div>
          <p className="mb-5 text-[12px] font-medium uppercase tracking-[0.2em] text-amber-700">
            Custom websites · $500 flat
          </p>
          <h2 className="text-[52px] font-semibold leading-[0.98] tracking-tight">
            Websites that win you customers.
          </h2>
          <p className="mt-5 max-w-sm text-[15px] leading-relaxed text-[#171717]/65">
            Fast, modern sites designed to turn visitors into paying customers — launched in days, not months.
          </p>
          <div className="mt-7 flex items-center gap-3">
            <button className="inline-flex items-center gap-2 rounded-full bg-[#171717] px-6 py-3 text-sm font-medium text-white">
              See our work <ArrowRight className="h-4 w-4" />
            </button>
            <button className="text-sm font-medium underline underline-offset-4">
              View pricing
            </button>
          </div>
          <div className="mt-10 flex gap-8 text-sm">
            <div>
              <div className="text-2xl font-semibold">48h</div>
              <div className="text-[12px] text-[#171717]/50">Avg. launch</div>
            </div>
            <div>
              <div className="text-2xl font-semibold">100%</div>
              <div className="text-[12px] text-[#171717]/50">Mobile-ready</div>
            </div>
            <div>
              <div className="text-2xl font-semibold">A+</div>
              <div className="text-[12px] text-[#171717]/50">Speed score</div>
            </div>
          </div>
        </div>
        {/* right: stacked preview cards */}
        <div className="relative hidden md:block">
          <div className="absolute right-6 top-2 h-44 w-64 rotate-3 rounded-xl bg-gradient-to-br from-amber-200 to-orange-300 shadow-xl" />
          <div className="absolute right-0 top-16 h-44 w-64 -rotate-3 rounded-xl bg-white p-4 shadow-2xl ring-1 ring-black/5">
            <div className="h-2.5 w-20 rounded bg-[#171717]/80" />
            <div className="mt-3 h-1.5 w-40 rounded bg-[#171717]/15" />
            <div className="mt-1.5 h-1.5 w-32 rounded bg-[#171717]/15" />
            <div className="mt-4 h-16 rounded-lg bg-gradient-to-br from-amber-100 to-orange-200" />
            <div className="mt-3 h-6 w-24 rounded-full bg-[#171717]" />
          </div>
        </div>
      </div>
    </div>
  );
}

/* 2 — AI CALLS — dark, split layout, violet glow, pill nav */
function SiteAICalls() {
  return (
    <div className="relative h-full w-full overflow-hidden bg-[#0a0a12] text-white">
      <div className="pointer-events-none absolute -left-20 top-10 h-72 w-72 rounded-full bg-[radial-gradient(circle,rgba(139,92,246,0.5),transparent_70%)] blur-2xl" />
      <header className="flex items-center justify-between px-10 py-6">
        <div className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-violet-400" />
          <span className="font-semibold tracking-tight">Eweb Voice</span>
        </div>
        <nav className="hidden items-center gap-1 rounded-full border border-white/10 bg-white/5 px-2 py-1 text-[12px] text-white/70 md:flex">
          <span className="rounded-full bg-white/10 px-3 py-1 text-white">Overview</span>
          <span className="px-3 py-1">Features</span>
          <span className="px-3 py-1">Pricing</span>
        </nav>
        <button className="rounded-full bg-violet-500 px-4 py-2 text-[13px] font-medium text-white">
          Hear demo
        </button>
      </header>

      <div className="grid grid-cols-1 items-center gap-8 px-10 pt-8 md:grid-cols-2">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-[11px] text-white/80">
            <Phone className="h-3.5 w-3.5" /> AI phone receptionist · $100/mo
          </span>
          <h2 className="mt-4 text-[46px] font-semibold leading-[1] tracking-tight">
            Never miss a<br />call again.
          </h2>
          <p className="mt-4 max-w-sm text-[15px] leading-relaxed text-white/60">
            Our AI answers 24/7 in a natural human voice — booking appointments and taking messages while you work.
          </p>
          <div className="mt-7 flex items-center gap-3">
            <button className="inline-flex items-center gap-2 rounded-lg bg-white px-5 py-2.5 text-sm font-medium text-black">
              Hear a live demo <ArrowRight className="h-4 w-4" />
            </button>
            <button className="rounded-lg border border-white/20 px-5 py-2.5 text-sm font-medium">
              See pricing
            </button>
          </div>
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-[12px] shadow-2xl backdrop-blur">
          <div className="mb-3 flex items-center gap-2 text-white/50">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-violet-500/20 text-violet-300">
              <Phone className="h-3 w-3" />
            </span>
            Incoming call · 0:14
          </div>
          <div className="space-y-2">
            <div className="ml-8 rounded-lg rounded-br-sm bg-white/10 px-3 py-2 text-white/80">
              Hi, do you have any openings tomorrow?
            </div>
            <div className="mr-8 rounded-lg rounded-bl-sm bg-violet-500/20 px-3 py-2 text-violet-100">
              We do! 10am or 2pm — which works?
            </div>
            <div className="ml-8 rounded-lg rounded-br-sm bg-white/10 px-3 py-2 text-white/80">
              2pm, thanks.
            </div>
            <div className="mr-8 flex items-center gap-1.5 rounded-lg rounded-bl-sm bg-emerald-500/20 px-3 py-2 text-emerald-200">
              <Check className="h-3.5 w-3.5" /> Booked — tomorrow 2:00pm
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* 3 — ADVERTISING — vibrant gradient, centered, minimal nav, stat-driven */
function SiteAds() {
  return (
    <div className="relative flex h-full w-full flex-col overflow-hidden bg-[linear-gradient(135deg,#ff7a18_0%,#ff3d7f_50%,#a21caf_100%)] text-white">
      <header className="flex items-center justify-between px-10 py-6">
        <span className="text-lg font-bold tracking-tight">Eweb Ads</span>
        <button className="rounded-full bg-white px-5 py-2 text-[13px] font-semibold text-[#a21caf]">
          Start a campaign
        </button>
      </header>

      <div className="flex flex-1 flex-col items-center justify-center px-8 text-center">
        <div className="mb-5 flex items-center gap-2 text-[12px] font-medium">
          <span className="rounded-full bg-white/20 px-3 py-1 backdrop-blur">Google</span>
          <span className="rounded-full bg-white/20 px-3 py-1 backdrop-blur">Meta</span>
          <span className="rounded-full bg-white/20 px-3 py-1 backdrop-blur">TikTok</span>
        </div>
        <h2 className="max-w-2xl text-[56px] font-extrabold leading-[0.95] tracking-tight">
          Ads that bring real customers.
        </h2>
        <button className="mt-7 inline-flex items-center gap-2 rounded-full bg-white px-7 py-3.5 text-sm font-semibold text-[#a21caf]">
          Launch your campaign <Megaphone className="h-4 w-4" />
        </button>
      </div>

      <div className="grid grid-cols-3 border-t border-white/20 text-center">
        {[
          ["3.2×", "Average ROAS"],
          ["24h", "Campaign setup"],
          ["0", "Lock-in contracts"],
        ].map(([v, l]) => (
          <div key={l} className="px-6 py-5">
            <div className="text-3xl font-extrabold">{v}</div>
            <div className="mt-1 text-[11px] text-white/80">{l}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* 4 — OVERVIEW / PRICING — clean white, dot grid, card layout, full menu */
function SitePricing() {
  const cards = [
    { icon: Globe, name: "Websites", price: "$500", unit: "one-time", points: ["Custom design", "Live in 48h"] },
    { icon: Phone, name: "AI Calls", price: "$100", unit: "per month", points: ["Answers 24/7", "Books jobs"], featured: true },
    { icon: Megaphone, name: "Advertising", price: "Custom", unit: "managed", points: ["Google · Meta", "Clear reporting"] },
  ];
  return (
    <div className="relative h-full w-full overflow-hidden bg-white text-gray-900">
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.5]"
        style={{
          backgroundImage:
            "radial-gradient(circle, rgba(0,0,0,0.08) 1px, transparent 1px)",
          backgroundSize: "22px 22px",
        }}
      />
      <div className="relative z-10 flex h-full flex-col">
        <header className="flex items-center justify-between px-10 py-6">
          <span className="font-semibold tracking-tight">Eweb</span>
          <nav className="hidden items-center gap-7 text-[13px] text-gray-600 md:flex">
            <span>Websites</span>
            <span>AI Calls</span>
            <span>Ads</span>
            <span>About</span>
          </nav>
          <button className="rounded-lg bg-indigo-600 px-4 py-2 text-[13px] font-medium text-white">
            Get started
          </button>
        </header>

        <div className="px-10 pt-4 text-center">
          <h2 className="text-3xl font-semibold tracking-tight">
            One team. Everything to grow online.
          </h2>
          <p className="mt-2 text-sm text-gray-500">
            Pick what you need — websites, AI call answering and advertising.
          </p>
        </div>

        <div className="grid flex-1 grid-cols-3 gap-4 px-10 py-7">
          {cards.map(({ icon: Icon, name, price, unit, points, featured }) => (
            <div
              key={name}
              className={`flex flex-col rounded-2xl p-5 ${
                featured
                  ? "bg-indigo-600 text-white shadow-xl"
                  : "bg-white text-gray-900 ring-1 ring-gray-200"
              }`}
            >
              <Icon className={`h-5 w-5 ${featured ? "text-white" : "text-indigo-600"}`} />
              <div className="mt-3 text-sm font-semibold">{name}</div>
              <div className="mt-2 flex items-end gap-1">
                <span className="text-2xl font-bold">{price}</span>
                <span className={`pb-1 text-[11px] ${featured ? "text-white/70" : "text-gray-400"}`}>
                  {unit}
                </span>
              </div>
              <ul className="mt-3 space-y-1.5">
                {points.map((pt) => (
                  <li
                    key={pt}
                    className={`flex items-center gap-1.5 text-[12px] ${
                      featured ? "text-white/85" : "text-gray-600"
                    }`}
                  >
                    <Check className="h-3.5 w-3.5" /> {pt}
                  </li>
                ))}
              </ul>
              <button
                className={`mt-auto inline-flex items-center justify-center gap-1 rounded-lg py-2 text-[12px] font-medium ${
                  featured ? "bg-white text-indigo-600" : "bg-gray-900 text-white"
                }`}
              >
                Choose <ArrowUpRight className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ------------------------------- Showcase ------------------------------- */

const SLIDES = [
  { url: "ewebbuild.com", render: () => <SitePricing /> },
  { url: "ewebbuild.com/websites", render: () => <SiteWebsites /> },
  { url: "ewebvoice.ai", render: () => <SiteAICalls /> },
  { url: "ewebbuild.com/ads", render: () => <SiteAds /> },
];

export function WebsiteShowcase({ frozen = false }: { frozen?: boolean }) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused || frozen) return;
    const t = setInterval(() => setIndex((i) => (i + 1) % SLIDES.length), 4200);
    return () => clearInterval(t);
  }, [paused, frozen]);

  const current = SLIDES[index];

  return (
    <div
      className="overflow-hidden rounded-t-2xl bg-[#1a1a1c] text-left shadow-[0_-20px_80px_rgba(0,0,0,0.35)] ring-1 ring-white/10"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Title bar */}
      <div className="flex items-center gap-3 border-b border-white/5 bg-[#242427] px-4 py-2.5">
        <div className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
        </div>
        <div className="flex items-center gap-2">
          <PanelLeft className="h-3.5 w-3.5 text-white/40" />
          <ChevronLeft className="h-3.5 w-3.5 text-white/40" />
          <ChevronRight className="h-3.5 w-3.5 text-white/25" />
        </div>
        <div className="mx-2 flex flex-1 items-center justify-center gap-1.5 rounded-md bg-[#1a1a1c] px-6 py-1 text-[10px] text-white/60">
          <Monitor className="h-3 w-3" />
          {current.url}
        </div>
        <div className="flex items-center gap-2.5">
          <RotateCw className="h-3.5 w-3.5 text-white/40" />
          <Share2 className="h-3.5 w-3.5 text-white/40" />
          <Plus className="h-3.5 w-3.5 text-white/40" />
          <Copy className="h-3.5 w-3.5 text-white/40" />
        </div>
      </div>

      {/* Viewport — only the active site is mounted */}
      <div className="relative" style={{ height: CONTENT_HEIGHT }}>
        <div key={index} className="animate-screen-in absolute inset-0">
          {current.render()}
        </div>

        <div className="absolute bottom-3 left-1/2 z-20 flex -translate-x-1/2 items-center gap-1.5 rounded-full bg-black/40 px-2.5 py-1.5 backdrop-blur">
          {SLIDES.map((s, i) => (
            <button
              key={s.url}
              aria-label={`Show ${s.url}`}
              onClick={() => setIndex(i)}
              className={`h-1.5 rounded-full transition-all ${
                i === index ? "w-5 bg-white" : "w-1.5 bg-white/40 hover:bg-white/70"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
