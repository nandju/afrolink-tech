"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowRight, FileText, Menu, Sparkles, X } from "lucide-react"

const navLinks = [
  { href: "#features", label: "Fonctionnalités" },
  { href: "#workflow", label: "Workflow" },
  { href: "#testimonials", label: "Témoignages" },
  // { href: "#pricing", label: "Tarification" },
]

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="fixed left-0 right-0 top-0 z-50 px-4 pt-5">
      <nav className="relative mx-auto flex max-w-7xl items-start justify-between">
        <div className="relative">
          <button
            type="button"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-expanded={isMenuOpen}
            aria-controls="afrocertify-menu"
            className="group inline-flex items-center gap-3 rounded-full border border-[#ffffff]/10 bg-[#121212]/75 px-4 py-3 shadow-[0_18px_50px_rgba(0,0,0,0.35)] backdrop-blur-xl transition-all duration-300 hover:border-[#ffa51f]/30 hover:bg-[#ffffff]/10"
          >
            <div className="flex size-5 items-center justify-center rounded-full bg-[#ffa51f]/20">
              <FileText className="size-3.5 text-[#ffa51f]" />
            </div>
            <span className="text-sm font-semibold text-[#ffffff]">AfroCertify</span>
            {isMenuOpen ? (
              <X className="size-4 text-[#ffffff]/70 transition-transform duration-300 group-hover:rotate-90" />
            ) : (
              <Menu className="size-4 text-[#ffffff]/70 transition-transform duration-300 group-hover:scale-110" />
            )}
          </button>

          {isMenuOpen && (
            <div
              id="afrocertify-menu"
              className="absolute left-0 top-[calc(100%+0.75rem)] w-72 overflow-hidden rounded-3xl border border-[#ffffff]/10 bg-[#070707]/92 p-2 shadow-[0_24px_80px_rgba(0,0,0,0.6)] backdrop-blur-2xl"
            >
              <div className="absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-[#ffa51f]/70 to-transparent" />
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsMenuOpen(false)}
                  className="group flex items-center justify-between rounded-2xl px-4 py-3 text-sm text-[#ffffff]/72 transition-all duration-300 hover:bg-[#ffffff]/8 hover:text-[#ffffff]"
                >
                  <span>{link.label}</span>
                  <ArrowRight className="size-4 text-[#ffa51f] opacity-0 transition-all duration-300 group-hover:translate-x-1 group-hover:opacity-100" />
                </Link>
              ))}
              <div className="my-2 h-px bg-[#ffffff]/10" />
              <Link
                href="/login"
                onClick={() => setIsMenuOpen(false)}
                className="flex items-center justify-center rounded-2xl bg-[#ffa51f] px-4 py-3 text-sm font-semibold text-[#000000] transition-transform duration-300 hover:scale-[1.02]"
              >
                Accéder à l'outil
              </Link>
            </div>
          )}
        </div>

        <div className="hidden items-center gap-2 rounded-full border border-[#ffffff]/10 bg-[#000000]/55 px-4 py-2 shadow-[0_18px_50px_rgba(0,0,0,0.25)] backdrop-blur-xl md:inline-flex">
          <Sparkles className="size-4 text-[#ffa51f]" />
          <span className="text-sm text-[#ffffff]/80">Génération automatique de certificats PDF</span>
        </div>
      </nav>
    </header>
  )
}
