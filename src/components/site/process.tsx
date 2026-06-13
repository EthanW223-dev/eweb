import { Container, SectionHeading } from "./primitives";

const steps = [
  {
    n: "01",
    title: "Discover",
    desc: "We learn about your business, goals, and audience to map out the right plan.",
  },
  {
    n: "02",
    title: "Design",
    desc: "You get a modern, on-brand design and prototype to review before we build.",
  },
  {
    n: "03",
    title: "Build",
    desc: "We develop a fast, responsive site or app with clean, maintainable code.",
  },
  {
    n: "04",
    title: "Launch & care",
    desc: "We deploy, hand over, and stay on for hosting, updates, and support.",
  },
];

export function Process() {
  return (
    <section id="process" className="relative py-24 sm:py-28">
      <Container>
        <SectionHeading
          eyebrow="How it works"
          title={<>A simple, transparent <span className="text-gradient">process</span>.</>}
          subtitle="No jargon, no surprises — just clear steps from idea to live."
        />

        <ol className="mt-14 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {steps.map((s) => (
            <li
              key={s.n}
              className="relative rounded-2xl border border-white/10 bg-card/50 p-6 backdrop-blur-sm"
            >
              <span className="font-display text-3xl font-bold text-gradient">
                {s.n}
              </span>
              <h3 className="mt-3 text-lg font-semibold">{s.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {s.desc}
              </p>
            </li>
          ))}
        </ol>
      </Container>
    </section>
  );
}
