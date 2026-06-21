import { motion } from "framer-motion";
import { Check, Star } from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

export interface PricingPlan {
  name: string;
  /** Display price, e.g. "$100" or "Let's talk". */
  price: string;
  /** Billing period shown after the price, e.g. "per month". Omit for one-time/custom. */
  period?: string;
  /** Small line under the price, e.g. "billed monthly" or "one-time fee". */
  note?: string;
  features: string[];
  description: string;
  buttonText: string;
  href: string;
  isPopular?: boolean;
}

interface PricingProps {
  plans: PricingPlan[];
  title?: string;
  description?: string;
}

export function Pricing({
  plans,
  title = "Simple, transparent pricing",
  description = "Choose the option that fits your business.",
}: PricingProps) {
  return (
    <div className="mx-auto w-full max-w-6xl px-6 py-20">
      <div className="mb-14 space-y-4 text-center">
        <h2 className="text-balance text-3xl font-semibold tracking-tight sm:text-4xl md:text-5xl">
          {title}
        </h2>
        <p className="mx-auto max-w-xl whitespace-pre-line text-pretty text-muted-foreground sm:text-lg">
          {description}
        </p>
      </div>

      <div className="grid grid-cols-1 items-stretch gap-5 md:grid-cols-3">
        {plans.map((plan, index) => (
          <motion.div
            key={plan.name}
            initial={{ y: 50, opacity: 0 }}
            whileInView={{
              y: plan.isPopular ? -16 : 0,
              opacity: 1,
              scale: plan.isPopular ? 1 : 0.97,
            }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{
              duration: 1.2,
              type: "spring",
              stiffness: 100,
              damping: 30,
              delay: index * 0.12,
              opacity: { duration: 0.4 },
            }}
            className={cn("relative", plan.isPopular ? "z-10" : "z-0")}
          >
            <div
              className={cn(
                "group relative flex h-full flex-col rounded-3xl border p-7",
                "transition-all duration-300 ease-out will-change-transform",
                "hover:-translate-y-2.5 hover:border-brand/60 hover:shadow-2xl hover:shadow-brand/20",
                plan.isPopular
                  ? "border-brand/50 bg-card/80 shadow-2xl shadow-brand/10"
                  : "border-white/10 bg-card/50",
              )}
            >
              {/* glow that fades in on hover */}
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0 rounded-3xl bg-[radial-gradient(120%_80%_at_50%_0%,rgba(255,255,255,0.12),transparent_60%)] opacity-0 transition-opacity duration-300 group-hover:opacity-100"
              />
              {plan.isPopular && (
              <div className="absolute right-0 top-0 flex items-center gap-1 rounded-bl-xl rounded-tr-3xl bg-white px-3 py-1 text-black">
                <Star className="size-3.5 fill-current" />
                <span className="text-xs font-semibold">Popular</span>
              </div>
            )}

            <div className="relative z-10 flex flex-1 flex-col">
            <p className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              {plan.name}
            </p>

            <div className="mt-5 flex items-end justify-center gap-1.5">
              <span className="font-display text-5xl font-bold tracking-tight text-foreground">
                {plan.price}
              </span>
              {plan.period && (
                <span className="pb-1.5 text-sm font-medium text-muted-foreground">
                  / {plan.period}
                </span>
              )}
            </div>

            {plan.note && (
              <p className="mt-1 text-center text-xs text-muted-foreground">
                {plan.note}
              </p>
            )}

            <ul className="mt-6 flex flex-col gap-3">
              {plan.features.map((feature) => (
                <li key={feature} className="flex items-start gap-2.5 text-sm">
                  <Check className="mt-0.5 size-4 shrink-0 text-brand-2" />
                  <span className="text-left text-muted-foreground">
                    {feature}
                  </span>
                </li>
              ))}
            </ul>

            <hr className="my-6 border-white/10" />

            <Link
              to={plan.href}
              className={cn(
                "group inline-flex w-full items-center justify-center gap-2 rounded-full px-5 py-3 text-base font-semibold tracking-tight transition-all duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-2",
                plan.isPopular
                  ? "bg-white text-black shadow-lg shadow-white/10 hover:-translate-y-0.5 hover:shadow-white/25"
                  : "border border-white/15 bg-white/5 text-foreground hover:-translate-y-0.5 hover:border-white/30 hover:bg-white/10",
              )}
            >
              {plan.buttonText}
            </Link>

            <p className="mt-5 text-center text-xs leading-5 text-muted-foreground">
              {plan.description}
            </p>
            </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
