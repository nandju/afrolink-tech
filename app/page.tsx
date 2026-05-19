import { Navbar } from "@/components/ui/navbar"
import { HeroSection } from "@/components/sections/hero-section"
import { ImpactSection } from "@/components/sections/impact-section"
import { FeaturesSection } from "@/components/sections/features-section"
import { TestimonialsSection } from "@/components/sections/testimonials-section"
import { PricingSection } from "@/components/sections/pricing-section"
import { CtaSection } from "@/components/sections/cta-section"
import { FooterSection } from "@/components/sections/footer-section"
import { WorkflowSection } from "@/components/sections/workflow-section"

export default function Home() {
  return (
    <main className="min-h-screen bg-[#000000]">
      <Navbar />
      <HeroSection />
      {/* <ImpactSection /> */}
      <FeaturesSection />
      <WorkflowSection />
      <TestimonialsSection />
      {/* <PricingSection /> */}
      <CtaSection />
      <FooterSection />
    </main>
  )
}
