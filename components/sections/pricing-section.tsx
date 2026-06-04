import { Check } from "lucide-react"
import Link from "next/link"

const plans = [
  {
    name: "Pack Gratuit",
    description: "20 crédits offerts. 1 crédit = 1 certificat.",
    price: "Gratuit",
    period: "",
    features: [
      "20 certificats inclus",
      "Téléversement PDF",
      "Import Excel/CSV",
      "Saisie manuelle",
      "Personnalisation de base",
      "Téléchargement ZIP",
    ],
    cta: "Générer mon Certificat",
    highlighted: true,
  },
  {
    name: "Pack Formateur",
    description: "100 crédits. 50 FCFA par certificat.",
    price: "5 000 FCFA",
    period: "",
    features: [
      "100 certificats inclus",
      "Toutes les fonctionnalités du Pack Gratuit",
      "Personnalisation avancée",
      "Envoi d'emails",
      "Historique & analytiques",
    ],
    cta: "Obtenir le Pack Formateur",
    highlighted: false,
  },
  {
    name: "Pack Institution",
    description: "500 crédits. 40 FCFA par certificat.",
    price: "20 000 FCFA",
    period: "",
    features: [
      "500 certificats inclus",
      "Toutes les fonctionnalités du Pack Formateur",
      "Support prioritaire",
      "Actions en masse",
    ],
    cta: "Obtenir le Pack Institution",
    highlighted: false,
  },
  {
    name: "Pack Grand Événement",
    description: "2 000 crédits pour 50 000 FCFA.",
    price: "50 000 FCFA",
    period: "",
    features: [
      "2 000 certificats inclus",
      "Toutes les fonctionnalités du Pack Institution",
      "Support événementiel",
    ],
    cta: "Obtenir le Pack Grand Événement",
    highlighted: false,
  },
];

export function PricingSection() {
  return (
    <section id="pricing" className="px-6 py-24">
      <div className="max-w-5xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <p className="text-sm font-medium text-[#ffffff]/70 uppercase tracking-wider mb-4">Tarification</p>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-[#ffffff] mb-4">
            Simple & Transparente
          </h2>
          <p className="text-[#ffffff]/70 max-w-xl mx-auto text-balance text-lg">
            Accès sécurisé pour votre organisation. Parfait pour un usage interne et professionnel.
          </p>
        </div>

        {/* Pricing Grid */}
        <div className="grid md:grid-cols-3 gap-6">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`p-8 rounded-2xl border flex flex-col h-full ${
                plan.highlighted ? "bg-[#ffa51f] border-[#ffa51f]" : "bg-[#000000]/50 border-[#000000]/50"
              }`}
            >
              {/* Plan Header */}
              <div className="mb-6">
                <h3
                  className={`font-heading text-xl font-semibold mb-2 ${
                    plan.highlighted ? "text-[#000000]" : "text-[#ffffff]"
                  }`}
                >
                  {plan.name}
                </h3>
                <p className={`text-sm ${plan.highlighted ? "text-[#000000]/70" : "text-[#ffffff]/70"}`}>{plan.description}</p>
              </div>

              {/* Price */}
              <div className="mb-6">
                <span
                  className={`font-display text-4xl font-bold ${plan.highlighted ? "text-[#000000]" : "text-[#ffffff]"}`}
                >
                  {plan.price}
                </span>
                <span className={`text-sm ${plan.highlighted ? "text-[#000000]/70" : "text-[#ffffff]/70"}`}>{plan.period}</span>
              </div>

              {/* Features */}
              <ul className="space-y-3 mb-8 flex-1">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3">
                    <Check className={`w-5 h-5 shrink-0 ${plan.highlighted ? "text-[#000000]" : "text-[#ffa51f]"}`} />
                    <span className={`text-sm ${plan.highlighted ? "text-[#000000]/80" : "text-[#ffffff]/70"}`}>{feature}</span>
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <Link
                href="#"
                className={`block w-full py-3 px-6 text-center rounded-full font-medium text-sm transition-colors mt-auto ${
                  plan.highlighted
                    ? "bg-[#000000] text-[#ffffff] hover:bg-[#000000]/90"
                    : "bg-[#ffa51f] text-[#000000] hover:bg-[#ffa51f]/90"
                }`}
              >
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>
      </div>
      {/* FAQ Section */}
      <div className="mt-24 max-w-3xl mx-auto glass soft-shadow rounded-2xl p-10">
        <h3 className="font-heading text-2xl font-bold mb-8 text-[var(--color-primary)] text-center">Questions Fréquemment Posées</h3>
        <div className="space-y-7">
          <div>
            <p className="font-semibold text-[var(--color-text)] mb-1">Comment fonctionnent les crédits ?</p>
            <p className="text-[var(--color-text)]/80">Chaque certificat généré utilise 1 crédit. Les crédits sont inclus dans chaque forfait et peuvent être rechargés au besoin.</p>
          </div>
          <div>
            <p className="font-semibold text-[var(--color-text)] mb-1">Que se passe-t-il quand je n'ai plus de crédits ?</p>
            <p className="text-[var(--color-text)]/80">Vous pouvez acheter des crédits supplémentaires à tout moment. Vos certificats et données restent disponibles.</p>
          </div>
          <div>
            <p className="font-semibold text-[var(--color-text)] mb-1">Puis-je changer de forfait ?</p>
            <p className="text-[var(--color-text)]/80">Oui, vous pouvez passer à un forfait supérieur ou inférieur à tout moment depuis votre tableau de bord.</p>
          </div>
          <div>
            <p className="font-semibold text-[var(--color-text)] mb-1">Mes données sont-elles sécurisées ?</p>
            <p className="text-[var(--color-text)]/80">Absolument. Toutes vos données sont chiffrées et stockées en toute sécurité. Vous seul avez accès à vos certificats et listes de participants.</p>
          </div>
          <div>
            <p className="font-semibold text-[var(--color-text)] mb-1">Comment contacter le support ?</p>
            <p className="text-[var(--color-text)]/80">Vous pouvez joindre notre équipe de support à tout moment via le Centre d'aide ou la page Support dans votre espace client.</p>
          </div>
        </div>
      </div>
    </section>
  )
}
