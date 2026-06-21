import { type ComponentType, type CSSProperties, useEffect, useState } from "react";
import InkReveal from "@/components/ui/ink-reveal";
import { DottedSurface } from "@/components/ui/dotted-surface";
import {
  ArrowRight,
  Star,
  Zap,
  Shield,
  Clock,
  Calendar,
  ShoppingBag,
  Heart,
  Check,
  Utensils,
  Dumbbell,
  Home,
  Scale,
  Leaf,
  Camera,
} from "lucide-react";
import {
  ScrollPortraitWall,
  type WallItem,
} from "@/components/ui/scroll-portrait-wall";
import { GooeyText } from "@/components/ui/gooey-text-morphing";

/**
 * Eweb opening hero — a scroll-driven wall of detailed custom website landing
 * pages that scale in and out as they pass through the viewport, with the
 * gooey-morphing "Eweb" wordmark locked in the centre (inverting against each
 * design via mix-blend-exclusion).
 *
 * Each cell is a faux-rendered, real-looking landing page (browser-framed) so
 * the wall literally shows the range of custom sites Eweb builds.
 */

type Layout = "hero" | "split" | "gallery" | "shop";
type Icon = ComponentType<{ className?: string; style?: CSSProperties }>;

interface Feature {
  icon: Icon;
  label: string;
}
interface Product {
  name: string;
  price: string;
}

interface Site {
  name: string;
  niche: string;
  domain: string;
  accent: string;
  layout: Layout;
  dark?: boolean;
  eyebrow: string;
  headline: string;
  sub: string;
  nav: string[];
  cta: string;
  features?: Feature[];
  products?: Product[];
  gallery?: string[];
}

const SITES: Site[] = [
  {
    name: "Bistro Nouveau",
    niche: "Restaurant",
    domain: "bistronouveau.com",
    accent: "#f59e0b",
    layout: "hero",
    eyebrow: "Now taking reservations",
    headline: "Farm-to-table, every single night.",
    sub: "Seasonal French plates, natural wine, and a room that feels like home.",
    nav: ["Menu", "Reserve", "About"],
    cta: "Book a table",
    features: [
      { icon: Utensils, label: "Seasonal menu" },
      { icon: Calendar, label: "Private events" },
      { icon: Star, label: "Wine pairings" },
    ],
  },
  {
    name: "PeakFit",
    niche: "Gym & Fitness",
    domain: "peakfit.studio",
    accent: "#84cc16",
    layout: "split",
    eyebrow: "First week free",
    headline: "Train harder. Recover smarter.",
    sub: "Coach-led classes and a plan that actually fits your week.",
    nav: ["Classes", "Coaches", "Pricing"],
    cta: "Start free week",
    features: [
      { icon: Dumbbell, label: "60+ classes" },
      { icon: Clock, label: "Open 24/7" },
      { icon: Zap, label: "Personal plans" },
    ],
  },
  {
    name: "Lumière",
    niche: "Salon & Spa",
    domain: "lumiere-salon.com",
    accent: "#ec4899",
    layout: "gallery",
    eyebrow: "Award-winning studio",
    headline: "Where beauty meets craft.",
    sub: "Color, cuts, and skincare by senior stylists.",
    nav: ["Services", "Gallery", "Book"],
    cta: "Book now",
  },
  {
    name: "Nest Realty",
    niche: "Real Estate",
    domain: "nestrealty.co",
    accent: "#0ea5e9",
    layout: "split",
    eyebrow: "1,200+ homes sold",
    headline: "Find a place to call home.",
    sub: "Browse listings, tour in 3D, and close with a local expert.",
    nav: ["Buy", "Sell", "Agents"],
    cta: "Browse homes",
    features: [
      { icon: Home, label: "3D tours" },
      { icon: Shield, label: "Trusted agents" },
      { icon: Check, label: "No hidden fees" },
    ],
  },
  {
    name: "Bloom",
    niche: "Online Store",
    domain: "shopbloom.com",
    accent: "#8b5cf6",
    layout: "shop",
    eyebrow: "Free shipping over $40",
    headline: "Plants that love you back.",
    sub: "Hand-picked greenery delivered to your door.",
    nav: ["Shop", "Care", "Cart"],
    cta: "Shop plants",
    products: [
      { name: "Monstera", price: "$39" },
      { name: "Fiddle Fig", price: "$58" },
      { name: "Pothos", price: "$19" },
      { name: "Snake Plant", price: "$24" },
    ],
  },
  {
    name: "Atlas Studio",
    niche: "Design Agency",
    domain: "atlas.studio",
    accent: "#e5e5e5",
    layout: "gallery",
    dark: true,
    eyebrow: "Brand & product design",
    headline: "We design brands that move.",
    sub: "Strategy, identity, and websites for ambitious teams.",
    nav: ["Work", "Studio", "Contact"],
    cta: "Start a project",
  },
  {
    name: "Northwind",
    niche: "SaaS",
    domain: "northwind.app",
    accent: "#6366f1",
    layout: "hero",
    dark: true,
    eyebrow: "New · AI workflows",
    headline: "Ship products, not busywork.",
    sub: "Plan, build, and launch from one workspace your whole team loves.",
    nav: ["Product", "Pricing", "Docs"],
    cta: "Start free",
    features: [
      { icon: Zap, label: "Automations" },
      { icon: Shield, label: "SOC 2" },
      { icon: Star, label: "4.9 rating" },
    ],
  },
  {
    name: "Harbor & Co",
    niche: "Law Firm",
    domain: "harborco.legal",
    accent: "#0891b2",
    layout: "split",
    eyebrow: "Free consultation",
    headline: "Counsel you can count on.",
    sub: "Business, property, and family law from a team that answers.",
    nav: ["Practice", "Team", "Contact"],
    cta: "Talk to us",
    features: [
      { icon: Scale, label: "30 yrs experience" },
      { icon: Shield, label: "Confidential" },
      { icon: Check, label: "Flat-fee options" },
    ],
  },
  {
    name: "Verde",
    niche: "Eco Store",
    domain: "verde.shop",
    accent: "#10b981",
    layout: "shop",
    eyebrow: "Plastic-free, always",
    headline: "Everyday goods, zero waste.",
    sub: "Refillable essentials that are kind to the planet.",
    nav: ["Shop", "Refills", "Cart"],
    cta: "Shop now",
    products: [
      { name: "Tote Bag", price: "$18" },
      { name: "Steel Bottle", price: "$24" },
      { name: "Soap Bar", price: "$9" },
      { name: "Bamboo Set", price: "$12" },
    ],
  },
  {
    name: "Lumen",
    niche: "Photography",
    domain: "lumen.photo",
    accent: "#f472b6",
    layout: "gallery",
    dark: true,
    eyebrow: "Weddings & portraits",
    headline: "Moments, beautifully kept.",
    sub: "Editorial photography for the days you'll never forget.",
    nav: ["Portfolio", "Pricing", "Book"],
    cta: "Check dates",
  },
];

/* ------------------------------ page pieces ------------------------------ */

function Chrome({ site, ink }: { site: Site; ink: { line: string; soft: string; faint: string } }) {
  return (
    <div
      className="flex shrink-0 items-center gap-1 border-b px-2 py-1"
      style={{ borderColor: ink.line, background: site.dark ? "#111114" : "#f4f4f5" }}
    >
      <span className="size-1.5 rounded-full" style={{ background: ink.soft }} />
      <span className="size-1.5 rounded-full" style={{ background: ink.soft }} />
      <span className="size-1.5 rounded-full" style={{ background: ink.soft }} />
      <span
        className="ml-1.5 flex flex-1 items-center gap-1 truncate rounded px-1.5 py-0.5 text-[6px]"
        style={{ background: site.dark ? "#1c1c20" : "#ffffff", color: ink.faint }}
      >
        <span className="size-1 rounded-full" style={{ background: site.accent }} />
        {site.domain}
      </span>
    </div>
  );
}

function Nav({ site, ink }: { site: Site; ink: { text: string; faint: string } }) {
  return (
    <div className="flex items-center justify-between px-3 py-2">
      <div className="flex items-center gap-1">
        <span className="size-2 rounded" style={{ background: site.accent }} />
        <span className="text-[8px] font-bold" style={{ color: ink.text }}>
          {site.name}
        </span>
      </div>
      <div className="flex items-center gap-2">
        {site.nav.map((n) => (
          <span key={n} className="text-[6px]" style={{ color: ink.faint }}>
            {n}
          </span>
        ))}
        <span
          className="rounded-full px-1.5 py-0.5 text-[6px] font-semibold text-white"
          style={{ background: site.accent }}
        >
          {site.cta}
        </span>
      </div>
    </div>
  );
}

function HeroLayout({ site, ink }: { site: Site; ink: Ink }) {
  return (
    <div className="flex flex-col items-center px-3 pb-3 pt-1 text-center">
      <span
        className="rounded-full px-1.5 py-0.5 text-[5px] font-semibold"
        style={{ background: `${site.accent}22`, color: site.accent }}
      >
        {site.eyebrow}
      </span>
      <h3 className="mt-1.5 max-w-[15ch] text-[12px] font-bold leading-[1.1]" style={{ color: ink.text }}>
        {site.headline}
      </h3>
      <p className="mt-1 max-w-[22ch] text-[6px] leading-snug" style={{ color: ink.faint }}>
        {site.sub}
      </p>
      <div className="mt-1.5 flex items-center gap-1">
        <span
          className="inline-flex items-center gap-0.5 rounded-md px-2 py-0.5 text-[6px] font-semibold text-white"
          style={{ background: site.accent }}
        >
          {site.cta}
          <ArrowRight className="size-1.5" />
        </span>
        <span
          className="rounded-md border px-2 py-0.5 text-[6px]"
          style={{ borderColor: ink.line, color: ink.faint }}
        >
          Learn more
        </span>
      </div>
      {/* hero visual */}
      <div
        className="mt-2 flex h-12 w-full items-end gap-1 overflow-hidden rounded-lg p-1.5"
        style={{ background: `radial-gradient(120% 120% at 0% 0%, ${site.accent}33, ${site.dark ? "#16161a" : "#f7f7f8"})` }}
      >
        {[60, 85, 45, 95, 70, 50].map((h, i) => (
          <div key={i} className="flex-1 rounded-sm" style={{ height: `${h}%`, background: site.accent, opacity: 0.55 + i * 0.06 }} />
        ))}
      </div>
      {/* feature row */}
      <div className="mt-2 grid w-full grid-cols-3 gap-1.5">
        {site.features?.map((f) => {
          const I = f.icon;
          return (
            <div
              key={f.label}
              className="flex flex-col items-center gap-0.5 rounded-md border px-1 py-1.5"
              style={{ borderColor: ink.line }}
            >
              <I className="size-2.5" style={{ color: site.accent }} />
              <span className="text-[5px]" style={{ color: ink.faint }}>
                {f.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function SplitLayout({ site, ink }: { site: Site; ink: Ink }) {
  return (
    <div className="px-3 pb-3 pt-1">
      <div className="grid grid-cols-2 gap-2">
        <div className="flex flex-col justify-center">
          <span
            className="w-fit rounded-full px-1.5 py-0.5 text-[5px] font-semibold"
            style={{ background: `${site.accent}22`, color: site.accent }}
          >
            {site.eyebrow}
          </span>
          <h3 className="mt-1 text-[11px] font-bold leading-[1.1]" style={{ color: ink.text }}>
            {site.headline}
          </h3>
          <p className="mt-1 text-[6px] leading-snug" style={{ color: ink.faint }}>
            {site.sub}
          </p>
          <span
            className="mt-1.5 inline-flex w-fit items-center gap-0.5 rounded-md px-2 py-0.5 text-[6px] font-semibold text-white"
            style={{ background: site.accent }}
          >
            {site.cta}
            <ArrowRight className="size-1.5" />
          </span>
        </div>
        <div
          className="flex aspect-square items-center justify-center rounded-lg"
          style={{ background: `linear-gradient(135deg, ${site.accent}66, ${site.accent}11)` }}
        >
          <div className="h-2/3 w-2/3 rounded-md bg-white/30" />
        </div>
      </div>
      <div className="mt-2 grid grid-cols-3 gap-1.5">
        {site.features?.map((f) => {
          const I = f.icon;
          return (
            <div key={f.label} className="flex items-center gap-1 rounded-md border px-1.5 py-1" style={{ borderColor: ink.line }}>
              <I className="size-2.5 shrink-0" style={{ color: site.accent }} />
              <span className="truncate text-[5px]" style={{ color: ink.faint }}>
                {f.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function GalleryLayout({ site, ink }: { site: Site; ink: Ink }) {
  return (
    <div className="px-3 pb-3 pt-1">
      <div className="flex items-end justify-between">
        <h3 className="max-w-[16ch] text-[11px] font-bold leading-[1.1]" style={{ color: ink.text }}>
          {site.headline}
        </h3>
        <Camera className="size-3" style={{ color: site.accent }} />
      </div>
      <p className="mt-0.5 text-[6px]" style={{ color: ink.faint }}>
        {site.sub}
      </p>
      <div className="mt-2 grid grid-cols-3 gap-1.5">
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <span
            key={i}
            className={`block rounded ${i % 5 === 0 ? "row-span-2 aspect-[3/5]" : "aspect-square"}`}
            style={{
              background:
                i % 3 === 0
                  ? `linear-gradient(135deg, ${site.accent}66, ${site.accent}11)`
                  : site.dark
                    ? "linear-gradient(135deg, rgba(255,255,255,.14), rgba(255,255,255,.04))"
                    : "linear-gradient(135deg, rgba(0,0,0,.10), rgba(0,0,0,.02))",
            }}
          />
        ))}
      </div>
    </div>
  );
}

function ShopLayout({ site, ink }: { site: Site; ink: Ink }) {
  return (
    <div className="px-3 pb-3 pt-1">
      <div className="flex items-center justify-between">
        <div>
          <span className="text-[5px] font-semibold" style={{ color: site.accent }}>
            {site.eyebrow}
          </span>
          <h3 className="text-[10px] font-bold leading-tight" style={{ color: ink.text }}>
            {site.headline}
          </h3>
        </div>
        <ShoppingBag className="size-3" style={{ color: site.accent }} />
      </div>
      <div className="mt-2 grid grid-cols-2 gap-1.5">
        {site.products?.map((p) => (
          <div key={p.name} className="overflow-hidden rounded-md border" style={{ borderColor: ink.line }}>
            <div
              className="flex aspect-[4/3] items-center justify-center"
              style={{ background: `linear-gradient(135deg, ${site.accent}44, ${site.accent}0d)` }}
            >
              <Leaf className="size-3" style={{ color: site.accent }} />
            </div>
            <div className="flex items-center justify-between px-1.5 py-1">
              <div className="min-w-0">
                <div className="truncate text-[6px] font-medium" style={{ color: ink.text }}>
                  {p.name}
                </div>
                <div className="text-[6px] font-bold" style={{ color: site.accent }}>
                  {p.price}
                </div>
              </div>
              <span className="grid size-3 place-items-center rounded-full text-white" style={{ background: site.accent }}>
                <Heart className="size-1.5" />
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

interface Ink {
  text: string;
  faint: string;
  line: string;
  soft: string;
}

function PageFooter({ site, ink }: { site: Site; ink: Ink }) {
  return (
    <div
      className="mt-auto flex items-center justify-between border-t px-3 py-1.5"
      style={{ borderColor: ink.line, background: site.dark ? "#0c0c0f" : "#fafafa" }}
    >
      <div className="flex items-center gap-1">
        <span className="size-1.5 rounded" style={{ background: site.accent }} />
        <span className="text-[5px] font-semibold" style={{ color: ink.text }}>
          {site.name}
        </span>
      </div>
      <div className="flex items-center gap-1.5">
        {["Privacy", "Terms", "©"].map((l) => (
          <span key={l} className="text-[5px]" style={{ color: ink.faint }}>
            {l}
          </span>
        ))}
      </div>
    </div>
  );
}

/** A detailed, real-looking landing page inside a browser frame; fills its cell. */
function LandingMock({ site }: { site: Site }) {
  const ink: Ink = site.dark
    ? { text: "#fafafa", faint: "#a1a1aa", line: "rgba(255,255,255,0.12)", soft: "rgba(255,255,255,0.25)" }
    : { text: "#0a0a0a", faint: "#71717a", line: "rgba(0,0,0,0.10)", soft: "rgba(0,0,0,0.18)" };

  return (
    <div className="flex h-full w-full flex-col overflow-hidden rounded-xl ring-1 ring-black/10 shadow-2xl shadow-black/30">
      <Chrome site={site} ink={ink} />
      <div className="flex flex-1 flex-col overflow-hidden" style={{ background: site.dark ? "#0a0a0c" : "#ffffff" }}>
        <Nav site={site} ink={ink} />
        <div className="flex-1 overflow-hidden">
          {site.layout === "hero" && <HeroLayout site={site} ink={ink} />}
          {site.layout === "split" && <SplitLayout site={site} ink={ink} />}
          {site.layout === "gallery" && <GalleryLayout site={site} ink={ink} />}
          {site.layout === "shop" && <ShopLayout site={site} ink={ink} />}
        </div>
        <PageFooter site={site} ink={ink} />
      </div>
    </div>
  );
}

/** White hero backdrop: always-on black dots, plus an accent ink trail on hover. */
function HeroBackdrop() {
  const [canHover, setCanHover] = useState(false);
  useEffect(() => {
    setCanHover(
      window.matchMedia("(hover: hover) and (pointer: fine)").matches,
    );
  }, []);

  return (
    <div className="absolute inset-0 bg-white">
      {/* animated black-dot wave — pinned to the viewport while the hero scrolls */}
      <div className="sticky top-0 h-[100svh] w-full overflow-hidden">
        <DottedSurface dotColor="black" className="absolute inset-0 z-0 opacity-90" />
      </div>
      {/* flowing multicolor ink trail — follows the cursor and the scroll (desktop only) */}
      {canHover && (
        <InkReveal
          mode="paint"
          hueFlow
          glow
          brushSize={85}
          lifetime={1100}
          rVary={0.5}
          gradientStops={[0.55, 0.34, 0]}
          className="pointer-events-auto"
        />
      )}
    </div>
  );
}

const items: WallItem[] = SITES.map((site) => ({
  name: site.name,
  role: site.niche,
  content: <LandingMock site={site} />,
}));

export function WebsiteWall() {
  return (
    <ScrollPortraitWall
      className="scroll-hero-section bg-white text-neutral-900"
      background={<HeroBackdrop />}
      title={
        <GooeyText
          texts={["Eweb", "Websites", "AI Calls"]}
          morphTime={1.2}
          cooldownTime={3}
          className="h-[4.5rem] w-[88vw] max-w-2xl sm:h-24 md:h-32"
          textClassName="text-white font-display font-bold tracking-tight text-6xl sm:text-7xl md:text-8xl"
        />
      }
      date="Custom websites · 24/7 AI receptionist"
      hint="scroll to see what we build"
      speakers={items}
      columns={4}
      showCaptions
    />
  );
}

export default WebsiteWall;
