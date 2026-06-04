"use client"

import { motion } from "framer-motion"
import { ArrowRight, CheckCircle2, FileSpreadsheet, Mail, MousePointer2, Upload } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

const features = [
  {
    title: "Génération PDF",
    description: "Téléversez votre modèle de certificat vierge et générez des PDFs professionnels instantanément.",
    icon: Upload,
    items: ["Import PDF sécurisé", "Aperçu en temps réel", "Préservation du design", "Prêt à exporter"],
  },
  {
    title: "Import Excel",
    description: "Importez vos listes de participants depuis Excel ou CSV. Mappez les données aux champs automatiquement.",
    icon: FileSpreadsheet,
    items: ["Détection intelligente des colonnes", "Import en masse", "Mappage multi-champs", "Traitement rapide"],
  },
  {
    title: "Envoi d'emails",
    description: "Envoyez automatiquement les certificats à tous les participants avec des messages personnalisés.",
    icon: Mail,
    items: ["Emails personnalisés", "Envoi en masse", "Modèles de messages", "Distribution facile"],
  },
  {
    title: "Historique",
    description: "Accédez à votre historique de génération et d'envoi à tout moment.",
    icon: CheckCircle2,
    items: ["Journal d'activité complet", "Téléchargement ZIP", "Suivi du statut", "Enregistrements détaillés"],
  },
  {
    title: "Gestion des crédits",
    description: "Surveillez et gérez vos crédits pour la génération de certificats.",
    icon: ArrowRight,
    items: ["Solde en temps réel", "Analytiques d'utilisation", "Historique d'achats", "Forfaits flexibles"],
  },
  {
    title: "Personnalisation avancée",
    description: "Ajustez finement les champs, polices et positionnement pour un résultat parfait.",
    icon: MousePointer2,
    items: ["Glisser-déposer les champs", "Options de police et couleur", "Ajustements en direct", "Contrôles pro"],
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
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[var(--color-primary)]/20 bg-[var(--color-primary)]/10 px-3 py-1.5">
            <span className="size-2 rounded-full bg-[var(--color-primary)] shadow-[0_0_18px_rgba(214,140,45,0.8)]" />
            <p className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text)]/80">Fonctionnalités</p>
          </div>
          <h2 className="mx-auto mb-4 max-w-3xl font-heading text-4xl font-bold tracking-[-0.04em] text-[var(--color-text)] md:text-5xl">
            Tout ce dont vous avez besoin pour générer, personnaliser et envoyer vos certificats
          </h2>
          <p className="mx-auto max-w-2xl text-balance text-sm leading-relaxed text-[var(--color-text)]/65 md:text-base">
            Une plateforme complète pour transformer votre modèle PDF et votre liste de participants en certificats professionnels prêts à partager en quelques secondes.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 gap-7 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
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
                <Card className="group relative h-full overflow-hidden rounded-2xl glass soft-shadow border border-[var(--color-primary)]/10 bg-white/60 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-[var(--color-primary)]/45">
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
