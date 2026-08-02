"use client"

import { GraduationCap, Calendar, Building2, School, Award } from "lucide-react"

const useCases = [
  {
    icon: GraduationCap,
    title: "Formations",
    description: "Certifiez vos apprenants à la fin de chaque parcours de formation. Importez votre liste, générez et envoyez en un clic.",
    color: "from-[#D68C2D] to-[#D68C2D]/80",
  },
  {
    icon: Calendar,
    title: "Événements",
    description: "Délivrez des certificats de participation à vos séminaires, conférences et ateliers en masse.",
    color: "from-[#12A2AC] to-[#12A2AC]/80",
  },
  {
    icon: Building2,
    title: "Entreprises",
    description: "Certifiez vos employés pour leurs formations internes, onboarding et montées en compétences.",
    color: "from-[#10B981] to-[#10B981]/80",
  },
  {
    icon: School,
    title: "Universités & Écoles",
    description: "Émettez des diplômes et certificats de réussite vérifiables publiquement pour vos étudiants.",
    color: "from-[#8B5CF6] to-[#8B5CF6]/80",
  },
  {
    icon: Award,
    title: "Associations & Organismes",
    description: "Certification de compétences, badges et attestations pour vos membres et certifiés.",
    color: "from-[#F59E0B] to-[#F59E0B]/80",
  },
]

export function UseCasesSection() {
  return (
    <section id="use-cases" className="bg-white py-20 lg:py-32">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mx-auto max-w-3xl text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#D68C2D]/20 bg-[#D68C2D]/5 px-4 py-2 text-sm font-medium text-[#D68C2D]">
            Cas d'usage
          </div>
          <h2 className="font-heading text-4xl font-bold tracking-tight text-[#1E1E1E] lg:text-5xl">
            Pour tous les secteurs
          </h2>
          <p className="mt-4 text-lg text-[#6B7280]">
            Que vous soyez formateur, école, entreprise ou organisme de certification, PROUV s'adapte à vos besoins.
          </p>
        </div>

        {/* Use cases grid */}
        <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {useCases.map((useCase) => (
            <div
              key={useCase.title}
              className="group relative overflow-hidden rounded-2xl border border-[#E5E7EB] bg-white p-8 transition-all hover:border-[#D68C2D]/30 hover:shadow-lg"
            >
              <div className={`mb-6 inline-flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br ${useCase.color} shadow-lg`}>
                <useCase.icon className="h-7 w-7 text-white" />
              </div>
              <h3 className="mb-3 font-heading text-xl font-semibold text-[#1E1E1E]">
                {useCase.title}
              </h3>
              <p className="text-[#6B7280]">
                {useCase.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
