"use client"

import { motion } from "framer-motion"
import { CheckCircle2, FileText, Mail, Send, Table2 } from "lucide-react"

const workflowSteps = [
  {
    label: "Start",
    title: "Import PDF",
    description: "Ajoutez votre modèle de certificat.",
    icon: FileText,
  },
  {
    label: "Data",
    title: "Ajouter les données",
    description: "Importez participants, champs et emails.",
    icon: Table2,
  },
  {
    label: "Action",
    title: "Générer",
    description: "Créez tous les certificats PDF.",
    icon: CheckCircle2,
  },
  {
    label: "Send",
    title: "Envoyer",
    description: "Transférez chaque certificat avec un message personnalisé.",
    icon: Mail,
  },
]

export function WorkflowSection() {
  return (
    <section id="workflow" className="relative overflow-hidden px-6 py-24">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_18%,rgba(255,165,31,0.12),transparent_34%)]" />

      <div className="relative mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative overflow-hidden rounded-[2rem] border border-[#ffffff]/10 bg-[#050505]/85 px-6 py-12 shadow-[0_30px_120px_rgba(0,0,0,0.55)] backdrop-blur-xl sm:px-10 md:px-14 lg:px-20"
        >
          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.05),transparent_32%),radial-gradient(circle_at_72%_72%,rgba(255,165,31,0.12),transparent_34%)]" />
          <div className="pointer-events-none absolute inset-x-10 top-0 h-px bg-gradient-to-r from-transparent via-[#ffa51f]/60 to-transparent" />

          <div className="relative z-10 max-w-2xl">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#ffa51f]/20 bg-[#ffa51f]/10 px-3 py-1.5">
              <span className="size-2 rounded-full bg-[#ffa51f] shadow-[0_0_18px_rgba(255,165,31,0.8)]" />
              <p className="text-xs font-semibold uppercase tracking-wider text-[#ffffff]/80">Workflow</p>
            </div>

            <h2 className="font-display text-4xl font-bold tracking-[-0.055em] text-[#ffffff] md:text-5xl lg:text-6xl">
              Votre processus, toujours en mouvement.
            </h2>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-[#ffffff]/68 md:text-lg">
              Importez votre modèle, ajoutez vos données, générez vos certificats et envoyez-les automatiquement aux participants avec des messages personnalisés.
            </p>
          </div>

          <div className="relative z-10 mt-14 min-h-[410px] overflow-hidden rounded-[1.5rem] border border-[#ffffff]/8 bg-[#000000]/50 p-5 sm:p-8">
            <div className="absolute inset-0 opacity-35 blur-[2px]">
              <div className="h-full w-full bg-[linear-gradient(90deg,rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(180deg,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[size:52px_52px]" />
            </div>
            <div className="absolute left-8 top-8 hidden w-52 space-y-3 opacity-25 md:block">
              {[1, 2, 3, 4].map((item) => (
                <div key={item} className="h-8 rounded-lg border border-[#ffffff]/10 bg-[#ffffff]/5" />
              ))}
            </div>

            <svg
              className="pointer-events-none absolute inset-0 hidden h-full w-full md:block"
              viewBox="0 0 980 420"
              fill="none"
              preserveAspectRatio="none"
            >
              <motion.path
                d="M210 230 C345 230 290 100 455 100 L610 100 C765 100 725 230 850 230"
                stroke="url(#workflowGradientOne)"
                strokeWidth="5"
                strokeLinecap="round"
                initial={{ pathLength: 0, opacity: 0 }}
                whileInView={{ pathLength: 1, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1.4, delay: 0.25, ease: "easeOut" }}
              />
              <motion.path
                d="M210 230 C345 230 290 330 455 330 L530 330 L530 230"
                stroke="url(#workflowGradientTwo)"
                strokeWidth="5"
                strokeLinecap="round"
                initial={{ pathLength: 0, opacity: 0 }}
                whileInView={{ pathLength: 1, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1.4, delay: 0.45, ease: "easeOut" }}
              />
              <motion.path
                d="M610 230 C730 230 720 230 850 230"
                stroke="url(#workflowGradientThree)"
                strokeWidth="5"
                strokeLinecap="round"
                initial={{ pathLength: 0, opacity: 0 }}
                whileInView={{ pathLength: 1, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1.1, delay: 0.65, ease: "easeOut" }}
              />
              <defs>
                <linearGradient id="workflowGradientOne" x1="210" y1="230" x2="850" y2="100">
                  <stop stopColor="#ffa51f" />
                  <stop offset="0.55" stopColor="#60a5fa" />
                  <stop offset="1" stopColor="#ffa51f" />
                </linearGradient>
                <linearGradient id="workflowGradientTwo" x1="210" y1="230" x2="530" y2="330">
                  <stop stopColor="#ffa51f" />
                  <stop offset="1" stopColor="#60a5fa" />
                </linearGradient>
                <linearGradient id="workflowGradientThree" x1="610" y1="230" x2="850" y2="230">
                  <stop stopColor="#60a5fa" />
                  <stop offset="1" stopColor="#ffa51f" />
                </linearGradient>
              </defs>
            </svg>

            <div className="relative z-10 grid min-h-[350px] grid-cols-1 gap-4 md:block">
              {workflowSteps.map((step, index) => {
                const Icon = step.icon
                const positions = [
                  "md:absolute md:left-[4%] md:top-[43%]",
                  "md:absolute md:left-[46%] md:top-[8%]",
                  "md:absolute md:left-[34%] md:top-[48%]",
                  "md:absolute md:right-[4%] md:top-[43%]",
                ]

                return (
                  <motion.div
                    key={step.title}
                    initial={{ opacity: 0, y: 18, scale: 0.96 }}
                    whileInView={{ opacity: 1, y: 0, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.45, delay: 0.35 + index * 0.12 }}
                    whileHover={{ y: -4, scale: 1.02 }}
                    className={`${positions[index]} rounded-2xl border border-[#ffffff]/12 bg-[#090909]/88 p-4 shadow-[0_20px_60px_rgba(0,0,0,0.45)] backdrop-blur-xl md:w-48`}
                  >
                    <div className="mb-3 flex items-center justify-between gap-4">
                      <div className="flex items-center gap-2">
                        <span className="flex size-7 items-center justify-center rounded-full bg-[#ffa51f]/12">
                          <Icon className="size-4 text-[#ffa51f]" />
                        </span>
                        <span className="text-sm font-semibold text-[#ffffff]">{step.label}</span>
                      </div>
                      {index === workflowSteps.length - 1 && <Send className="size-4 text-[#ffa51f]" />}
                    </div>
                    <p className="text-base font-semibold text-[#ffffff]">{step.title}</p>
                    <p className="mt-2 text-xs leading-relaxed text-[#ffffff]/55">{step.description}</p>
                  </motion.div>
                )
              })}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}