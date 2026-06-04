"use client"

import { Star } from "lucide-react"

const testimonials = [
  {
    name: "Marie Dubois",
    role: "Responsable Formation",
    company: "TechCorp",
    content: "PROUV nous a fait gagner un temps considérable. Ce qui prenait des heures se fait maintenant en quelques minutes.",
    rating: 5,
    avatar: "MD"
  },
  {
    name: "Jean Martin",
    role: "Directeur RH",
    company: "InnovateCo",
    content: "Interface intuitive et résultats professionnels. Exactement ce que nous cherchions pour nos formations.",
    rating: 5,
    avatar: "JM"
  },
  {
    name: "Sophie Laurent",
    role: "Chef de Projet",
    company: "EduPlus",
    content: "L'import Excel et l'envoi automatique par email sont des fonctionnalités indispensables. Très satisfaits !",
    rating: 5,
    avatar: "SL"
  }
]

export function TestimonialsSectionNew() {
  return (
    <section className="bg-white py-20 lg:py-32">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mx-auto max-w-3xl text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#10B981]/20 bg-[#10B981]/5 px-4 py-2 text-sm font-medium text-[#10B981]">
            Témoignages
          </div>
          <h2 className="font-heading text-4xl font-bold tracking-tight text-[#1E1E1E] lg:text-5xl">
            Ils nous font confiance
          </h2>
          <p className="mt-4 text-lg text-[#6B7280]">
            Découvrez ce que nos clients disent de PROUV.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.name}
              className="group relative overflow-hidden rounded-2xl border border-[#E5E7EB] bg-white p-8 transition-all hover:border-[#D68C2D]/30 hover:shadow-xl"
            >
              {/* Stars */}
              <div className="mb-6 flex gap-1">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 fill-[#F59E0B] text-[#F59E0B]" />
                ))}
              </div>

              {/* Content */}
              <p className="mb-6 text-[#1E1E1E]">
                "{testimonial.content}"
              </p>

              {/* Author */}
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-[#D68C2D] to-[#12A2AC] font-heading text-sm font-bold text-white">
                  {testimonial.avatar}
                </div>
                <div>
                  <div className="font-semibold text-[#1E1E1E]">{testimonial.name}</div>
                  <div className="text-sm text-[#6B7280]">
                    {testimonial.role} • {testimonial.company}
                  </div>
                </div>
              </div>

              {/* Decorative gradient */}
              <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-gradient-to-br from-[#D68C2D]/10 to-[#12A2AC]/10 opacity-0 blur-2xl transition-opacity group-hover:opacity-100" />
            </div>
          ))}
        </div>

        {/* Stats */}
        <div className="mt-20 grid gap-8 rounded-3xl border border-[#E5E7EB] bg-gradient-to-br from-[#FAFAFA] to-white p-12 md:grid-cols-3">
          <div className="text-center">
            <div className="font-heading text-5xl font-bold text-[#D68C2D]">4.9/5</div>
            <div className="mt-2 text-[#6B7280]">Note moyenne</div>
          </div>
          <div className="text-center">
            <div className="font-heading text-5xl font-bold text-[#12A2AC]">98%</div>
            <div className="mt-2 text-[#6B7280]">Clients satisfaits</div>
          </div>
          <div className="text-center">
            <div className="font-heading text-5xl font-bold text-[#10B981]">120+</div>
            <div className="mt-2 text-[#6B7280]">Organisations</div>
          </div>
        </div>
      </div>
    </section>
  )
}
