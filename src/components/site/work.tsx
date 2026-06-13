import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { Container, SectionHeading } from "./primitives";

type Project = {
  title: string;
  category: string;
  image: string;
  tags: string[];
  description?: string;
  /** External link (opens in a new tab). Falls back to the contact page. */
  href?: string;
};

const projects: Project[] = [
  {
    title: "Kong",
    category: "VR Horror · Meta Quest",
    image: "/kong-horror.webp",
    description:
      "A horror VR experience on Meta Quest. I contributed 3D modeling and ideas, and was deeply involved with the community (2021–2023).",
    tags: ["3D Modeling", "VR", "Meta Quest", "Community"],
    href: "https://www.meta.com/experiences/kong/5930522500329653/",
  },
  {
    title: "SDSU Hackathon",
    category: "App Design · Social Impact",
    image:
      "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=80",
    description:
      "An app I designed at an SDSU hackathon to help people experiencing homelessness find nearby shelter, food, and support resources.",
    tags: ["UI/UX", "Hackathon", "Mobile", "Social Impact"],
  },
  {
    title: "Pi Router + NAS",
    category: "Self-Hosted · Homelab",
    image:
      "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1200&q=80",
    description:
      "A Raspberry Pi travel-router and NAS combo I built to run self-hosted services anywhere — private storage, secure networking, and apps on the go.",
    tags: ["Raspberry Pi", "Self-Hosted", "Networking", "Linux"],
  },
];

const cardClass =
  "group relative flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-card/50 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-brand/40";

function CardInner({ p }: { p: Project }) {
  return (
    <>
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={p.image}
          alt={`${p.title} — ${p.category}`}
          loading="lazy"
          className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-card via-card/20 to-transparent" />
        <span className="absolute right-3 top-3 grid size-9 place-items-center rounded-full bg-background/70 text-foreground backdrop-blur transition-colors group-hover:bg-white group-hover:text-black">
          <ArrowUpRight className="size-4" />
        </span>
      </div>
      <div className="flex flex-1 flex-col p-5">
        <p className="text-xs font-medium uppercase tracking-wider text-brand-2">
          {p.category}
        </p>
        <h3 className="mt-1 text-lg font-semibold">{p.title}</h3>
        {p.description && (
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            {p.description}
          </p>
        )}
        <div className="mt-3 flex flex-wrap gap-2">
          {p.tags.map((t) => (
            <span
              key={t}
              className="rounded-full border border-white/10 px-2.5 py-1 text-xs text-muted-foreground"
            >
              {t}
            </span>
          ))}
        </div>
      </div>
    </>
  );
}

export function Work() {
  return (
    <section id="work" className="relative py-24 sm:py-28">
      <Container>
        <SectionHeading
          align="left"
          eyebrow="Selected work"
          title={<>Recent projects we're <span className="text-gradient">proud of</span>.</>}
          subtitle="A glimpse of the work we're proud of — from client sites to community projects."
        />

        <div className="mt-14 grid items-stretch gap-5 md:grid-cols-3">
          {projects.map((p) =>
            p.href ? (
              <a
                key={p.title}
                href={p.href}
                target="_blank"
                rel="noopener noreferrer"
                className={cardClass}
              >
                <CardInner p={p} />
              </a>
            ) : (
              <Link key={p.title} to="/contact" className={cardClass}>
                <CardInner p={p} />
              </Link>
            ),
          )}
        </div>
      </Container>
    </section>
  );
}
