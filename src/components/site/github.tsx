import { ArrowUpRight, Star, GitFork } from "lucide-react";

export const GITHUB_URL = "https://github.com/EthanW223-dev";

const GithubIcon = ({ className = "size-5" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden>
    <path d="M12 2C6.48 2 2 6.58 2 12.25c0 4.53 2.87 8.37 6.84 9.73.5.1.68-.22.68-.49 0-.24-.01-.88-.01-1.73-2.78.62-3.37-1.37-3.37-1.37-.45-1.18-1.11-1.5-1.11-1.5-.91-.64.07-.62.07-.62 1 .07 1.53 1.06 1.53 1.06.89 1.56 2.34 1.11 2.91.85.09-.66.35-1.11.63-1.36-2.22-.26-4.56-1.14-4.56-5.07 0-1.12.39-2.03 1.03-2.75-.1-.26-.45-1.3.1-2.71 0 0 .84-.27 2.75 1.05a9.4 9.4 0 0 1 5 0c1.91-1.32 2.75-1.05 2.75-1.05.55 1.41.2 2.45.1 2.71.64.72 1.03 1.63 1.03 2.75 0 3.94-2.34 4.81-4.57 5.06.36.32.68.94.68 1.9 0 1.37-.01 2.47-.01 2.81 0 .27.18.6.69.49A10.26 10.26 0 0 0 22 12.25C22 6.58 17.52 2 12 2z" />
  </svg>
);

// Real public repos — update this list as the account grows.
const repos: {
  name: string;
  description: string;
  language?: string;
  languageColor?: string;
  href: string;
}[] = [
  {
    name: "Scrap",
    description: "Small game-dev project",
    language: "C#",
    languageColor: "#178600",
    href: `${GITHUB_URL}/Scrap`,
  },
  {
    name: "Team-121",
    description: "Home Hackers — hackathon project",
    href: `${GITHUB_URL}/Team-121`,
  },
];

export function GithubCard() {
  return (
    <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-card/50 p-6 backdrop-blur-sm sm:p-8">
      <div
        aria-hidden
        className="accent-glow pointer-events-none absolute -right-16 -top-20 size-64 rounded-full opacity-30 blur-2xl"
      />

      <div className="relative flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <img
            src="https://avatars.githubusercontent.com/u/91440605?v=4"
            alt="Ethan on GitHub"
            loading="lazy"
            className="size-14 rounded-2xl border border-white/10 object-cover"
          />
          <div>
            <div className="flex items-center gap-2">
              <GithubIcon className="size-4" />
              <span className="font-display text-lg font-semibold">Ethan</span>
            </div>
            <a
              href={GITHUB_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-muted-foreground transition-colors hover:text-brand-2"
            >
              @EthanW223-dev · building in the open since 2021
            </a>
          </div>
        </div>

        <a
          href={GITHUB_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="group inline-flex shrink-0 items-center justify-center gap-2 rounded-full border border-white/15 bg-white/5 px-5 py-2.5 text-sm font-medium text-foreground backdrop-blur transition-all hover:border-white/30 hover:bg-white/10"
        >
          <GithubIcon className="size-4" />
          View profile
          <ArrowUpRight className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </a>
      </div>

      <div className="relative mt-6 grid gap-3 sm:grid-cols-2">
        {repos.map((r) => (
          <a
            key={r.name}
            href={r.href}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex flex-col rounded-2xl border border-white/10 bg-background/40 p-4 transition-all hover:-translate-y-0.5 hover:border-brand/40"
          >
            <div className="flex items-center gap-2">
              <GitFork className="size-3.5 text-muted-foreground" />
              <span className="text-sm font-semibold group-hover:text-brand-2">
                {r.name}
              </span>
              <ArrowUpRight className="ml-auto size-3.5 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
            </div>
            <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
              {r.description}
            </p>
            <div className="mt-3 flex items-center gap-4 text-xs text-muted-foreground">
              {r.language && (
                <span className="inline-flex items-center gap-1.5">
                  <span
                    className="size-2.5 rounded-full"
                    style={{ backgroundColor: r.languageColor }}
                  />
                  {r.language}
                </span>
              )}
              <span className="inline-flex items-center gap-1">
                <Star className="size-3.5" />0
              </span>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
