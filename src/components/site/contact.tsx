import { useState, type FormEvent } from "react";
import { Mail, ArrowRight } from "lucide-react";
import { Container } from "./primitives";

const EMAIL = "hello@eweb.dev";

export function Contact() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    const subject = encodeURIComponent(`New project enquiry from ${form.name || "website"}`);
    const body = encodeURIComponent(
      `Name: ${form.name}\nEmail: ${form.email}\n\n${form.message}`,
    );
    window.location.href = `mailto:${EMAIL}?subject=${subject}&body=${body}`;
  };

  const field =
    "w-full rounded-xl border border-white/10 bg-background/50 px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/70 outline-none transition-colors focus:border-brand/60 focus:bg-background/80";

  return (
    <section id="contact" className="relative py-24 sm:py-28">
      <Container>
        <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-card/60 p-8 sm:p-12">
          <div
            aria-hidden
            className="pointer-events-none absolute -right-20 -top-24 size-80 rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.12),transparent_60%)] blur-2xl"
          />
          <div className="relative grid gap-10 lg:grid-cols-2">
            <div>
              <h2 className="text-3xl font-semibold sm:text-4xl">
                Let's build something <span className="text-gradient">great</span>.
              </h2>
              <p className="mt-4 max-w-md text-muted-foreground">
                Tell us about your project and we'll get back to you within one
                business day with next steps and a quote.
              </p>
              <a
                href={`mailto:${EMAIL}`}
                className="mt-6 inline-flex items-center gap-2 text-sm text-foreground transition-colors hover:text-brand-2"
              >
                <Mail className="size-4 text-brand-2" />
                {EMAIL}
              </a>
            </div>

            <form onSubmit={onSubmit} className="flex flex-col gap-3">
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="name" className="text-xs text-muted-foreground">
                    Name
                  </label>
                  <input
                    id="name"
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="Jane Doe"
                    className={field}
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="email" className="text-xs text-muted-foreground">
                    Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="jane@company.com"
                    className={field}
                  />
                </div>
              </div>
              <div className="flex flex-col gap-1.5">
                <label htmlFor="message" className="text-xs text-muted-foreground">
                  About your project
                </label>
                <textarea
                  id="message"
                  required
                  rows={4}
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  placeholder="What do you want to build?"
                  className={field}
                />
              </div>
              <button
                type="submit"
                className="group mt-1 inline-flex items-center justify-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-medium text-black shadow-lg shadow-white/10 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-white/25 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              >
                Send enquiry
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
              </button>
            </form>
          </div>
        </div>
      </Container>
    </section>
  );
}
