"use client"

import {
  MousePointer2,
  Users,
  ShieldCheck,
  Wallet,
  TrendingUp,
  Code,
} from "lucide-react"

const features = [
  {
    icon: MousePointer2,
    title: "Création de certificats",
    description: "Éditeur visuel drag-and-drop. Importez votre modèle PDF ou image, positionnez vos champs, personnalisez polices et couleurs.",
    color: "from-[#D68C2D] to-[#D68C2D]/80"
  },
  {
    icon: Users,
    title: "Émission en masse",
    description: "Importez vos participants depuis Excel/CSV. Générez des centaines de certificats en un clic avec détection automatique des colonnes.",
    color: "from-[#12A2AC] to-[#12A2AC]/80"
  },
  {
    icon: ShieldCheck,
    title: "Vérification publique",
    description: "Chaque certificat dispose d'un QR code unique et d'une page de vérification publique. Lutte contre la contrefaçon.",
    color: "from-[#10B981] to-[#10B981]/80"
  },
  {
    icon: Wallet,
    title: "Espace bénéficiaire",
    description: "Vos destinataires accèdent à leur wallet personnel pour consulter, télécharger et partager leurs certificats vérifiés.",
    color: "from-[#8B5CF6] to-[#8B5CF6]/80"
  },
  {
    icon: TrendingUp,
    title: "Analytique & suivi",
    description: "Suivez les certificats émis, les vérifications, les téléchargements. Tableau de bord avec statistiques en temps réel.",
    color: "from-[#F59E0B] to-[#F59E0B]/80"
  },
  {
    icon: Code,
    title: "Intégrations & API",
    description: "Connectez PROUV à vos outils via notre API REST. Webhooks, intégrations LMS, automatisations Zapier et plus encore.",
    color: "from-[#EF4444] to-[#EF4444]/80"
  },
]

export function FeaturesSectionNew() {
  return (
    <section id="features" className="bg-white py-20 lg:py-32">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mx-auto max-w-3xl text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#D68C2D]/20 bg-[#D68C2D]/5 px-4 py-2 text-sm font-medium text-[#D68C2D]">
            Fonctionnalités
          </div>
          <h2 className="font-heading text-4xl font-bold tracking-tight text-[#1E1E1E] lg:text-5xl">
            Tout ce dont vous avez besoin
          </h2>
          <p className="mt-4 text-lg text-[#6B7280]">
            Une plateforme complète pour créer, émettre, vérifier et suivre vos certificats en toute simplicité.
          </p>
        </div>

        {/* Features Grid */}
        <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="group relative overflow-hidden rounded-2xl border border-[#E5E7EB] bg-white p-8 transition-all hover:border-[#D68C2D]/30 hover:shadow-lg"
            >
              <div className="relative z-10">
                <div className={`mb-6 inline-flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br ${feature.color} shadow-lg`}>
                  <feature.icon className="h-7 w-7 text-white" />
                </div>
                <h3 className="mb-3 font-heading text-xl font-semibold text-[#1E1E1E]">
                  {feature.title}
                </h3>
                <p className="text-[#6B7280]">
                  {feature.description}
                </p>
              </div>
              <div className="absolute inset-0 -z-0 bg-gradient-to-br from-[#D68C2D]/0 to-[#12A2AC]/0 opacity-0 transition-opacity group-hover:opacity-5" />
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}
