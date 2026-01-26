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
      <nav className="max-w-5xl mx-auto flex items-center justify-between h-12 px-4 md:px-6 rounded-full bg-zinc-900/70 border border-zinc-800/50 backdrop-blur-md">
        <Link href="/" className="font-display text-lg font-semibold text-zinc-100">
          AL Tech
        </Link>
        
        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="px-4 py-1.5 text-sm rounded-full transition-colors text-zinc-400 hover:text-zinc-100"
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/login"
            className="ml-2 px-4 py-1.5 text-sm rounded-full bg-zinc-100 text-zinc-900 font-medium hover:bg-zinc-200 transition-colors"
          >
            Accéder
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="md:hidden p-2 text-zinc-400 hover:text-zinc-100 transition-colors"
          aria-label="Toggle menu"
        >
          {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </nav>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden fixed top-20 left-4 right-4 z-50 rounded-2xl bg-zinc-900/95 border border-zinc-800/50 backdrop-blur-md p-6 shadow-xl">
          <div className="flex flex-col gap-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsMenuOpen(false)}
                className="px-4 py-3 text-sm rounded-lg transition-colors text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/50"
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/login"
              onClick={() => setIsMenuOpen(false)}
              className="mt-2 px-4 py-3 text-sm rounded-lg bg-zinc-100 text-zinc-900 font-medium hover:bg-zinc-200 transition-colors text-center"
            >
              Accéder
            </Link>
          </div>
        </div>
      )}
    </header>
  )
}
