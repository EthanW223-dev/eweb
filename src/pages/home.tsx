import { Hero } from "@/components/site/hero";
import { Logos } from "@/components/site/logos";
import { Services } from "@/components/site/services";
import { AIService } from "@/components/site/ai-service";
import { Work } from "@/components/site/work";
import { Process } from "@/components/site/process";
import { Pricing } from "@/components/site/pricing";
import { FAQ } from "@/components/site/faq";
import { CTA } from "@/components/site/cta";

export default function HomePage() {
  return (
    <>
      <Hero />
      <Logos />
      <Services />
      <AIService />
      <Work />
      <Process />
      <Pricing />
      <FAQ />
      <CTA />
    </>
  );
}
