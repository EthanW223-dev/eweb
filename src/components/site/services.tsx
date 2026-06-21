import {
  Palette,
  Code2,
  ShoppingBag,
  LayoutDashboard,
  Server,
  Gauge,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Container, SectionHeading } from "./primitives";

type Service = {
  icon: LucideIcon;
  title: string;
  desc: string;
};

const services: Service[] = [
  {
    icon: Palette,
    title: "Website Design",
    desc: "Clean, modern, on-brand designs that turn visitors into customers.",
  },
  {
    icon: Code2,
    title: "Web Development",
    desc: "Fast, responsive, accessible sites built with modern tooling.",
  },
  {
    icon: ShoppingBag,
    title: "E-commerce",
    desc: "Online stores and checkouts that are easy to run and built to sell.",
  },
  {
    icon: LayoutDashboard,
    title: "Web Apps",
    desc: "Custom dashboards, portals, and tools tailored to your workflow.",
  },
  {
    icon: Server,
    title: "Hosting & Maintenance",
    desc: "Reliable hosting, domains, SSL, backups, and ongoing care.",
  },
  {
    icon: Gauge,
    title: "SEO & Performance",
    desc: "Speed, search visibility, and analytics so you keep growing.",
  },
];

export function Services() {
  return (
    <section id="services" className="relative py-24 sm:py-28">
      <Container>
        <SectionHeading
          eyebrow="What we do"
          title={<>Everything you need to <span className="text-gradient">launch & grow</span> online.</>}
          subtitle="One team for the whole journey — design, build, ship, and maintain."
        />

        <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((s) => (
            <div
              key={s.title}
              className="group relative rounded-2xl border border-white/10 bg-card/50 p-6 transition-all duration-300 hover:-translate-y-1 hover:border-brand/40 hover:bg-card/70"
            >
              <div className="mb-5 grid size-12 place-items-center rounded-xl border border-white/10 bg-white/5 text-white">
                <s.icon className="size-6" strokeWidth={1.75} />
              </div>
              <h3 className="text-lg font-semibold">{s.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {s.desc}
              </p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
