"use client"

import { ShieldCheck, Zap, Award, Globe } from "lucide-react"

const stats = [
  { icon: Zap, value: "2.5s", label: "Temps moyen par certificat" },
  { icon: ShieldCheck, value: "100%", label: "Certificats vérifiables" },
  { icon: Award, value: "5 000+", label: "Certificats émis" },
  { icon: Globe, value: "120+", label: "Organisations clientes" },
]

export function ReassuranceStrip() {
  return (
    <section className="border-y border-[#E5E7EB] bg-white py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-8 lg:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.label} className="flex items-center gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#D68C2D]/10 to-[#12A2AC]/10">
                <stat.icon className="h-6 w-6 text-[#D68C2D]" />
              </div>
              <div>
                <div className="font-heading text-2xl font-bold text-[#1E1E1E]">{stat.value}</div>
                <div className="text-sm text-[#6B7280]">{stat.label}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
