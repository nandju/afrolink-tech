"use client"

import { Button } from "@/components/ui/button"
import { ProductMockup } from "@/components/ui/product-mockup"
import { ArrowRight, Sparkles, CheckCircle, ShieldCheck, Zap, Users } from "lucide-react"
import Link from "next/link"

export function HeroSectionNew() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-white to-[#FAFAFA] py-20 lg:py-28">
      {/* Decorative background elements */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute left-1/4 top-20 h-96 w-96 rounded-full bg-[#D68C2D]/5 blur-3xl" />
        <div className="absolute right-1/4 top-40 h-96 w-96 rounded-full bg-[#12A2AC]/5 blur-3xl" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Left: Content */}
          <div className="space-y-8">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 rounded-full border border-[#D68C2D]/20 bg-[#D68C2D]/5 px-4 py-2 text-sm font-medium text-[#D68C2D]">
              <Sparkles className="h-4 w-4" />
              Créez, émettez et vérifiez vos certificats en quelques minutes
            </div>

            {/* Heading */}
            <div className="space-y-4">
              <h1 className="font-heading text-5xl font-bold leading-tight tracking-tight text-[#1E1E1E] lg:text-6xl xl:text-7xl">
                La plateforme de{" "}
                <span className="bg-gradient-to-r from-[#D68C2D] to-[#12A2AC] bg-clip-text text-transparent">
                  certification
                </span>{" "}
                moderne pour l'Afrique
              </h1>
              <p className="text-lg leading-relaxed text-[#6B7280] lg:text-xl">
                PROUV vous permet de créer, personnaliser et distribuer des certificats PDF
                authentiques en quelques clics. Importez vos données, configurez votre modèle
                et générez des centaines de certificats en quelques secondes.
              </p>
            </div>

            {/* CTAs */}
            <div className="flex flex-col gap-4 sm:flex-row">
              <Link href="/register">
                <Button
                  size="lg"
                  className="group h-12 rounded-xl bg-[#D68C2D] px-8 text-base font-semibold text-white shadow-lg shadow-[#D68C2D]/25 transition-all hover:bg-[#D68C2D]/90 hover:shadow-xl hover:shadow-[#D68C2D]/30"
                >
                  Essayer gratuitement
                  <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
              <Link href="/contact">
                <Button
                  size="lg"
                  variant="outline"
                  className="h-12 rounded-xl border-2 border-[#E5E7EB] bg-white px-8 text-base font-semibold text-[#1E1E1E] transition-all hover:border-[#D68C2D]/30 hover:bg-[#D68C2D]/5"
                >
                  Demander une démo
                </Button>
              </Link>
            </div>

            {/* Features list */}
            <div className="space-y-3 pt-4">
              {[
                "Configuration en 5 minutes",
                "Import Excel/CSV automatique",
                "Vérification publique par QR code",
              ].map((feature) => (
                <div key={feature} className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-[#10B981]" />
                  <span className="text-sm font-medium text-[#6B7280]">{feature}</span>
                </div>
              ))}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 border-t border-[#E5E7EB] pt-8">
              <div>
                <div className="font-heading text-3xl font-bold text-[#1E1E1E]">5 000+</div>
                <div className="mt-1 text-sm text-[#6B7280]">Certificats émis</div>
              </div>
              <div>
                <div className="font-heading text-3xl font-bold text-[#1E1E1E]">120+</div>
                <div className="mt-1 text-sm text-[#6B7280]">Organisations</div>
              </div>
              <div>
                <div className="font-heading text-3xl font-bold text-[#1E1E1E]">99%</div>
                <div className="mt-1 text-sm text-[#6B7280]">Temps économisé</div>
              </div>
            </div>
          </div>

          {/* Right: Product Visual */}
          <div className="relative">
            <div className="relative z-10">
              <ProductMockup view="dashboard" />
            </div>

            {/* Floating cards */}
            <div className="absolute -left-8 top-1/4 z-20 hidden rounded-xl border border-[#E5E7EB] bg-white p-4 shadow-xl lg:block">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#10B981]/10">
                  <ShieldCheck className="h-5 w-5 text-[#10B981]" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-[#1E1E1E]">Vérifié</div>
                  <div className="text-xs text-[#6B7280]">Certificat authentique</div>
                </div>
              </div>
            </div>

            <div className="absolute -right-8 bottom-1/4 z-20 hidden rounded-xl border border-[#E5E7EB] bg-white p-4 shadow-xl lg:block">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#D68C2D]/10">
                  <Zap className="h-5 w-5 text-[#D68C2D]" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-[#1E1E1E]">2.5 secondes</div>
                  <div className="text-xs text-[#6B7280]">Temps moyen / certificat</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
