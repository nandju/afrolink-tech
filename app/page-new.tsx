import { NavbarNew } from "@/components/ui/navbar-new"
import { HeroSectionNew } from "@/components/sections/hero-section-new"
import { FeaturesSectionNew } from "@/components/sections/features-section-new"
import { WorkflowSectionNew } from "@/components/sections/workflow-section-new"
import { TestimonialsSectionNew } from "@/components/sections/testimonials-section-new"
import { FooterSectionNew } from "@/components/sections/footer-section-new"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      <NavbarNew />
      <HeroSectionNew />
      <FeaturesSectionNew />
      <WorkflowSectionNew />
      <TestimonialsSectionNew />
      <FooterSectionNew />
    </div>
  )
}
