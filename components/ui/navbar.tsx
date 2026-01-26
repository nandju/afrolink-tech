"use client"

import { useState } from "react"
import Link from "next/link"
import { Menu, X } from "lucide-react"

const navLinks = [
  { href: "#features", label: "Fonctionnalités" },
  { href: "#testimonials", label: "Témoignages" },
  { href: "#pricing", label: "Tarification" },
]

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="fixed top-0 left-0 right-0 z-40 p-4">
      <nav className="max-w-5xl mx-auto flex items-center justify-between h-12 px-4 md:px-6 rounded-full bg-[#000000]/70 border border-[#000000]/50 backdrop-blur-md">
        <Link href="/" className="font-display text-lg font-semibold text-[#ffffff]">
          AL Tech
        </Link>
        
        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="px-4 py-1.5 text-sm rounded-full transition-colors text-[#ffffff]/70 hover:text-[#ffffff]"
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/login"
            className="ml-2 px-4 py-1.5 text-sm rounded-full bg-[#ffa51f] text-[#000000] font-medium hover:bg-[#ffa51f]/90 transition-colors"
          >
            Accéder
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="md:hidden p-2 text-[#ffffff]/70 hover:text-[#ffffff] transition-colors"
          aria-label="Toggle menu"
        >
          {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </nav>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden fixed top-20 left-4 right-4 z-50 rounded-2xl bg-[#000000]/95 border border-[#000000]/50 backdrop-blur-md p-6 shadow-xl">
          <div className="flex flex-col gap-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsMenuOpen(false)}
                className="px-4 py-3 text-sm rounded-lg transition-colors text-[#ffffff]/70 hover:text-[#ffffff] hover:bg-[#000000]/50"
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/login"
              onClick={() => setIsMenuOpen(false)}
              className="mt-2 px-4 py-3 text-sm rounded-lg bg-[#ffa51f] text-[#000000] font-medium hover:bg-[#ffa51f]/90 transition-colors text-center"
            >
              Accéder
            </Link>
          </div>
        </div>
      )}
    </header>
  )
}
