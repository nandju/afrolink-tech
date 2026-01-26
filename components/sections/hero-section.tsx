"use client"

import Link from "next/link"
import { LiquidCtaButton } from "@/components/buttons/liquid-cta-button"
import { Sparkles, ArrowRight } from "lucide-react"

export function HeroSection() {
  return (
    <section className="min-h-screen flex flex-col items-center justify-center px-6 pt-24 pb-20 relative">
      {/* Background gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#000000]/50 via-transparent to-transparent" />

      {/* Content */}
      <div className="relative z-10 text-center max-w-3xl mx-auto">
        {/* Badge - customize your announcement */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#000000]/80 border border-[#000000] mb-8">
          <Sparkles className="w-4 h-4 text-[#ffa51f]" />
          <span className="text-sm text-[#ffffff]/80">Génération automatique de certificats PDF</span>
        </div>

        {/* Headline - customize your value proposition */}
        <h1 className="font-display text-5xl md:text-7xl font-bold tracking-tight mb-6">
          <span className="text-[#ffffff] block">Générez des certificats.</span>
          <span className="bg-gradient-to-r from-[#ffa51f] via-[#ffa51f] to-[#ffa51f] bg-clip-text text-transparent">
            Automatiquement.
          </span>
        </h1>

        {/* Subheadline - describe your product */}
        <p className="text-lg md:text-xl text-[#ffffff]/70 max-w-2xl mx-auto mb-10 leading-relaxed text-balance">
          Créez des certificats PDF personnalisés en masse à partir d'un modèle et d'une liste de noms. Parfait pour les formations, ONG, écoles et séminaires.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href="/login">
            <LiquidCtaButton>Accéder à l'outil</LiquidCtaButton>
          </Link>
          <Link
            href="#features"
            className="group flex items-center gap-2 px-6 py-3 text-sm font-medium text-[#ffffff]/70 hover:text-[#ffffff] transition-colors"
          >
            <span>Découvrir les fonctionnalités</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
          </Link>
        </div>

        {/* Social proof */}
        <div className="mt-16 flex flex-col sm:flex-row items-center justify-center gap-4">
          <div className="flex items-center gap-4">
            <div className="flex -space-x-3">
              <img
                src="https://images.unsplash.com/photo-1633332755192-727a05c4013d?q=80&w=200"
                alt="User avatar"
                className="w-10 h-10 rounded-full border-2 border-zinc-950 hover:-translate-y-1 transition object-cover z-[1]"
              />
              <img
                src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200"
                alt="User avatar"
                className="w-10 h-10 rounded-full border-2 border-zinc-950 hover:-translate-y-1 transition object-cover z-[2]"
              />
              <img
                src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=200&h=200&auto=format&fit=crop"
                alt="User avatar"
                className="w-10 h-10 rounded-full border-2 border-zinc-950 hover:-translate-y-1 transition object-cover z-[3]"
              />
              <img
                src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200"
                alt="User avatar"
                className="w-10 h-10 rounded-full border-2 border-zinc-950 hover:-translate-y-1 transition object-cover z-[4]"
              />
              <img
                src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200"
                alt="User avatar"
                className="w-10 h-10 rounded-full border-2 border-zinc-950 hover:-translate-y-1 transition object-cover z-[5]"
              />
            </div>
            <div className="h-8 w-px bg-[#000000]" />
            <div className="flex flex-col items-start">
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((i) => (
                  <svg
                    key={i}
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="#ffa51f"
                    stroke="#ffa51f"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="m12 2 3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01z" />
                  </svg>
                ))}
                <span className="text-[#ffffff]/70 font-medium ml-1 text-sm">5.0</span>
              </div>
              <p className="text-sm text-[#ffffff]/70">
                Utilisé par <span className="text-[#ffffff] font-medium">100+</span> organisations
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
