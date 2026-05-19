"use client"

import Link from "next/link"
import { LiquidCtaButton } from "@/components/buttons/liquid-cta-button"
import { Sparkles } from "lucide-react"

export function HeroSection() {
  return (
    <section className="min-h-screen flex flex-col overflow-hidden relative bg-[#000000]">

      {/* ── Radial glow en haut au centre ── */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(255,165,31,0.18),transparent_55%)]" />

      {/* ── Image hero — pleine hauteur, centrée, z intermédiaire ── */}
      <div className="pointer-events-none absolute inset-0 z-[1] hidden items-end justify-center md:flex">
        <img
          src="/hero-certificate-holder.png"
          alt=""
          className="
            h-[76vh] max-h-[760px] min-h-[470px]
            w-auto translate-x-0 object-contain object-bottom
            opacity-54 mix-blend-luminosity
            sm:h-[82vh] sm:min-h-[540px] sm:translate-x-[14%] sm:opacity-66
            md:h-[92vh] md:min-h-[620px] md:translate-x-[8%] md:opacity-76
            lg:h-[101vh] lg:max-h-[1120px] lg:translate-x-[4%] lg:opacity-80
          "
        />
      </div>

      {/* ── Vignettes latérales (assombrissent derrière les textes) ── */}
      <div className="pointer-events-none absolute inset-0 z-[2] bg-[linear-gradient(180deg,rgba(0,0,0,0.42)_0%,rgba(0,0,0,0.18)_38%,rgba(0,0,0,0.9)_100%),linear-gradient(90deg,rgba(0,0,0,0.96)_0%,rgba(0,0,0,0.58)_44%,rgba(0,0,0,0.18)_100%)] md:bg-[linear-gradient(90deg,rgba(0,0,0,0.96)_0%,rgba(0,0,0,0.64)_24%,rgba(0,0,0,0.14)_48%,rgba(0,0,0,0.54)_78%,rgba(0,0,0,0.94)_100%)]" />

      {/* ── Fondu bas (le titre géant se fond dans le noir) ── */}
      <div className="pointer-events-none absolute bottom-0 inset-x-0 z-[4] h-48 bg-gradient-to-t from-[#000000] to-transparent" />

      {/* ══════════════════════════════════════════
          CONTENU principal — z-[10] au-dessus de tout
      ══════════════════════════════════════════ */}
      <div className="relative z-10 mx-auto w-full max-w-7xl px-5 sm:px-6 flex flex-col min-h-screen pt-24 sm:pt-28">

        {/* ── Zone centrale : texte gauche, image centre, note droite ── */}
        <div className="grid flex-1 items-center justify-items-center gap-8 pb-8 text-center sm:pb-14 md:grid-cols-[1fr] md:pb-20 lg:grid-cols-[0.9fr_1fr_0.72fr] lg:justify-items-start lg:pb-24 lg:text-left">
          <div className="relative z-[12] w-full max-w-[22rem] sm:max-w-md md:w-full md:max-w-lg lg:max-w-md">

            {/* Badge mobile */}
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#ffffff]/10 bg-[#000000]/55 px-3 py-1.5 backdrop-blur-xl md:hidden">
              <Sparkles className="size-3.5 text-[#ffa51f]" />
              <span className="text-xs text-[#ffffff]/80">Génération automatique de certificats PDF</span>
            </div>

            {/* Statut disponible */}
            <div className="mb-6 hidden md:inline-flex items-center gap-2 lg:items-center">
              <span className="relative flex size-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#ffa51f] opacity-75" />
                <span className="relative inline-flex rounded-full size-2 bg-[#ffa51f]" />
              </span>
              <span className="text-sm text-[#ffffff]/60 tracking-wide">Disponible maintenant</span>
            </div>

            {/* Headline */}
            <h1 className="font-display text-[3.35rem] font-light tracking-[-0.06em] text-[#ffffff] drop-shadow-[0_4px_24px_rgba(0,0,0,0.95)] sm:text-6xl md:text-6xl lg:text-7xl xl:text-[5rem] leading-[0.95]">
              <span className="block">Générez</span>
              <span className="block">vos</span>
              <span className="block">certificats</span>
              <span className="block bg-gradient-to-r from-[#ffa51f] via-[#ffd08a] to-[#ffa51f] bg-clip-text text-transparent md:hidden">
                en masse
              </span>
            </h1>

            <div className="mt-7 flex justify-center md:hidden">
              <Link href="/login">
                <LiquidCtaButton>Accéder à l'outil</LiquidCtaButton>
              </Link>
            </div>

          </div>

          <div className="hidden lg:block" />

          <div className="relative z-[12] hidden max-w-sm justify-center self-end rounded-3xl border border-[#ffffff]/10 bg-[#000000]/42 p-5 backdrop-blur-md md:block md:max-w-md md:self-center md:justify-self-center lg:col-span-1 lg:max-w-xs lg:justify-self-end lg:border-0 lg:bg-transparent lg:p-0 lg:text-left lg:backdrop-blur-none">
            <p className="mb-5 hidden text-sm leading-relaxed text-[#ffffff]/68 md:block">
              Créez des certificats PDF personnalisés à partir d'un modèle et d'une liste de noms. Rapide, élégant et fiable pour les formations, ONG, écoles et séminaires.
            </p>
            <Link href="/login">
              <LiquidCtaButton>Accéder à l'outil</LiquidCtaButton>
            </Link>
          </div>
        </div>

        <div className="pointer-events-none relative z-[6] -mt-10 flex justify-center md:hidden">
          <img
            src="/hero-certificate-holder.png"
            alt=""
            className="h-[34vh] min-h-[250px] w-auto object-contain object-bottom opacity-75 mix-blend-luminosity"
          />
        </div>

        {/* ── Titre massif en bas — signature visuelle ── */}
        <div
          className="
            relative z-[2] pointer-events-none md:z-[8]
            -mx-5 px-2 sm:-mx-6
            overflow-hidden
            flex justify-center
          "
          style={{ marginBottom: "-0.13em" }}
        >
          <p
            className="
              font-display font-black tracking-[-0.07em] leading-none
              text-[#ffffff]
              text-[21vw] sm:text-[22vw] md:text-[19vw] lg:text-[18.6vw]
              select-none whitespace-nowrap
              text-center
            "
          >
            AfroCertify
          </p>
        </div>
      </div>



    </section>
  )
}