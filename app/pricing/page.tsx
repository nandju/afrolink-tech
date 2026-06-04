"use client"

import { Check } from "lucide-react"
import Link from "next/link"
import { NavbarNew } from "@/components/ui/navbar-new"
import { FooterSectionNew } from "@/components/sections/footer-section-new"

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
      "Assistance dédiée",
    ],
    cta: "Obtenir le Pack Grand Événement",
    highlighted: false,
  },
]

const faqs = [
  {
    question: "Comment fonctionnent les crédits ?",
    answer: "Chaque certificat généré utilise 1 crédit. Les crédits sont inclus dans chaque forfait et peuvent être rechargés au besoin."
  },
  {
    question: "Que se passe-t-il quand je n'ai plus de crédits ?",
    answer: "Vous pouvez acheter des crédits supplémentaires à tout moment. Vos certificats et données restent disponibles."
  },
  {
    question: "Puis-je changer de forfait ?",
    answer: "Oui, vous pouvez passer à un forfait supérieur ou inférieur à tout moment depuis votre tableau de bord."
  },
  {
    question: "Mes données sont-elles sécurisées ?",
    answer: "Absolument. Toutes vos données sont chiffrées et stockées en toute sécurité. Vous seul avez accès à vos certificats et listes de participants."
  },
  {
    question: "Comment contacter le support ?",
    answer: "Vous pouvez joindre notre équipe de support à tout moment via le Centre d'aide ou la page Support dans votre espace client."
  },
  {
    question: "Les crédits expirent-ils ?",
    answer: "Non, vos crédits n'expirent jamais. Vous pouvez les utiliser à votre rythme."
  },
  {
    question: "Puis-je obtenir une facture ?",
    answer: "Oui, une facture est automatiquement générée pour chaque achat et disponible dans votre espace client."
  },
  {
    question: "Y a-t-il des frais cachés ?",
    answer: "Non, nos tarifs sont transparents. Vous payez uniquement pour les crédits que vous achetez."
  }
]

export default function PricingPage() {
  return (
    <main className="min-h-screen bg-white">
      <NavbarNew />
      
      <section className="px-6 py-24 pt-32">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-16">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[var(--color-primary)]/20 bg-[var(--color-primary)]/10 px-3 py-1.5">
              <span className="size-2 rounded-full bg-[var(--color-primary)] shadow-[0_0_18px_rgba(214,140,45,0.8)]" />
              <p className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text)]/80">Tarification</p>
            </div>
            <h1 className="font-heading text-5xl md:text-6xl font-bold text-[var(--color-text)] mb-4">
              Choisissez votre forfait
            </h1>
            <p className="text-[var(--color-text)]/70 max-w-2xl mx-auto text-balance text-lg">
              Des forfaits flexibles adaptés à vos besoins. Commencez gratuitement et évoluez à votre rythme.
            </p>
          </div>

          {/* Pricing Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-24">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`p-8 rounded-2xl border flex flex-col h-full glass soft-shadow transition-all duration-300 hover:-translate-y-1 ${
                  plan.highlighted 
                    ? "bg-[var(--color-primary)] border-[var(--color-primary)] scale-105" 
                    : "bg-white/60 border-[var(--color-primary)]/10"
                }`}
              >
                {plan.highlighted && (
                  <div className="mb-4 inline-flex self-start items-center gap-1 rounded-full bg-white/20 px-3 py-1 text-xs font-semibold text-white">
                    ⭐ Recommandé
                  </div>
                )}
                
                {/* Plan Header */}
                <div className="mb-6">
                  <h3
                    className={`font-heading text-2xl font-semibold mb-2 ${
                      plan.highlighted ? "text-white" : "text-[var(--color-text)]"
                    }`}
                  >
                    {plan.name}
                  </h3>
                  <p className={`text-sm ${plan.highlighted ? "text-white/80" : "text-[var(--color-text)]/70"}`}>
                    {plan.description}
                  </p>
                </div>

                {/* Price */}
                <div className="mb-6">
                  <span
                    className={`font-heading text-4xl font-bold ${plan.highlighted ? "text-white" : "text-[var(--color-text)]"}`}
                  >
                    {plan.price}
                  </span>
                  <span className={`text-sm ${plan.highlighted ? "text-white/70" : "text-[var(--color-text)]/70"}`}>
                    {plan.period}
                  </span>
                </div>

                {/* Features */}
                <ul className="space-y-3 mb-8 flex-1">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3">
                      <Check className={`w-5 h-5 shrink-0 ${plan.highlighted ? "text-white" : "text-[var(--color-primary)]"}`} />
                      <span className={`text-sm ${plan.highlighted ? "text-white/90" : "text-[var(--color-text)]/80"}`}>
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                <Link
                  href="/dashboard"
                  className={`block w-full py-3 px-6 text-center rounded-2xl font-heading font-semibold text-sm transition-all mt-auto ${
                    plan.highlighted
                      ? "bg-white text-[var(--color-primary)] hover:bg-white/90"
                      : "bg-[var(--color-primary)] text-white hover:bg-[var(--color-secondary)]"
                  }`}
                >
                  {plan.cta}
                </Link>
              </div>
            ))}
          </div>

          {/* FAQ Section */}
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="font-heading text-4xl font-bold text-[var(--color-text)] mb-4">
                Questions Fréquemment Posées
              </h2>
              <p className="text-[var(--color-text)]/70 text-lg">
                Tout ce que vous devez savoir sur nos forfaits et notre service
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {faqs.map((faq, index) => (
                <div key={index} className="glass soft-shadow rounded-2xl p-6">
                  <h3 className="font-heading text-lg font-semibold text-[var(--color-text)] mb-3">
                    {faq.question}
                  </h3>
                  <p className="text-[var(--color-text)]/80 leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              ))}
            </div>

            {/* CTA Section */}
            <div className="mt-16 text-center glass soft-shadow rounded-2xl p-10">
              <h3 className="font-heading text-2xl font-bold text-[var(--color-text)] mb-4">
                Vous avez encore des questions ?
              </h3>
              <p className="text-[var(--color-text)]/70 mb-6">
                Notre équipe est là pour vous aider. Contactez-nous pour plus d'informations.
              </p>
              <div className="flex gap-4 justify-center flex-wrap">
                <Link href="/help">
                  <button className="px-7 py-3 rounded-2xl font-heading font-semibold text-lg bg-[var(--color-primary)] text-white shadow-lg hover:bg-[var(--color-secondary)] transition-all">
                    Centre d'aide
                  </button>
                </Link>
                <Link href="/contact">
                  <button className="px-7 py-3 rounded-2xl font-heading font-semibold text-lg bg-white text-[var(--color-primary)] border border-[var(--color-primary)] shadow-lg hover:bg-[var(--color-secondary)] hover:text-white transition-all">
                    Nous contacter
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <FooterSectionNew />
    </main>
  )
}
