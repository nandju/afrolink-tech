"use client"

import { motion } from "motion/react"
import { TestimonialsColumn } from "@/components/ui/testimonials-column"

const testimonials = [
  {
    text: "This platform completely transformed how we generate certificates. We created 500 certificates in 10 minutes instead of several hours.",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=face",
    name: "Sarah Traoré",
    role: "Directrice de Formation",
  },
  {
    text: "The best investment we've made. The tool is simple, fast, and efficient. Perfect for our training sessions.",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
    name: "Marc Kouassi",
    role: "Responsable ONG",
  },
  {
    text: "Finally, a tool that delivers on its promises. Certificate generation is now effortless.",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
    name: "Émilie Diallo",
    role: "Coordinatrice École",
  },
  {
    text: "Implementation was smooth and fast. The intuitive interface made onboarding effortless for our team.",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
    name: "David Koffi",
    role: "Gestionnaire IT",
  },
  {
    text: "The support team is exceptional, guiding us through setup and providing ongoing assistance.",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face",
    name: "Aïcha Diop",
    role: "Responsable Succès Client",
  },
  {
    text: "The seamless integration improved our operations and efficiency. Highly recommended.",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face",
    name: "James N'Guessan",
    role: "Directeur Séminaires",
  },
  {
    text: "Its robust features and fast support have significantly transformed our workflow.",
    image: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&h=150&fit=crop&crop=face",
    name: "Lisa Koné",
    role: "Chef de Projet",
  },
  {
    text: "The smooth implementation exceeded our expectations. It streamlined our entire business process.",
    image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop&crop=face",
    name: "Michel Bamba",
    role: "Analyste Business",
  },
  {
    text: "Our team's productivity improved dramatically thanks to the user-friendly design and powerful features.",
    image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face",
    name: "Rachel Soro",
    role: "Directrice Marketing",
  },
]

const firstColumn = testimonials.slice(0, 3)
const secondColumn = testimonials.slice(3, 6)
const thirdColumn = testimonials.slice(6, 9)

const logos = ["Formation Pro", "EduTech", "CertifPlus", "FormaCert", "EduLink", "CertiGen"]

export function TestimonialsSection() {
  return (
    <section id="testimonials" className="px-6 py-24 bg-[#000000]/30">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          viewport={{ once: true }}
          className="flex flex-col items-center justify-center max-w-xl mx-auto mb-12"
        >
          <div className="border border-[var(--color-primary)] py-1.5 px-4 rounded-full text-sm text-[var(--color-primary)]/80 bg-white/70 glass">
            Témoignages
          </div>
          <h2 className="font-heading text-4xl md:text-5xl font-bold text-[var(--color-text)] mt-6 text-center tracking-tight">
            Ce que disent nos utilisateurs
          </h2>
          <p className="text-center mt-4 text-[var(--color-text)]/70 text-lg text-balance">
            Découvrez ce que nos clients pensent de PROUV.
          </p>
        </motion.div>

        <div className="flex justify-center gap-6 [mask-image:linear-gradient(to_bottom,transparent,black_25%,black_75%,transparent)] max-h-[740px] overflow-hidden">
          <TestimonialsColumn testimonials={firstColumn} duration={15} />
          <TestimonialsColumn testimonials={secondColumn} className="hidden md:block" duration={19} />
          <TestimonialsColumn testimonials={thirdColumn} className="hidden lg:block" duration={17} />
        </div>

        <div className="mt-16 pt-16 border-t border-[#000000]/50">
          <p className="text-center text-sm text-[#ffffff]/70 mb-8">Recommandé par les leaders du secteur</p>
          <div className="relative overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_20%,black_80%,transparent)]">
            <motion.div
              className="flex gap-12 md:gap-16"
              animate={{
                x: ["0%", "-50%"],
              }}
              transition={{
                x: {
                  duration: 20,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "linear",
                },
              }}
            >
              {/* Duplicate logos for seamless loop */}
              {[...logos, ...logos].map((logo, index) => (
                <span
                  key={`${logo}-${index}`}
                  className="text-xl font-semibold text-[#ffffff]/30 whitespace-nowrap flex-shrink-0"
                >
                  {logo}
                </span>
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}
