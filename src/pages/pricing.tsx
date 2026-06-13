import { Pricing } from "@/components/site/pricing";
import { FAQ } from "@/components/site/faq";
import { CTA } from "@/components/site/cta";

export default function PricingPage() {
  return (
    <div className="pt-16 sm:pt-20">
      <Pricing />
      <FAQ />
      <CTA />
    </div>
  );
}
