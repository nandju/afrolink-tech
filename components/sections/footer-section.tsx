import Link from "next/link"

const footerLinks = [
  { label: "Fonctionnalités", href: "#features" },
  { label: "Workflow", href: "#workflow" },
  { label: "Accéder à l'outil", href: "/login" },
]

export function FooterSection() {
  return (
    <footer className="px-6 py-10 border-t border-[#ffffff]/10">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col items-center justify-between gap-6 text-center md:flex-row md:text-left">
          <div>
            <Link href="/" className="font-display text-xl font-semibold text-[#ffffff]">
              AfroCertify
            </Link>
            <p className="mt-2 max-w-md text-sm text-[#ffffff]/55">
              Générez, personnalisez et envoyez vos certificats en masse avec AL Tech.
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
          © {new Date().getFullYear()} AL Tech. Tous droits réservés.
        </p>
      </div>
    </footer>
  )
}
