"use client"

import Link from "next/link"
import { LiquidCtaButton } from "@/components/buttons/liquid-cta-button"
import { Sparkles } from "lucide-react"

export function HeroSection() {
  return (
    <section className="min-h-screen flex flex-col overflow-hidden relative bg-[var(--color-background)] font-body">
      {/* Gradient & Glassmorphism Overlay */}
      <div className="absolute inset-0 gradient-primary opacity-30 pointer-events-none" />
      <div className="absolute inset-0 glass opacity-80 pointer-events-none" />

      <div className="relative z-10 mx-auto w-full max-w-7xl px-5 sm:px-6 flex flex-col min-h-screen pt-24 sm:pt-28">
        <div className="grid flex-1 items-center justify-items-center gap-8 pb-8 text-center sm:pb-14 md:grid-cols-[1fr] md:pb-20 lg:grid-cols-[0.9fr_1fr_0.72fr] lg:justify-items-start lg:pb-24 lg:text-left">
          <div className="relative z-12 w-full max-w-[26rem] sm:max-w-lg md:w-full md:max-w-xl lg:max-w-lg">
            {/* PROUV Logo */}
            <div className="mb-6 flex items-center gap-2">
              <img src="/logo/icone_orange.png" alt="PROUV Logo" className="h-10 w-10 rounded-xl bg-white p-1 shadow-md" />
              <span className="font-heading text-2xl font-bold tracking-tight text-[var(--color-primary)]">PROUV</span>
            </div>
            {/* Headline */}
            <h1 className="font-heading text-[2.7rem] sm:text-5xl md:text-6xl font-bold tracking-tight text-[var(--color-text)] drop-shadow-lg leading-tight mb-5">
              Générez et envoyez vos certificats en quelques secondes.
            </h1>
            <p className="mb-10 text-lg text-[var(--color-text)]/80 font-body font-normal leading-relaxed">
              Importez votre fichier Excel, personnalisez votre modèle PDF et envoyez automatiquement vos certificats à tous vos participants.
            </p>
            {/* CTA Buttons */}
            <div className="flex gap-4 flex-wrap justify-center lg:justify-start">
              <a href="/dashboard">
                <button className="px-7 py-3 rounded-2xl font-heading font-semibold text-lg bg-[var(--color-primary)] text-white shadow-lg hover:bg-[var(--color-secondary)] transition-all">
                  Générer mon certificat
                </button>
              </a>
              <a href="#demo">
                <button className="px-7 py-3 rounded-2xl font-heading font-semibold text-lg bg-white text-[var(--color-primary)] border border-[var(--color-primary)] shadow-lg hover:bg-[var(--color-secondary)] hover:text-white transition-all">
                  Voir une démo
                </button>
              </a>
            </div>
          </div>

          {/* Preview Area */}
          <div className="relative z-12 mt-12 md:mt-0 flex flex-col items-center gap-6">
            {/* Dashboard Mockup */}
            <div className="glass soft-shadow rounded-2xl p-4 w-[340px] max-w-full flex flex-col items-center mb-2">
              <img src="/logo/icone_blanc.png" alt="Tableau de bord" className="h-8 mb-2" />
              <span className="font-heading text-lg text-[var(--color-primary)] mb-1">Tableau de bord</span>
              <div className="w-full h-16 bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)] rounded-xl opacity-30 mb-2" />
              <div className="w-full flex gap-2">
                <div className="h-8 flex-1 bg-[var(--color-secondary)]/30 rounded-lg" />
                <div className="h-8 flex-1 bg-[var(--color-primary)]/30 rounded-lg" />
              </div>
            </div>
            {/* PDF Preview */}
            <div className="glass soft-shadow rounded-2xl p-4 w-[340px] max-w-full flex flex-col items-center mb-2">
              <img src="/logo/Icone_noir.png" alt="Aperçu PDF" className="h-8 mb-2" />
              <span className="font-heading text-lg text-[var(--color-secondary)] mb-1">Aperçu PDF</span>
              <div className="w-full h-28 bg-white rounded-lg border border-[var(--color-secondary)] flex items-center justify-center text-[var(--color-secondary)] font-heading text-2xl">
                PDF
              </div>
            </div>
            {/* Email Preview */}
            <div className="glass soft-shadow rounded-2xl p-4 w-[340px] max-w-full flex flex-col items-center">
              <img src="/logo/icone_orange.png" alt="Aperçu Email" className="h-8 mb-2" />
              <span className="font-heading text-lg text-[var(--color-primary)] mb-1">Aperçu Email</span>
              <div className="w-full h-20 bg-white rounded-lg border border-[var(--color-primary)] flex flex-col items-center justify-center text-[var(--color-primary)] font-body text-base">
                <span className="font-bold">Objet : Votre certificat</span>
                <span className="text-xs mt-1">Bonjour Jean Dupont, votre certificat est en pièce jointe !</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
