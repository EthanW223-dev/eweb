import {
  PhoneCall,
  CalendarCheck,
  Clock,
  FileText,
  Sparkles,
  CheckCircle2,
  Mic,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Container, Button } from "./primitives";
import { VoiceDemo } from "./voice-demo";

type Feature = { icon: LucideIcon; title: string; desc: string };

const features: Feature[] = [
  {
    icon: Clock,
    title: "Answers 24/7",
    desc: "Every call picked up on the first ring — day, night, weekends, holidays.",
  },
  {
    icon: CalendarCheck,
    title: "Books appointments",
    desc: "Schedules jobs and syncs straight to your calendar in real time.",
  },
  {
    icon: FileText,
    title: "Call summaries",
    desc: "A clean transcript and summary of every conversation, sent to you.",
  },
  {
    icon: Sparkles,
    title: "Sounds human",
    desc: "Natural, on-brand voice that callers actually enjoy talking to.",
  },
];

export function AIService() {
  return (
    <section id="ai-calls" className="relative py-24 sm:py-28">
      <Container>
        <div className="grid items-center gap-12 lg:grid-cols-2">
          {/* Copy */}
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-brand/30 bg-brand/10 px-3.5 py-1.5 text-xs font-medium text-brand-2 backdrop-blur">
              <PhoneCall className="size-3.5" />
              AI Call Service · $100/mo
            </span>

            <h2 className="mt-5 max-w-lg text-balance text-3xl font-semibold sm:text-4xl md:text-5xl">
              Never miss another <span className="text-gradient">call</span>.
            </h2>
            <p className="mt-4 max-w-md text-pretty text-muted-foreground sm:text-lg">
              A missed call is a missed customer. Our AI receptionist answers
              every call, books the job, and hands you the summary — so you can
              stay on the tools and still win the work.
            </p>
            <p className="mt-4 inline-flex items-center gap-2 rounded-full border border-brand/30 bg-brand/10 px-4 py-2 text-sm font-medium text-brand-2">
              <Mic className="size-4" />
              Try it live — actually talk to it →
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {features.map((f) => (
                <div key={f.title} className="flex gap-3">
                  <div className="mt-0.5 grid size-9 shrink-0 place-items-center rounded-lg border border-brand/25 bg-brand/10 text-brand-2">
                    <f.icon className="size-4.5" strokeWidth={1.75} />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold">{f.title}</h3>
                    <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                      {f.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-9 flex flex-wrap items-center gap-4">
              <Button to="/contact" variant="cta">
                Get your AI receptionist
                <PhoneCall className="size-4" />
              </Button>
              <span className="inline-flex items-center gap-2 text-sm text-muted-foreground">
                <CheckCircle2 className="size-4 text-brand-2" />
                Set up in days, not weeks
              </span>
            </div>
          </div>

          {/* Live voice-call demo — the AI actually speaks and books a meeting */}
          <VoiceDemo />
        </div>
      </Container>
    </section>
  );
}
