"use client"

import Link from "next/link"
import { Mail, Phone, MapPin } from "lucide-react"

const footerLinks = {
  product: [
    { label: "Fonctionnalités", href: "/#features" },
    { label: "Cas d'usage", href: "/#use-cases" },
    { label: "Tarifs", href: "/pricing" },
    { label: "FAQ", href: "/#faq" }
  ],
  company: [
    { label: "Contact", href: "/contact" },
    { label: "Centre d'aide", href: "/help" },
    { label: "Connexion", href: "/login" },
    { label: "Créer un compte", href: "/register" }
  ],
  legal: [
    { label: "Conditions d'utilisation", href: "/terms" },
    { label: "Politique de confidentialité", href: "/privacy" },
    { label: "Mentions légales", href: "/legal" },
    { label: "Cookies", href: "/cookies" }
  ]
}

export function FooterSectionNew() {
  return (
    <footer className="border-t border-[#E5E7EB] bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer */}
        <div className="grid gap-12 py-16 md:grid-cols-2 lg:grid-cols-5">
          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="mb-6 flex items-center gap-3">
              <img src="/logo/icone_orange.png" alt="PROUV" className="h-10 w-10" />
              <span className="font-heading text-2xl font-bold text-[#1E1E1E]">PROUV</span>
            </div>
            <p className="mb-6 max-w-sm text-[#6B7280]">
              La plateforme moderne pour créer et distribuer vos certificats PDF en quelques clics.
            </p>
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-sm text-[#6B7280]">
                <Mail className="h-4 w-4 text-[#D68C2D]" />
                contact@prouv.com
              </div>
              <div className="flex items-center gap-3 text-sm text-[#6B7280]">
                <Phone className="h-4 w-4 text-[#D68C2D]" />
                +225 XX XX XX XX
              </div>
              <div className="flex items-center gap-3 text-sm text-[#6B7280]">
                <MapPin className="h-4 w-4 text-[#D68C2D]" />
                Abidjan, Côte d'Ivoire
              </div>
            </div>
          </div>

          {/* Product */}
          <div>
            <h3 className="mb-4 font-heading text-sm font-semibold uppercase tracking-wider text-[#1E1E1E]">
              Produit
            </h3>
            <ul className="space-y-3">
              {footerLinks.product.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-[#6B7280] transition-colors hover:text-[#D68C2D]"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="mb-4 font-heading text-sm font-semibold uppercase tracking-wider text-[#1E1E1E]">
              Entreprise
            </h3>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-[#6B7280] transition-colors hover:text-[#D68C2D]"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="mb-4 font-heading text-sm font-semibold uppercase tracking-wider text-[#1E1E1E]">
              Légal
            </h3>
            <ul className="space-y-3">
              {footerLinks.legal.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-[#6B7280] transition-colors hover:text-[#D68C2D]"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col items-center justify-between gap-4 border-t border-[#E5E7EB] py-8 md:flex-row">
          <p className="text-sm text-[#6B7280]">
            © {new Date().getFullYear()} PROUV. Tous droits réservés.
          </p>
          <div className="flex gap-6">
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#6B7280] transition-colors hover:text-[#D68C2D]"
            >
              <span className="sr-only">Twitter</span>
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
              </svg>
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#6B7280] transition-colors hover:text-[#D68C2D]"
            >
              <span className="sr-only">LinkedIn</span>
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
