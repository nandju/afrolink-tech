"use client"

import { motion } from "framer-motion"
import { ArrowRight, CheckCircle2, FileSpreadsheet, Mail, MousePointer2, Upload } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

const features = [
  {
    title: "Modèle PDF",
    description: "Téléversez votre certificat PDF vierge et préparez-le comme base professionnelle pour toutes vos générations.",
    icon: Upload,
    items: ["Import PDF sécurisé", "Aperçu instantané", "Conservation du design", "Prêt pour l'export"],
  },
  {
    title: "Import Excel/CSV",
    description: "Importez vos listes de participants depuis Excel ou CSV et associez automatiquement chaque donnée aux bons champs.",
    icon: FileSpreadsheet,
    items: ["Colonnes détectées", "Noms en masse", "Champs multiples", "Traitement rapide"],
  },
  {
    title: "Positionnement précis",
    description: "Placez chaque texte exactement au bon endroit sur votre certificat avec un rendu fidèle et personnalisable.",
    icon: MousePointer2,
    items: ["Placement au pixel", "Styles personnalisés", "Polices adaptées", "Prévisualisation claire"],
  },
  {
    title: "Envoi automatique",
    description: "Envoyez automatiquement les certificats aux différents participants avec des messages personnalisés pour chacun.",
    icon: Mail,
    items: ["Emails personnalisés", "Envoi aux participants", "Messages individuels", "Distribution simplifiée"],
  },
]

export function FeaturesSection() {
  return (
    <section id="features" className="relative overflow-hidden px-6 py-24">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(255,165,31,0.12),transparent_42%)]" />
      <div className="relative mx-auto max-w-7xl">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-14"
        >
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#ffa51f]/20 bg-[#ffa51f]/10 px-3 py-1.5">
            <span className="size-2 rounded-full bg-[#ffa51f] shadow-[0_0_18px_rgba(255,165,31,0.8)]" />
            <p className="text-xs font-semibold uppercase tracking-wider text-[#ffffff]/80">Fonctionnalités</p>
          </div>
          <h2 className="mx-auto mb-4 max-w-3xl font-display text-4xl font-bold tracking-[-0.04em] text-[#ffffff] md:text-5xl">
            Tout pour générer, personnaliser et envoyer vos certificats
          </h2>
          <p className="mx-auto max-w-2xl text-balance text-sm leading-relaxed text-[#ffffff]/65 md:text-base">
            Une plateforme complète pour transformer un modèle PDF et une liste de participants en certificats professionnels prêts à partager.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, index) => {
            const Icon = feature.icon

            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 + index * 0.1 }}
              >
                <Card className="group relative h-full overflow-hidden rounded-2xl border-[#ffffff]/10 bg-[#020202]/70 shadow-[0_20px_80px_rgba(0,0,0,0.35)] transition-all duration-300 hover:-translate-y-1 hover:border-[#ffa51f]/45">
                  <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#ffa51f]/70 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                  <div className="pointer-events-none absolute -right-16 -top-16 size-36 rounded-full bg-[#ffa51f]/10 blur-3xl transition-opacity duration-300 group-hover:opacity-100" />
                  <CardContent className="relative flex h-full flex-col p-6">
                    <motion.div
                      className="mb-8 flex size-12 items-center justify-center rounded-2xl border border-[#ffa51f]/20 bg-[#ffa51f]/10 shadow-[0_0_35px_rgba(255,165,31,0.12)]"
                      whileHover={{ rotate: [0, -8, 8, 0], scale: 1.06 }}
                      transition={{ duration: 0.5 }}
                    >
                      <Icon className="size-6 text-[#ffa51f]" />
                    </motion.div>

                    <h3 className="mb-3 font-display text-xl font-semibold leading-tight text-[#ffffff]">
                      {feature.title}
                    </h3>
                    <p className="mb-6 text-sm leading-relaxed text-[#ffffff]/62">
                      {feature.description}
                    </p>

                    <div className="mt-auto space-y-3">
                      {feature.items.map((item, itemIndex) => (
                        <motion.div
                          key={item}
                          className="flex items-center gap-2 text-xs text-[#ffffff]/68"
                          initial={{ opacity: 0, x: -8 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.35, delay: 0.25 + index * 0.08 + itemIndex * 0.05 }}
                        >
                          <CheckCircle2 className="size-3.5 text-[#ffa51f]" />
                          <span>{item}</span>
                        </motion.div>
                      ))}
                    </div>

                    <motion.div
                      whileHover={{ x: 6 }}
                      className="mt-7 inline-flex items-center gap-1.5 text-sm font-medium text-[#ffffff]/60 transition-colors group-hover:text-[#ffa51f]"
                    >
                      En savoir plus <ArrowRight className="size-4" />
                    </motion.div>
                  </CardContent>
                </Card>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
