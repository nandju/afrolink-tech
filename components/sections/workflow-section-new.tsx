"use client"

import { PlaceholderImage } from "@/components/ui/placeholder-image"
import { Upload, Settings2, Users, Zap } from "lucide-react"

const steps = [
  {
    number: "01",
    icon: Upload,
    title: "Importez votre PDF",
    description: "Téléversez votre modèle de certificat au format PDF. Compatible avec tous les designs.",
    color: "bg-[#D68C2D]"
  },
  {
    number: "02",
    icon: Settings2,
    title: "Configurez les champs",
    description: "Positionnez vos champs de texte avec précision. Personnalisez les polices et couleurs.",
    color: "bg-[#12A2AC]"
  },
  {
    number: "03",
    icon: Users,
    title: "Ajoutez les participants",
    description: "Importez votre liste depuis Excel/CSV ou ajoutez manuellement vos participants.",
    color: "bg-[#10B981]"
  },
  {
    number: "04",
    icon: Zap,
    title: "Générez en un clic",
    description: "Lancez la génération et téléchargez vos certificats. Envoi automatique par email disponible.",
    color: "bg-[#F59E0B]"
  }
]

export function WorkflowSectionNew() {
  return (
    <section className="bg-gradient-to-b from-[#FAFAFA] to-white py-20 lg:py-32">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mx-auto max-w-3xl text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#12A2AC]/20 bg-[#12A2AC]/5 px-4 py-2 text-sm font-medium text-[#12A2AC]">
            Comment ça marche
          </div>
          <h2 className="font-heading text-4xl font-bold tracking-tight text-[#1E1E1E] lg:text-5xl">
            Simple et rapide
          </h2>
          <p className="mt-4 text-lg text-[#6B7280]">
            Créez vos certificats en 4 étapes simples. Aucune compétence technique requise.
          </p>
        </div>

        {/* Steps */}
        <div className="mt-16 space-y-12">
          {steps.map((step, index) => {
            const Icon = step.icon
            const isEven = index % 2 === 0
            
            return (
              <div
                key={step.number}
                className={`grid items-center gap-12 lg:grid-cols-2 lg:gap-16 ${
                  isEven ? "" : "lg:grid-flow-dense"
                }`}
              >
                {/* Content */}
                <div className={`space-y-6 ${isEven ? "" : "lg:col-start-2"}`}>
                  <div className="flex items-center gap-4">
                    <div className={`flex h-16 w-16 items-center justify-center rounded-2xl ${step.color} shadow-lg`}>
                      <Icon className="h-8 w-8 text-white" />
                    </div>
                    <div className="font-heading text-6xl font-bold text-[#E5E7EB]">
                      {step.number}
                    </div>
                  </div>
                  <h3 className="font-heading text-3xl font-bold text-[#1E1E1E]">
                    {step.title}
                  </h3>
                  <p className="text-lg text-[#6B7280]">
                    {step.description}
                  </p>
                  
                  {/* Progress indicator */}
                  {index < steps.length - 1 && (
                    <div className="flex items-center gap-3 pt-4">
                      <div className="h-1 w-12 rounded-full bg-gradient-to-r from-[#D68C2D] to-[#12A2AC]" />
                      <span className="text-sm font-medium text-[#6B7280]">
                        Étape suivante
                      </span>
                    </div>
                  )}
                </div>

                {/* Image */}
                <div className={isEven ? "" : "lg:col-start-1 lg:row-start-1"}>
                  <PlaceholderImage
                    aspectRatio="landscape"
                    text={`Step ${step.number} Preview`}
                    className="shadow-2xl"
                  />
                </div>
              </div>
            )
          })}
        </div>

        {/* CTA */}
        <div className="mt-20 rounded-3xl border border-[#E5E7EB] bg-gradient-to-br from-white to-[#FAFAFA] p-12 text-center shadow-xl">
          <h3 className="font-heading text-3xl font-bold text-[#1E1E1E]">
            Prêt à générer vos certificats ?
          </h3>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-[#6B7280]">
            Rejoignez les centaines d'organisations qui font confiance à PROUV pour leurs certificats.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <a
              href="/register"
              className="inline-flex h-12 items-center justify-center rounded-xl bg-[#D68C2D] px-8 text-base font-semibold text-white shadow-lg shadow-[#D68C2D]/25 transition-all hover:bg-[#D68C2D]/90 hover:shadow-xl"
            >
              Générer mon Certificat
            </a>
            <a
              href="/contact"
              className="inline-flex h-12 items-center justify-center rounded-xl border-2 border-[#E5E7EB] bg-white px-8 text-base font-semibold text-[#1E1E1E] transition-all hover:border-[#D68C2D]/30 hover:bg-[#D68C2D]/5"
            >
              Nous contacter
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
