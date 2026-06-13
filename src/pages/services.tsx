import { Services } from "@/components/site/services";
import { AIService } from "@/components/site/ai-service";
import { Process } from "@/components/site/process";
import { CTA } from "@/components/site/cta";

export default function ServicesPage() {
  return (
    <div className="pt-16 sm:pt-20">
      <Services />
      <AIService />
      <Process />
      <CTA />
    </div>
  );
}
