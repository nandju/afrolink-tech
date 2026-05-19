import Link from "next/link"
import { LiquidCtaButton } from "@/components/buttons/liquid-cta-button"

export function CtaSection() {
  return (
    <section className="px-6 py-24">
      <div className="max-w-3xl mx-auto text-center">
        <h2 className="font-display text-4xl md:text-5xl font-bold text-[#ffffff] mb-6">Prêt à commencer ?</h2>
        <p className="text-lg text-[#ffffff]/70 mb-10 text-balance">
          Générez vos certificats en quelques minutes. Accès simple et sécurisé pour votre organisation.
        </p>
        <div className="flex items-center justify-center">
          <Link href="/login">
            <LiquidCtaButton>Accéder à l'outil</LiquidCtaButton>
          </Link>
        </div>
      </div>
    </section>
  )
}
