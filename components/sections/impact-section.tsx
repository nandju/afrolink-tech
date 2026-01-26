const metrics = [
  { value: "100+", label: "Organisations", description: "Nous font confiance" },
  { value: "10K+", label: "Certificats générés", description: "Par mois" },
  { value: "<30s", label: "Génération", description: "Ultra rapide" },
  { value: "100%", label: "Automatisé", description: "Sans erreur" },
]

export function ImpactSection() {
  return (
    <section className="px-6 py-24 bg-[#000000]/20">
      <div className="max-w-5xl mx-auto">
        {/* Impact Section Header */}
        <div className="text-center mb-12">
          <p className="text-sm font-medium text-[#ffffff]/70 uppercase tracking-wider mb-4">Notre Impact</p>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-[#ffffff] mb-4">Utilisé par des organisations du monde entier</h2>
          <p className="text-[#ffffff]/70 max-w-lg mx-auto text-balance">
            Des chiffres qui parlent d'eux-mêmes. Découvrez pourquoi des centaines d'organisations nous font confiance.
          </p>
        </div>

        {/* Metrics Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {metrics.map((metric) => (
            <div
              key={metric.label}
              className="p-6 rounded-2xl bg-[#000000]/50 border border-[#000000]/50 hover:border-[#ffa51f]/50 hover:bg-[#000000]/80 transition-all duration-300 group text-center relative overflow-hidden"
            >
              {/* Subtle gradient on hover */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#ffa51f]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="relative">
                <p className="font-display text-3xl md:text-4xl font-bold text-[#ffa51f] mb-1 group-hover:text-[#ffa51f] transition-colors">
                  {metric.value}
                </p>
                <p className="text-sm font-medium text-[#ffffff]/70 mb-1">{metric.label}</p>
                <p className="text-xs text-[#ffffff]/50">{metric.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
