import { Pricing as PricingCards, type PricingPlan } from "@/components/ui/pricing";

const plans: PricingPlan[] = [
  {
    name: "AI Call Service",
    price: "$100",
    period: "month",
    note: "billed monthly",
    features: [
      "AI answers your calls 24/7",
      "Books & schedules appointments automatically",
      "Syncs with your calendar",
      "Never miss a customer again",
      "Monthly performance summary",
    ],
    description: "A virtual receptionist that works around the clock.",
    buttonText: "Get started",
    href: "/contact",
  },
  {
    name: "Website Build",
    price: "$500",
    note: "one-time fee",
    features: [
      "Custom-designed website",
      "Built & shipped for you",
      "Mobile-responsive & fast",
      "SEO-ready out of the box",
      "Launch support included",
    ],
    description: "A modern website, designed and built end to end.",
    buttonText: "Start your project",
    href: "/contact",
    isPopular: true,
  },
  {
    name: "Custom Request",
    price: "Let's talk",
    features: [
      "Tailored to your exact needs",
      "Bespoke features & integrations",
      "One-on-one consultation",
      "Flexible scope & timeline",
      "Custom quote",
    ],
    description: "Have something specific in mind? We'll scope it together.",
    buttonText: "Contact us",
    href: "/contact",
  },
];

export function Pricing() {
  return (
    <section id="pricing" className="relative py-24 sm:py-28">
      <PricingCards
        plans={plans}
        title="Simple, transparent pricing"
        description={"Choose the option that fits your business.\nEvery project gets a tailored quote — no hourly surprises."}
      />
    </section>
  );
}
