"use client"

import { X, Check, Clock, FileText, Mail, TrendingUp } from "lucide-react"

const painPoints = [
  { icon: Clock, text: "Saisie manuelle fastidieuse et répétitive" },
  { icon: FileText, text: "Risques d'erreurs sur les noms et informations" },
  { icon: Mail, text: "Envoi individuel des certificats par email" },
]

const solutions = [
  {
    icon: TrendingUp,
    title: "Gain de temps massif",
    description: "Générez des centaines de certificats en quelques secondes, pas en plusieurs heures.",
    color: "from-[#D68C2D] to-[#D68C2D]/80",
  },
  {
    icon: Check,
    title: "Zéro erreur de saisie",
    description: "Importez vos données depuis Excel/CSV. Chaque certificat est généré automatiquement avec les bonnes informations.",
    color: "from-[#12A2AC] to-[#12A2AC]/80",
  },
  {
    icon: Mail,
    title: "Distribution automatisée",
    description: "Envoyez tous vos certificats par email en un clic. Téléchargez-les aussi en archive ZIP.",
    color: "from-[#10B981] to-[#10B981]/80",
  },
]

export function ProblemSolutionSection() {
  return (
    <section className="bg-gradient-to-b from-[#FAFAFA] to-white py-20 lg:py-32">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Problem */}
        <div className="mx-auto max-w-3xl text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#EF4444]/20 bg-[#EF4444]/5 px-4 py-2 text-sm font-medium text-[#EF4444]">
            Le problème
          </div>
          <h2 className="font-heading text-4xl font-bold tracking-tight text-[#1E1E1E] lg:text-5xl">
            La création manuelle de certificats est un cauchemar
          </h2>
          <p className="mt-4 text-lg text-[#6B7280]">
            Des heures perdues à copier-coller des noms, envoyer des emails un par un, et corriger des erreurs.
          </p>
        </div>

        {/* Pain points */}
        <div className="mx-auto mt-12 max-w-3xl space-y-4">
          {painPoints.map((point) => (
            <div
              key={point.text}
              className="flex items-center gap-4 rounded-2xl border border-[#E5E7EB] bg-white p-5 shadow-sm"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#EF4444]/10">
                <X className="h-5 w-5 text-[#EF4444]" />
              </div>
              <div className="flex items-center gap-3">
                <point.icon className="h-5 w-5 text-[#6B7280]" />
                <span className="text-[#1E1E1E]">{point.text}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Solution */}
        <div className="mx-auto mt-20 max-w-3xl text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#10B981]/20 bg-[#10B981]/5 px-4 py-2 text-sm font-medium text-[#10B981]">
            La solution PROUV
          </div>
          <h2 className="font-heading text-4xl font-bold tracking-tight text-[#1E1E1E] lg:text-5xl">
            Une plateforme tout-en-un
          </h2>
          <p className="mt-4 text-lg text-[#6B7280]">
            PROUV automatise l'intégralité du processus, de la création à la distribution.
          </p>
        </div>

        {/* Solution cards */}
        <div className="mt-12 grid gap-8 md:grid-cols-3">
          {solutions.map((solution) => (
            <div
              key={solution.title}
              className="group relative overflow-hidden rounded-2xl border border-[#E5E7EB] bg-white p-8 transition-all hover:border-[#D68C2D]/30 hover:shadow-lg"
            >
              <div className={`mb-6 inline-flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br ${solution.color} shadow-lg`}>
                <solution.icon className="h-7 w-7 text-white" />
              </div>
              <h3 className="mb-3 font-heading text-xl font-semibold text-[#1E1E1E]">
                {solution.title}
              </h3>
              <p className="text-[#6B7280]">
                {solution.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
