import { Link } from "react-router-dom";
import { ArrowRight, Mic, ArrowUpRight, ShieldCheck } from "lucide-react";
import { Container, Button } from "./primitives";
import { ShaderOrb } from "@/components/ui/shader-orb";

const stats = [
  { value: "24/7", label: "AI call answering" },
  { value: "7-day", label: "site launches" },
  { value: "100%", label: "custom-built" },
];

export function Hero() {
  return (
    <section id="top" className="relative overflow-hidden pt-36 pb-20 sm:pt-44 sm:pb-28">
      {/* 3D interactive orb — sits behind the headline, masked to a soft glow */}
      <div className="pointer-events-none absolute left-1/2 top-20 -z-0 h-[560px] w-[560px] max-w-[95vw] -translate-x-1/2 [mask-image:radial-gradient(ellipse_at_center,black_35%,transparent_72%)]">
        <ShaderOrb />
      </div>
      <div
        aria-hidden
        className="accent-glow pointer-events-none absolute left-1/2 top-28 -z-0 h-[420px] w-[760px] max-w-[95vw] -translate-x-1/2 rounded-full opacity-50 blur-2xl"
      />

      <Container className="relative flex flex-col items-center text-center">
        {/* Value-prop badge */}
        <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-sm text-muted-foreground">
          <span className="flex size-2 items-center justify-center">
            <span className="absolute size-2 animate-ping rounded-full bg-brand-2/70" />
            <span className="size-2 rounded-full bg-brand-2" />
          </span>
          Custom websites&nbsp;+&nbsp;a 24/7 AI receptionist
        </div>

        <h1 className="mt-6 max-w-4xl text-balance font-display text-4xl font-bold leading-[1.05] tracking-tight sm:text-6xl md:text-7xl">
          Websites that win customers.{" "}
          <span className="text-gradient">AI that answers</span> every call.
        </h1>

        <p className="mt-6 max-w-2xl text-pretty text-base text-muted-foreground sm:text-lg">
          Eweb designs and ships fast, modern websites — and sets up an AI
          receptionist that answers your phone, books appointments, and never
          lets a customer slip away. Built for founders and small businesses.
        </p>

        <div className="mt-9 flex flex-col items-center gap-3 sm:flex-row">
          <Button to="/contact" variant="cta" size="lg">
            Start your project
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
          </Button>
          <Button href="#ai-calls" variant="outline" size="lg">
            <Mic className="size-4" />
            Talk to our AI
          </Button>
        </div>

        {/* Honest trust row — who's behind it + a real guarantee, no fake logos */}
        <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:gap-3">
          <Link
            to="/about"
            className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3.5 py-1.5 text-sm text-muted-foreground transition-colors hover:border-white/25 hover:text-foreground"
          >
            <span className="grid size-5 place-items-center rounded-full bg-[linear-gradient(135deg,var(--color-brand),var(--color-brand-2))] text-[10px] font-bold text-background">
              E
            </span>
            Built &amp; run by{" "}
            <span className="font-medium text-foreground">Ethan Wilden</span>
            <ArrowUpRight className="size-3.5" />
          </Link>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3.5 py-1.5 text-sm text-muted-foreground">
            <ShieldCheck className="size-4 text-brand-2" />
            Hosting &amp; support included
          </span>
        </div>

        {/* Stat strip */}
        <dl className="mt-12 grid w-full max-w-xl grid-cols-3 divide-x divide-white/10 rounded-2xl border border-white/10 bg-card/40 py-5">
          {stats.map((s) => (
            <div key={s.label} className="flex flex-col items-center px-2">
              <dt className="font-display text-2xl font-bold sm:text-3xl">
                {s.value}
              </dt>
              <dd className="mt-1 text-xs text-muted-foreground sm:text-sm">
                {s.label}
              </dd>
            </div>
          ))}
        </dl>
      </Container>
    </section>
  );
}
