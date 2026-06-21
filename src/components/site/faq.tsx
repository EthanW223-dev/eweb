import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Plus } from "lucide-react";
import { Container, SectionHeading } from "./primitives";

const faqs = [
  {
    q: "How much does a website cost?",
    a: "Most custom websites are a flat $500 one-time fee — designed, built, and launched for you, mobile-responsive and SEO-ready. Bigger or bespoke projects get a tailored quote with no hourly surprises.",
  },
  {
    q: "What is the AI call service, exactly?",
    a: "It's a virtual receptionist powered by AI that answers your phone 24/7, talks naturally with callers, books appointments straight into your calendar, and sends you a summary of every call. It's $100/month — far less than a missed customer.",
  },
  {
    q: "How long until my site is live?",
    a: "Typical sites launch in about 7 days from kickoff. We move fast: discovery, design preview, build, then launch — with you in the loop at each step.",
  },
  {
    q: "Will the AI actually sound human?",
    a: "Yes. It uses a natural, on-brand voice and is configured with your business details, services, and booking rules — so callers get helpful, human-feeling answers, not a clunky phone tree.",
  },
  {
    q: "Do you offer hosting and ongoing support?",
    a: "We do. We can handle hosting, domains, SSL, backups, updates, and ongoing care so your site stays fast and secure long after launch.",
  },
  {
    q: "What if I need something custom?",
    a: "That's our favorite kind of project. Tell us what you have in mind and we'll scope it together — bespoke features, integrations, dashboards, whatever your business needs.",
  },
];

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="rounded-2xl border border-white/10 bg-card/40">
      <button
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
      >
        <span className="font-medium">{q}</span>
        <Plus
          className={`size-5 shrink-0 text-brand-2 transition-transform duration-300 ${
            open ? "rotate-45" : ""
          }`}
        />
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <p className="px-5 pb-5 text-sm leading-relaxed text-muted-foreground">
              {a}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function FAQ() {
  return (
    <section id="faq" className="relative py-24 sm:py-28">
      <Container>
        <SectionHeading
          eyebrow="FAQ"
          title={<>Questions, <span className="text-gradient">answered</span>.</>}
          subtitle="Everything you need to know before we get started."
        />
        <div className="mx-auto mt-12 grid max-w-3xl gap-3">
          {faqs.map((f) => (
            <FaqItem key={f.q} {...f} />
          ))}
        </div>
      </Container>
    </section>
  );
}
