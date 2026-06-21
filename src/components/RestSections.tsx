import { ArrowRight, Check, Globe, Megaphone, Phone } from "lucide-react";
import type { LucideIcon } from "lucide-react";

const SERVICES: {
  icon: LucideIcon;
  title: string;
  desc: string;
  points: string[];
}[] = [
  {
    icon: Globe,
    title: "Websites",
    desc: "Fast, modern sites designed to turn visitors into paying customers.",
    points: ["Custom design", "Launched in days", "$500 one-time"],
  },
  {
    icon: Phone,
    title: "AI Call Answering",
    desc: "An AI receptionist that answers every call 24/7 in a natural voice.",
    points: ["Books appointments", "Takes messages", "$100 / month"],
  },
  {
    icon: Megaphone,
    title: "Advertising",
    desc: "High-converting ad campaigns that put you in front of ready buyers.",
    points: ["Google · Meta · TikTok", "Fully managed", "Clear reporting"],
  },
];

export function RestSections() {
  return (
    <div className="relative z-10 bg-white">
      {/* Services */}
      <section className="mx-auto max-w-6xl px-6 py-20 sm:py-28">
        <div className="mx-auto max-w-2xl text-center">
          <span
            data-reveal
            className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-gray-50 px-3.5 py-1.5 text-[12px] font-medium text-gray-600"
          >
            What we do
          </span>
          <h2
            data-reveal
            className="mt-5 text-3xl font-semibold leading-tight tracking-tight text-gray-900 sm:text-5xl"
          >
            Everything your business needs to grow online.
          </h2>
          <p data-reveal className="mt-4 text-base leading-relaxed text-gray-600 sm:text-lg">
            One team for your website, your phone line and your advertising — so you can focus on
            running the business.
          </p>
        </div>

        <div data-reveal-group className="mt-14 grid gap-6 md:grid-cols-3">
          {SERVICES.map(({ icon: Icon, title, desc, points }) => (
            <div
              key={title}
              data-reveal
              className="rounded-2xl border border-gray-200 bg-white p-7 shadow-sm transition-shadow hover:shadow-md"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gray-900 text-white">
                <Icon className="h-5 w-5" />
              </div>
              <h3 className="mt-5 text-lg font-semibold text-gray-900">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-gray-600">{desc}</p>
              <ul className="mt-5 space-y-2">
                {points.map((p) => (
                  <li key={p} className="flex items-center gap-2 text-sm text-gray-700">
                    <Check className="h-4 w-4 text-indigo-500" /> {p}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* CTA band */}
      <section className="mx-auto max-w-6xl px-6 pb-24">
        <div
          data-reveal
          className="relative overflow-hidden rounded-3xl bg-gray-900 px-8 py-14 text-center text-white sm:px-16"
        >
          <div className="pointer-events-none absolute -left-20 -top-20 h-72 w-72 rounded-full bg-[radial-gradient(circle,rgba(99,102,241,0.45),transparent_70%)] blur-2xl" />
          <div className="relative">
            <h2 className="mx-auto max-w-xl text-3xl font-semibold tracking-tight sm:text-4xl">
              Ready to get found, booked and growing?
            </h2>
            <p className="mx-auto mt-4 max-w-md text-white/70">
              Tell us about your business and we'll put together a plan — usually within a day.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <button className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-medium text-gray-900 transition-transform hover:scale-[1.03]">
                Get a quote <ArrowRight className="h-4 w-4" />
              </button>
              <button className="rounded-full border border-white/25 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-white/10">
                Book a call
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
