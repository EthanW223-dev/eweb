import { Hero } from "@/components/site/hero";
import { Logos } from "@/components/site/logos";
import { AIService } from "@/components/site/ai-service";
import { WebsiteShowcase } from "@/components/site/website-showcase";
import { Services } from "@/components/site/services";
import { Process } from "@/components/site/process";
import { Pricing } from "@/components/site/pricing";
import { FAQ } from "@/components/site/faq";
import { CTA } from "@/components/site/cta";

export default function HomePage() {
  return (
    <>
      <Hero />
      <Logos />
      {/* Two flagship products, front and center */}
      <AIService />
      <WebsiteShowcase />
      <Services />
      <Process />
      <Pricing />
      <FAQ />
      <CTA />
    </>
  );
}
