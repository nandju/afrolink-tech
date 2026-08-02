"use client"

import Link from "next/link"
import { ArrowRight, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"

export function FinalCtaSection() {
  return (
    <section className="bg-white py-20 lg:py-32">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#D68C2D] to-[#12A2AC] px-8 py-16 text-center shadow-2xl lg:px-16 lg:py-24">
          {/* Decorative elements */}
          <div className="absolute inset-0 -z-10">
            <div className="absolute left-1/4 top-0 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
            <div className="absolute right-1/4 bottom-0 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
          </div>

          <div className="mx-auto max-w-2xl">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-medium text-white backdrop-blur-sm">
              <Sparkles className="h-4 w-4" />
              Prêt à commencer ?
            </div>

            <h2 className="font-heading text-4xl font-bold tracking-tight text-white lg:text-5xl">
              Créez vos premiers certificats en moins de 5 minutes
            </h2>

            <p className="mx-auto mt-6 max-w-xl text-lg text-white/80">
              Rejoignez les centaines d'organisations qui font confiance à PROUV.
              20 crédits offerts à l'inscription, sans carte bancaire.
            </p>

            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link href="/register">
                <Button
                  size="lg"
                  className="group h-12 rounded-xl bg-white px-8 text-base font-semibold text-[#D68C2D] shadow-lg transition-all hover:bg-white/90 hover:shadow-xl"
                >
                  Essayer gratuitement
                  <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
              <Link href="/contact">
                <Button
                  size="lg"
                  variant="outline"
                  className="h-12 rounded-xl border-2 border-white/30 bg-transparent px-8 text-base font-semibold text-white transition-all hover:bg-white/10"
                >
                  Demander une démo
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
