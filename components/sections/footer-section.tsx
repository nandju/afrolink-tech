import Link from "next/link"

const footerLinks = [
  { label: "Accueil", href: "/" },
  { label: "Tarifs", href: "/#pricing" },
  { label: "Aide", href: "/help" },
  { label: "Contact", href: "/contact" },
  { label: "Connexion", href: "/login" },
  { label: "Inscription", href: "/register" },
]

export function FooterSection() {
  return (
    <footer className="px-6 py-10 border-t border-[#ffffff]/10">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col items-center justify-between gap-6 text-center md:flex-row md:text-left">
          <div>
            <Link href="/" className="flex items-center gap-2 font-heading text-xl font-bold text-[var(--color-primary)]">
              <img src="/logo/icone_orange.png" alt="PROUV Logo" className="h-8 w-8 rounded bg-white p-1 shadow-md" />
              PROUV
            </Link>
            <p className="mt-2 max-w-md text-sm text-[#ffffff]/55">
              Générez, personnalisez et envoyez vos certificats en quelques secondes avec PROUV.
            </p>
          </div>

          <nav className="flex flex-wrap items-center justify-center gap-5">
            {footerLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="text-sm text-[#ffffff]/60 transition-colors hover:text-[#ffa51f]"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        <p className="mt-8 border-t border-[#ffffff]/10 pt-6 text-center text-sm text-[#ffffff]/40">
          © 2026 PROUV. Tous droits réservés.
        </p>
      </div>
    </footer>
  )
}
