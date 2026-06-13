import { Code2, GraduationCap, Rocket } from "lucide-react";
import { Container, SectionHeading, Button } from "@/components/site/primitives";
import { Testimonials } from "@/components/ui/unique-testimonial";
import { GithubCard } from "@/components/site/github";

const facts = [
  { icon: Code2, label: "Coding since age 9" },
  { icon: GraduationCap, label: "Harvard online CS" },
  { icon: Rocket, label: "Founder of Eweb" },
];

export default function AboutPage() {
  return (
    <>
      <section className="relative pt-32 pb-12 sm:pt-40">
        <Container>
          <SectionHeading
            align="left"
            eyebrow="About"
            title={
              <>
                Hi, I'm <span className="text-gradient">Ethan Wilden</span>.
              </>
            }
            subtitle="Developer, lifelong learner, and the person behind Eweb."
          />

          <div className="mt-12 grid items-start gap-10 lg:grid-cols-[1.3fr_1fr]">
            <div className="flex flex-col gap-5 text-pretty text-muted-foreground sm:text-lg">
              <p>
                I've loved computer science for as long as I can remember — it
                started when my dad handed me my first{" "}
                <span className="text-foreground">Python</span> book at age 9. I
                was hooked from the very first line of code, and I've never
                really stopped building since.
              </p>
              <p>
                That early spark turned into a genuine craft. Today I'm deepening
                my foundations through{" "}
                <span className="text-foreground">
                  Harvard's online computer science courses
                </span>
                , sharpening everything from algorithms to clean, maintainable
                code — because great software starts with strong fundamentals.
              </p>
              <p>
                Now I channel that lifelong curiosity into{" "}
                <span className="text-foreground">Eweb</span> — designing,
                building, and shipping fast, modern websites and digital
                services for people and small businesses.
              </p>

              <div className="mt-4 flex flex-wrap gap-3">
                {facts.map((f) => (
                  <span
                    key={f.label}
                    className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-foreground"
                  >
                    <f.icon className="size-4 text-white" strokeWidth={1.75} />
                    {f.label}
                  </span>
                ))}
              </div>

              <div className="mt-6 flex flex-wrap gap-3">
                <Button to="/contact" variant="cta">
                  Work with me
                </Button>
                <Button to="/work" variant="outline">
                  See my work
                </Button>
              </div>
            </div>

            {/* Portrait / accent image */}
            <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-card/50">
              <img
                src="https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=900&q=80"
                alt="Code on a screen"
                loading="lazy"
                className="aspect-[4/5] w-full object-cover opacity-90"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-background/10 to-transparent" />
            </div>
          </div>
        </Container>
      </section>

      <section className="relative py-12">
        <Container>
          <SectionHeading
            align="left"
            eyebrow="Proof of work"
            title={<>Building <span className="text-gradient">in the open</span>.</>}
            subtitle="Real projects, real code — here's what I'm tinkering with on GitHub."
          />
          <div className="mt-10">
            <GithubCard />
          </div>
        </Container>
      </section>

      <section className="relative py-12">
        <Container>
          <SectionHeading
            eyebrow="Kind words"
            title="What people say."
            subtitle="A few words from people I've built with."
          />
          <Testimonials />
        </Container>
      </section>
    </>
  );
}
