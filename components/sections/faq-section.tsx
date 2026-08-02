"use client"

import { useState } from "react"
import { ChevronDown, ChevronUp } from "lucide-react"

const faqs = [
  {
    question: "Comment créer un certificat ?",
    answer: "Connectez-vous à votre compte, cliquez sur « Générer mon certificat », puis suivez les étapes : 1) Importez votre modèle PDF ou image, 2) Positionnez vos champs avec l'éditeur drag-and-drop, 3) Importez vos participants depuis Excel/CSV, 4) Générez et téléchargez vos certificats.",
  },
  {
    question: "Comment vérifier l'authenticité d'un certificat ?",
    answer: "Chaque certificat généré par PROUV dispose d'un QR code unique et d'un identifiant. N'importe qui peut scanner le QR code ou saisir l'ID sur notre page de vérification publique pour confirmer l'authenticité du certificat en temps réel.",
  },
  {
    question: "Puis-je envoyer des certificats en masse ?",
    answer: "Oui. Importez votre liste de participants depuis Excel ou CSV, configurez votre modèle une seule fois, et générez des centaines de certificats en un clic. L'envoi automatique par email est également disponible.",
  },
  {
    question: "Puis-je personnaliser ma marque ?",
    answer: "Absolument. L'éditeur visuel vous permet d'importer votre propre modèle PDF ou image, de personnaliser les polices, les couleurs, et de positionner chaque élément librement. Votre certificat reflète entièrement votre identité de marque.",
  },
  {
    question: "Quelles intégrations sont disponibles ?",
    answer: "PROUV propose une API REST pour connecter vos outils, des webhooks pour automatiser vos workflows, et des intégrations avec les principaux LMS. Des connecteurs Zapier et Make sont également disponibles pour étendre vos automatisations.",
  },
  {
    question: "Mes données sont-elles sécurisées ?",
    answer: "Toutes vos données sont chiffrées et stockées en toute sécurité. Vous seul avez accès à vos certificats et listes de participants. Nous respectons les standards de sécurité les plus stricts et ne partageons jamais vos données avec des tiers.",
  },
]

export function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  return (
    <section id="faq" className="bg-gradient-to-b from-[#FAFAFA] to-white py-20 lg:py-32">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mx-auto max-w-3xl text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#D68C2D]/20 bg-[#D68C2D]/5 px-4 py-2 text-sm font-medium text-[#D68C2D]">
            FAQ
          </div>
          <h2 className="font-heading text-4xl font-bold tracking-tight text-[#1E1E1E] lg:text-5xl">
            Questions fréquentes
          </h2>
          <p className="mt-4 text-lg text-[#6B7280]">
            Tout ce que vous devez savoir avant de commencer.
          </p>
        </div>

        {/* FAQ accordion */}
        <div className="mx-auto mt-12 max-w-3xl space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="overflow-hidden rounded-2xl border border-[#E5E7EB] bg-white shadow-sm"
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="flex w-full items-center justify-between p-6 text-left"
              >
                <span className="font-heading text-lg font-semibold text-[#1E1E1E]">
                  {faq.question}
                </span>
                {openIndex === index ? (
                  <ChevronUp className="h-5 w-5 shrink-0 text-[#D68C2D]" />
                ) : (
                  <ChevronDown className="h-5 w-5 shrink-0 text-[#6B7280]" />
                )}
              </button>
              {openIndex === index && (
                <div className="px-6 pb-6">
                  <p className="text-[#6B7280] leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
