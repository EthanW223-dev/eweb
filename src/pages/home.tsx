import { Hero } from "@/components/site/hero";
import { Logos } from "@/components/site/logos";
import { Services } from "@/components/site/services";
import { AIService } from "@/components/site/ai-service";
import { Work } from "@/components/site/work";
import { Process } from "@/components/site/process";
import { Pricing } from "@/components/site/pricing";
import { FAQ } from "@/components/site/faq";
import { CTA } from "@/components/site/cta";
import { Container, SectionHeading } from "@/components/site/primitives";
import { Testimonials } from "@/components/ui/unique-testimonial";

export default function HomePage() {
  return (
    <>
      <Hero />
      <Logos />
      <Services />
      <AIService />
      <Work />
      <Process />

      {/* Social proof */}
      <section className="relative py-20 sm:py-24">
        <Container>
          <SectionHeading
            eyebrow="Kind words"
            title={<>Loved by the people we <span className="text-gradient">build for</span>.</>}
            subtitle="A few words from clients and collaborators."
          />
          <Testimonials />
        </Container>
      </section>

      <Pricing />
      <FAQ />
      <CTA />
    </>
  );
}
