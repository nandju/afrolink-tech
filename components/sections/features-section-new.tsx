"use client"

import { PlaceholderImage } from "@/components/ui/placeholder-image"
import { Upload, Settings, Users, Mail, Download, Zap } from "lucide-react"

const features = [
  {
    icon: Upload,
    title: "Import PDF simple",
    description: "Téléversez votre modèle de certificat PDF en un clic. Support de tous les formats standards.",
    color: "from-[#D68C2D] to-[#D68C2D]/80"
  },
  {
    icon: Settings,
    title: "Configuration intuitive",
    description: "Positionnez vos champs de texte avec précision. Interface drag-and-drop ultra-simple.",
    color: "from-[#12A2AC] to-[#12A2AC]/80"
  },
  {
    icon: Users,
    title: "Import Excel/CSV",
    description: "Importez vos listes de participants depuis Excel ou CSV. Détection automatique des colonnes.",
    color: "from-[#10B981] to-[#10B981]/80"
  },
  {
    icon: Mail,
    title: "Envoi automatique",
    description: "Envoyez les certificats par email automatiquement. Personnalisez vos messages.",
    color: "from-[#F59E0B] to-[#F59E0B]/80"
  },
  {
    icon: Download,
    title: "Export ZIP",
    description: "Téléchargez tous vos certificats dans une archive ZIP. Organisation automatique par nom.",
    color: "from-[#8B5CF6] to-[#8B5CF6]/80"
  },
  {
    icon: Zap,
    title: "Génération rapide",
    description: "Générez des centaines de certificats en quelques secondes. Performance optimale garantie.",
    color: "from-[#EF4444] to-[#EF4444]/80"
  }
]

export function FeaturesSectionNew() {
  return (
    <section className="bg-white py-20 lg:py-32">
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
            Une plateforme complète pour créer, personnaliser et distribuer vos certificats en toute simplicité.
          </p>
        </div>

        {/* Features Grid */}
        <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => {
            const Icon = feature.icon
            return (
              <div
                key={feature.title}
                className="group relative overflow-hidden rounded-2xl border border-[#E5E7EB] bg-white p-8 transition-all hover:border-[#D68C2D]/30 hover:shadow-lg"
              >
                <div className="relative z-10">
                  <div className={`mb-6 inline-flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br ${feature.color} shadow-lg`}>
                    <Icon className="h-7 w-7 text-white" />
                  </div>
                  <h3 className="mb-3 font-heading text-xl font-semibold text-[#1E1E1E]">
                    {feature.title}
                  </h3>
                  <p className="text-[#6B7280]">
                    {feature.description}
                  </p>
                </div>
                
                {/* Hover gradient */}
                <div className="absolute inset-0 -z-0 bg-gradient-to-br from-[#D68C2D]/0 to-[#12A2AC]/0 opacity-0 transition-opacity group-hover:opacity-5" />
              </div>
            )
          })}
        </div>

        {/* Feature showcase with image */}
        <div className="mt-24 grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <div className="order-2 lg:order-1">
            <PlaceholderImage
              aspectRatio="landscape"
              text="Feature Showcase"
              className="shadow-2xl"
            />
          </div>
          <div className="order-1 space-y-6 lg:order-2">
            <h3 className="font-heading text-3xl font-bold text-[#1E1E1E] lg:text-4xl">
              Interface moderne et intuitive
            </h3>
            <p className="text-lg text-[#6B7280]">
              Notre interface a été conçue pour être simple et efficace. Pas de courbe d'apprentissage, 
              vous êtes opérationnel en quelques minutes.
            </p>
            <div className="space-y-4">
              {[
                "Prévisualisation en temps réel",
                "Positionnement précis au pixel près",
                "Support de multiples polices",
                "Personnalisation des couleurs"
              ].map((item) => (
                <div key={item} className="flex items-start gap-3">
                  <div className="mt-1 flex h-5 w-5 items-center justify-center rounded-full bg-[#10B981]/10">
                    <div className="h-2 w-2 rounded-full bg-[#10B981]" />
                  </div>
                  <span className="text-[#1E1E1E]">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
