import {
  PhoneCall,
  CalendarCheck,
  Clock,
  FileText,
  Sparkles,
  CheckCircle2,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Container, Button } from "./primitives";

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

// Mini transcript shown in the phone mock — sells the experience at a glance.
const transcript = [
  { from: "caller", text: "Hi, do you have any openings this week?" },
  {
    from: "ai",
    text: "Absolutely! I have Thursday at 2pm or Friday at 10am. Which works best?",
  },
  { from: "caller", text: "Thursday at 2 is perfect." },
  {
    from: "ai",
    text: "Booked you for Thursday 2pm and sent a confirmation. Anything else?",
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

          {/* Phone-call mock */}
          <div className="relative">
            <div
              aria-hidden
              className="accent-glow pointer-events-none absolute -inset-6 -z-0 rounded-[2.5rem] opacity-40 blur-2xl"
            />
            <div className="relative mx-auto w-full max-w-sm overflow-hidden rounded-3xl border border-white/10 bg-card/70 p-5 backdrop-blur-xl">
              {/* Call header */}
              <div className="flex items-center gap-3 border-b border-white/10 pb-4">
                <div className="relative grid size-11 place-items-center rounded-full bg-brand/15 text-brand-2">
                  <span className="absolute inset-0 animate-ping rounded-full bg-brand/20" />
                  <PhoneCall className="relative size-5" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold">Incoming call</p>
                  <p className="text-xs text-muted-foreground">
                    Eweb AI Receptionist · answering…
                  </p>
                </div>
                <span className="flex items-end gap-0.5">
                  {[3, 6, 4, 8, 5].map((h, i) => (
                    <span
                      key={i}
                      className="w-1 rounded-full bg-brand-2/80"
                      style={{ height: `${h * 3}px` }}
                    />
                  ))}
                </span>
              </div>

              {/* Transcript */}
              <div className="flex flex-col gap-3 pt-4">
                {transcript.map((m, i) => (
                  <div
                    key={i}
                    className={
                      m.from === "ai"
                        ? "max-w-[85%] self-end rounded-2xl rounded-br-sm bg-brand/20 px-3.5 py-2.5 text-sm text-foreground"
                        : "max-w-[85%] self-start rounded-2xl rounded-bl-sm bg-white/5 px-3.5 py-2.5 text-sm text-muted-foreground"
                    }
                  >
                    {m.text}
                  </div>
                ))}
              </div>

              {/* Result chip */}
              <div className="mt-4 flex items-center gap-2 rounded-xl border border-brand/25 bg-brand/10 px-3.5 py-2.5 text-sm">
                <CalendarCheck className="size-4 text-brand-2" />
                <span className="font-medium">Appointment booked</span>
                <span className="ml-auto text-xs text-muted-foreground">
                  Thu · 2:00 PM
                </span>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
