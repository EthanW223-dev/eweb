import { ArrowRight, PhoneCall } from "lucide-react";
import { Container, Button } from "./primitives";

export function CTA() {
  return (
    <section className="relative py-24 sm:py-28">
      <Container>
        <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-card/60 px-6 py-16 text-center sm:px-12 sm:py-20">
          {/* accent glow + dotted grid backdrop */}
          <div
            aria-hidden
            className="accent-glow pointer-events-none absolute left-1/2 top-0 -z-0 h-80 w-[700px] max-w-[95vw] -translate-x-1/2 -translate-y-1/3 rounded-full opacity-50 blur-2xl"
          />
          <div
            aria-hidden
            className="bg-dot-grid pointer-events-none absolute inset-0 -z-0 opacity-[0.4] [mask-image:radial-gradient(ellipse_at_center,black,transparent_75%)]"
          />

          <div className="relative">
            <h2 className="mx-auto max-w-2xl text-balance text-3xl font-semibold sm:text-4xl md:text-5xl">
              Ready to win more customers?
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-pretty text-muted-foreground sm:text-lg">
              Get a website that sells and an AI receptionist that never sleeps.
              Tell us about your business and we'll send a plan and a quote
              within one business day.
            </p>

            <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Button to="/contact" variant="cta" size="lg">
                Start your project
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
              </Button>
              <Button to="/pricing" variant="outline" size="lg">
                <PhoneCall className="size-4" />
                View pricing
              </Button>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
