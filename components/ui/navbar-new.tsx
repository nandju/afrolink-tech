"use client"

import { useState } from "react"
import Link from "next/link"
import { Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"

const navLinks = [
  { href: "/#features", label: "Produit" },
  { href: "/#use-cases", label: "Solutions" },
  { href: "/pricing", label: "Tarifs" },
  { href: "/#faq", label: "Ressources" },
  { href: "/contact", label: "Contact" },
]

export function NavbarNew() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 border-b border-[#E5E7EB] bg-white/80 backdrop-blur-xl">
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3">
            <img src="/logo/icone_orange.png" alt="PROUV" className="h-8 w-8" />
            <span className="font-heading text-xl font-bold text-[#1E1E1E]">PROUV</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden items-center gap-8 lg:flex">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-[#6B7280] transition-colors hover:text-[#D68C2D]"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Desktop CTAs */}
          <div className="hidden items-center gap-4 lg:flex">
            <Link href="/login">
              <Button
                variant="ghost"
                className="text-sm font-medium text-[#6B7280] hover:text-[#D68C2D]"
              >
                Connexion
              </Button>
            </Link>
            <Link href="/register">
              <Button className="rounded-xl bg-[#D68C2D] text-sm font-semibold text-white shadow-sm hover:bg-[#D68C2D]/90">
                Essayer gratuitement
              </Button>
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="rounded-lg p-2 text-[#6B7280] hover:bg-[#FAFAFA] lg:hidden"
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="border-t border-[#E5E7EB] py-4 lg:hidden">
            <div className="space-y-4">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsMenuOpen(false)}
                  className="block text-sm font-medium text-[#6B7280] hover:text-[#D68C2D]"
                >
                  {link.label}
                </Link>
              ))}
              <div className="space-y-2 border-t border-[#E5E7EB] pt-4">
                <Link href="/login" className="block">
                  <Button
                    variant="outline"
                    className="w-full rounded-xl border-[#E5E7EB]"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Connexion
                  </Button>
                </Link>
                <Link href="/register" className="block">
                  <Button
                    className="w-full rounded-xl bg-[#D68C2D] text-white hover:bg-[#D68C2D]/90"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Essayer gratuitement
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  )
}
