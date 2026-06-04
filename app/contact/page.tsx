"use client"

import { useState } from "react"
import { Mail, Phone, MapPin, Send } from "lucide-react"
import { NavbarNew } from "@/components/ui/navbar-new"
import { FooterSectionNew } from "@/components/sections/footer-section-new"

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: Implement contact form submission
    console.log("Form submitted:", formData)
    alert("Merci pour votre message ! Notre équipe vous répondra dans les plus brefs délais.")
    setFormData({ name: "", email: "", subject: "", message: "" })
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  return (
    <main className="min-h-screen bg-white">
      <NavbarNew />
      
      <section className="px-6 py-24 pt-32">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[var(--color-primary)]/20 bg-[var(--color-primary)]/10 px-3 py-1.5">
              <span className="size-2 rounded-full bg-[var(--color-primary)] shadow-[0_0_18px_rgba(214,140,45,0.8)]" />
              <p className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text)]/80">Contact</p>
            </div>
            <h1 className="font-heading text-5xl md:text-6xl font-bold text-[var(--color-text)] mb-4">
              Contactez-nous
            </h1>
            <p className="text-[var(--color-text)]/70 max-w-2xl mx-auto text-balance text-lg">
              Une question ? Un projet ? Notre équipe est là pour vous accompagner
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div className="glass soft-shadow rounded-2xl p-8">
              <h2 className="font-heading text-2xl font-bold text-[var(--color-text)] mb-6">
                Envoyez-nous un message
              </h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-semibold text-[var(--color-text)] mb-2">
                    Nom complet *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-xl border border-[var(--color-primary)]/20 bg-white/50 text-[var(--color-text)] placeholder:text-[var(--color-text)]/50 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] transition-all"
                    placeholder="Jean Dupont"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-semibold text-[var(--color-text)] mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-xl border border-[var(--color-primary)]/20 bg-white/50 text-[var(--color-text)] placeholder:text-[var(--color-text)]/50 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] transition-all"
                    placeholder="jean.dupont@example.com"
                  />
                </div>

                <div>
                  <label htmlFor="subject" className="block text-sm font-semibold text-[var(--color-text)] mb-2">
                    Sujet *
                  </label>
                  <select
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-xl border border-[var(--color-primary)]/20 bg-white/50 text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] transition-all"
                  >
                    <option value="">Sélectionnez un sujet</option>
                    <option value="support">Support technique</option>
                    <option value="sales">Question commerciale</option>
                    <option value="billing">Facturation</option>
                    <option value="feature">Demande de fonctionnalité</option>
                    <option value="other">Autre</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-semibold text-[var(--color-text)] mb-2">
                    Message *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={6}
                    className="w-full px-4 py-3 rounded-xl border border-[var(--color-primary)]/20 bg-white/50 text-[var(--color-text)] placeholder:text-[var(--color-text)]/50 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] transition-all resize-none"
                    placeholder="Décrivez votre demande..."
                  />
                </div>

                <button
                  type="submit"
                  className="w-full px-7 py-4 rounded-2xl font-heading font-semibold text-lg bg-[var(--color-primary)] text-white shadow-lg hover:bg-[var(--color-secondary)] transition-all flex items-center justify-center gap-2"
                >
                  <Send className="w-5 h-5" />
                  Envoyer le message
                </button>
              </form>
            </div>

            {/* Contact Information */}
            <div className="space-y-6">
              <div className="glass soft-shadow rounded-2xl p-8">
                <h2 className="font-heading text-2xl font-bold text-[var(--color-text)] mb-6">
                  Informations de contact
                </h2>
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-xl bg-[var(--color-primary)]/10 shrink-0">
                      <Mail className="w-6 h-6 text-[var(--color-primary)]" />
                    </div>
                    <div>
                      <h3 className="font-heading text-lg font-semibold text-[var(--color-text)] mb-1">
                        Email
                      </h3>
                      <p className="text-[var(--color-text)]/70">
                        support@prouv.com
                      </p>
                      <p className="text-sm text-[var(--color-text)]/60 mt-1">
                        Réponse sous 24h
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-xl bg-[var(--color-primary)]/10 shrink-0">
                      <Phone className="w-6 h-6 text-[var(--color-primary)]" />
                    </div>
                    <div>
                      <h3 className="font-heading text-lg font-semibold text-[var(--color-text)] mb-1">
                        Téléphone
                      </h3>
                      <p className="text-[var(--color-text)]/70">
                        +225 XX XX XX XX
                      </p>
                      <p className="text-sm text-[var(--color-text)]/60 mt-1">
                        Lun - Ven, 9h - 18h
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-xl bg-[var(--color-primary)]/10 shrink-0">
                      <MapPin className="w-6 h-6 text-[var(--color-primary)]" />
                    </div>
                    <div>
                      <h3 className="font-heading text-lg font-semibold text-[var(--color-text)] mb-1">
                        Adresse
                      </h3>
                      <p className="text-[var(--color-text)]/70">
                        Abidjan, Côte d'Ivoire
                      </p>
                      <p className="text-sm text-[var(--color-text)]/60 mt-1">
                        Cocody, Riviera
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="glass soft-shadow rounded-2xl p-8">
                <h3 className="font-heading text-xl font-bold text-[var(--color-text)] mb-4">
                  Horaires d'ouverture
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-[var(--color-text)]/70">Lundi - Vendredi</span>
                    <span className="font-semibold text-[var(--color-text)]">9h - 18h</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[var(--color-text)]/70">Samedi</span>
                    <span className="font-semibold text-[var(--color-text)]">10h - 14h</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[var(--color-text)]/70">Dimanche</span>
                    <span className="font-semibold text-[var(--color-text)]">Fermé</span>
                  </div>
                </div>
              </div>

              <div className="glass soft-shadow rounded-2xl p-8 bg-gradient-to-br from-[var(--color-primary)]/10 to-[var(--color-secondary)]/10">
                <h3 className="font-heading text-xl font-bold text-[var(--color-text)] mb-3">
                  Besoin d'aide immédiate ?
                </h3>
                <p className="text-[var(--color-text)]/70 mb-4">
                  Consultez notre centre d'aide pour trouver des réponses rapides à vos questions
                </p>
                <a href="/help">
                  <button className="px-6 py-3 rounded-2xl font-heading font-semibold bg-white text-[var(--color-primary)] shadow-lg hover:bg-[var(--color-primary)] hover:text-white transition-all">
                    Centre d'aide
                  </button>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <FooterSectionNew />
    </main>
  )
}
