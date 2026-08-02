import { NavbarNew } from "@/components/ui/navbar-new"
import { HeroSectionNew } from "@/components/sections/hero-section-new"
import { ReassuranceStrip } from "@/components/sections/reassurance-strip"
import { ProblemSolutionSection } from "@/components/sections/problem-solution-section"
import { FeaturesSectionNew } from "@/components/sections/features-section-new"
import { ProductDemoSection } from "@/components/sections/product-demo-section"
import { UseCasesSection } from "@/components/sections/use-cases-section"
import { TestimonialsSectionNew } from "@/components/sections/testimonials-section-new"
import { FaqSection } from "@/components/sections/faq-section"
import { FinalCtaSection } from "@/components/sections/final-cta-section"
import { FooterSectionNew } from "@/components/sections/footer-section-new"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      <NavbarNew />
      <HeroSectionNew />
      <ReassuranceStrip />
      <ProblemSolutionSection />
      <FeaturesSectionNew />
      <ProductDemoSection />
      <UseCasesSection />
      <TestimonialsSectionNew />
      <FaqSection />
      <FinalCtaSection />
      <FooterSectionNew />
    </div>
  )
}
