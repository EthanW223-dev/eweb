import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { Container, SectionHeading } from "./primitives";

type Demo = {
  name: string;
  niche: string;
  domain: string;
  accent: string;
  variant: "restaurant" | "fitness" | "salon" | "realty" | "shop" | "studio";
};

const demos: Demo[] = [
  { name: "Bistro Nouveau", niche: "Restaurant", domain: "bistronouveau.com", accent: "#f59e0b", variant: "restaurant" },
  { name: "PeakFit", niche: "Gym & Fitness", domain: "peakfit.studio", accent: "#84cc16", variant: "fitness" },
  { name: "Lumière", niche: "Salon & Spa", domain: "lumiere-salon.com", accent: "#ec4899", variant: "salon" },
  { name: "Nest Realty", niche: "Real Estate", domain: "nestrealty.co", accent: "#38bdf8", variant: "realty" },
  { name: "Bloom", niche: "Online Store", domain: "shopbloom.com", accent: "#a78bfa", variant: "shop" },
  { name: "Atlas Studio", niche: "Agency / Portfolio", domain: "atlas.studio", accent: "#e5e5e5", variant: "studio" },
];

/** A tiny faux-rendered website inside a browser frame. */
function MiniSite({ demo }: { demo: Demo }) {
  const a = demo.accent;
  return (
    <div className="overflow-hidden rounded-xl border border-white/10 bg-[#0b0b0d]">
      {/* browser chrome */}
      <div className="flex items-center gap-1.5 border-b border-white/10 bg-white/[0.03] px-3 py-2">
        <span className="size-2 rounded-full bg-white/20" />
        <span className="size-2 rounded-full bg-white/20" />
        <span className="size-2 rounded-full bg-white/20" />
        <span className="ml-2 flex-1 truncate rounded-md bg-white/[0.05] px-2 py-0.5 text-[9px] text-muted-foreground">
          {demo.domain}
        </span>
      </div>

      {/* page */}
      <div className="relative aspect-[4/3] overflow-hidden p-3 text-[8px]">
        {/* nav */}
        <div className="flex items-center justify-between">
          <span className="font-semibold text-foreground" style={{ fontSize: 9 }}>
            {demo.name}
          </span>
          <div className="flex items-center gap-1.5">
            <span className="h-1 w-4 rounded-full bg-white/15" />
            <span className="h-1 w-4 rounded-full bg-white/15" />
            <span className="rounded-full px-1.5 py-0.5 text-[7px] font-medium text-black" style={{ background: a }}>
              Book
            </span>
          </div>
        </div>

        {/* hero */}
        <div
          className="mt-2.5 rounded-lg p-2.5"
          style={{ background: `radial-gradient(120% 120% at 0% 0%, ${a}22, transparent 60%)` }}
        >
          <span className="block h-1.5 w-3/4 rounded-full bg-white/80" />
          <span className="mt-1 block h-1.5 w-1/2 rounded-full" style={{ background: a }} />
          <span className="mt-1.5 block h-1 w-5/6 rounded-full bg-white/15" />
          <span className="mt-0.5 block h-1 w-2/3 rounded-full bg-white/15" />
          <span className="mt-2 inline-block rounded-full px-2 py-0.5 text-[7px] font-semibold text-black" style={{ background: a }}>
            {demo.variant === "shop" ? "Shop now" : demo.variant === "restaurant" ? "Reserve" : "Get started"}
          </span>
        </div>

        {/* content grid — flavored per niche */}
        <div className="mt-2.5 grid grid-cols-3 gap-1.5">
          {[0, 1, 2].map((i) => (
            <div key={i} className="rounded-md bg-white/[0.05] p-1.5">
              <span
                className="block h-5 rounded"
                style={{
                  background:
                    demo.variant === "studio"
                      ? "linear-gradient(135deg, rgba(255,255,255,.12), rgba(255,255,255,.03))"
                      : `linear-gradient(135deg, ${a}33, transparent)`,
                }}
              />
              <span className="mt-1 block h-1 w-full rounded-full bg-white/15" />
              <span className="mt-0.5 block h-1 w-2/3 rounded-full bg-white/10" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function WebsiteShowcase() {
  return (
    <section id="demos" className="relative py-24 sm:py-28">
      <Container>
        <SectionHeading
          eyebrow="Website demos"
          title={<>Sites we can build <span className="text-gradient">for you</span>.</>}
          subtitle="Pick a style, tell us your business, and we'll ship a custom version in days — not months."
        />

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {demos.map((d) => (
            <Link
              key={d.name}
              to="/contact"
              className="group relative flex flex-col rounded-2xl border border-white/10 bg-card/50 p-4 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-brand/40"
            >
              <MiniSite demo={d} />
              <div className="mt-4 flex items-center justify-between px-1">
                <div>
                  <h3 className="text-sm font-semibold">{d.name}</h3>
                  <p className="text-xs text-muted-foreground">{d.niche}</p>
                </div>
                <span className="inline-flex items-center gap-1 text-xs font-medium text-muted-foreground transition-colors group-hover:text-brand-2">
                  Build this
                  <ArrowUpRight className="size-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </Container>
    </section>
  );
}
