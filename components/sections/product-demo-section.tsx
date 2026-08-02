"use client"

import { ProductMockupTabs } from "@/components/ui/product-mockup"

export function ProductDemoSection() {
  return (
    <section className="bg-gradient-to-b from-white to-[#FAFAFA] py-20 lg:py-32">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mx-auto max-w-3xl text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#12A2AC]/20 bg-[#12A2AC]/5 px-4 py-2 text-sm font-medium text-[#12A2AC]">
            Aperçu produit
          </div>
          <h2 className="font-heading text-4xl font-bold tracking-tight text-[#1E1E1E] lg:text-5xl">
            Découvrez PROUV en action
          </h2>
          <p className="mt-4 text-lg text-[#6B7280]">
            Explorez les différentes vues de la plateforme : tableau de bord, éditeur, vérification et wallet bénéficiaire.
          </p>
        </div>

        {/* Tabbed product mockup */}
        <div className="mt-16">
          <ProductMockupTabs />
        </div>
      </div>
    </section>
  )
}
