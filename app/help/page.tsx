"use client"

import { useState } from "react"
import { Search, Book, Mail, MessageCircle, Phone, ChevronDown, ChevronUp } from "lucide-react"
import { NavbarNew } from "@/components/ui/navbar-new"
import { FooterSectionNew } from "@/components/sections/footer-section-new"

const helpCategories = [
  {
    title: "Démarrage",
    icon: Book,
    articles: [
      { title: "Comment créer mon premier certificat ?", content: "Pour créer votre premier certificat, connectez-vous à votre compte, cliquez sur 'Générer mon certificat', puis suivez les 4 étapes : 1) Téléversez votre modèle PDF, 2) Importez vos participants, 3) Configurez les champs, 4) Générez et envoyez." },
      { title: "Comment importer mes participants ?", content: "Vous pouvez importer vos participants de deux façons : 1) Saisie manuelle directement dans l'interface, 2) Import depuis un fichier Excel/CSV. Pour l'import Excel, assurez-vous que votre fichier contient les colonnes nécessaires (nom, prénom, email, etc.)." },
      { title: "Quels formats de fichiers sont acceptés ?", content: "PROUV accepte les fichiers PDF pour les modèles de certificats, et les fichiers Excel (.xlsx) ou CSV (.csv) pour les listes de participants." },
    ]
  },
  {
    title: "Personnalisation",
    icon: Book,
    articles: [
      { title: "Comment positionner les champs sur mon certificat ?", content: "Utilisez le système de glisser-déposer pour positionner vos champs. Vous pouvez également utiliser les contrôles de positionnement précis (X/Y) et les flèches directionnelles pour des ajustements au pixel près." },
      { title: "Comment changer la police et la couleur ?", content: "Dans l'étape de configuration, sélectionnez le champ que vous souhaitez modifier, puis utilisez les options de personnalisation pour choisir la police, la taille, la couleur et le style." },
      { title: "Puis-je ajouter plusieurs champs ?", content: "Oui, vous pouvez ajouter autant de champs que nécessaire. Cliquez sur 'Ajouter un champ' et configurez chaque champ indépendamment avec ses propres propriétés." },
    ]
  },
  {
    title: "Envoi d'emails",
    icon: Mail,
    articles: [
      { title: "Comment envoyer les certificats par email ?", content: "À l'étape 4, activez l'option 'Envoyer par email'. Personnalisez le sujet et le message, puis validez. Les certificats seront automatiquement envoyés à tous les participants dont l'email est renseigné." },
      { title: "Puis-je personnaliser le message d'email ?", content: "Oui, vous pouvez personnaliser le sujet et le corps du message. Utilisez des variables comme {nom}, {prenom} pour personnaliser chaque email." },
      { title: "Que se passe-t-il si un email échoue ?", content: "Si un email échoue, vous serez notifié et pourrez consulter le statut dans votre historique. Vous pourrez renvoyer l'email manuellement si nécessaire." },
    ]
  },
  {
    title: "Crédits & Facturation",
    icon: Book,
    articles: [
      { title: "Comment acheter des crédits ?", content: "Rendez-vous dans votre espace client, section 'Crédits', puis cliquez sur 'Acheter des crédits'. Choisissez le forfait qui vous convient et procédez au paiement sécurisé." },
      { title: "Les crédits expirent-ils ?", content: "Non, vos crédits n'expirent jamais. Vous pouvez les utiliser à votre rythme sans contrainte de temps." },
      { title: "Comment obtenir une facture ?", content: "Une facture est automatiquement générée pour chaque achat et disponible dans votre espace client, section 'Factures'. Vous pouvez la télécharger au format PDF." },
    ]
  },
  {
    title: "Compte & Sécurité",
    icon: Book,
    articles: [
      { title: "Comment modifier mes informations personnelles ?", content: "Connectez-vous à votre compte, allez dans 'Paramètres', puis 'Profil'. Vous pourrez modifier vos informations personnelles et professionnelles." },
      { title: "Comment changer mon mot de passe ?", content: "Dans 'Paramètres' > 'Sécurité', cliquez sur 'Changer le mot de passe'. Entrez votre mot de passe actuel puis le nouveau mot de passe." },
      { title: "Mes données sont-elles sécurisées ?", content: "Oui, toutes vos données sont chiffrées et stockées en toute sécurité. Nous utilisons les meilleures pratiques de sécurité pour protéger vos informations." },
    ]
  }
]

const faqs = [
  {
    question: "Combien de certificats puis-je générer avec le Pack Gratuit ?",
    answer: "Le Pack Gratuit vous offre 20 crédits, soit 20 certificats. Vous pouvez ensuite acheter des crédits supplémentaires selon vos besoins."
  },
  {
    question: "Puis-je utiliser mes propres polices ?",
    answer: "Actuellement, PROUV propose 4 familles de polices professionnelles (Montserrat, Poppins, Roboto, Great Vibes) avec plusieurs variations. D'autres polices seront ajoutées prochainement."
  },
  {
    question: "Quelle est la taille maximale pour un fichier PDF ?",
    answer: "La taille maximale recommandée pour un modèle PDF est de 10 Mo. Pour de meilleures performances, nous recommandons des fichiers de moins de 5 Mo."
  },
  {
    question: "Puis-je annuler un envoi d'emails ?",
    answer: "Une fois l'envoi lancé, il ne peut pas être annulé. Assurez-vous de vérifier votre configuration avant de valider l'envoi."
  },
  {
    question: "Comment télécharger tous mes certificats ?",
    answer: "Après la génération, tous vos certificats sont automatiquement regroupés dans un fichier ZIP que vous pouvez télécharger. Vous pouvez également accéder à vos générations précédentes dans l'historique."
  },
  {
    question: "Puis-je partager mon compte avec mon équipe ?",
    answer: "Chaque compte est personnel. Pour un usage en équipe, nous recommandons le Pack Institution qui offre des fonctionnalités adaptées au travail collaboratif."
  }
]

export default function HelpPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [expandedArticle, setExpandedArticle] = useState<string | null>(null)

  const toggleArticle = (title: string) => {
    setExpandedArticle(expandedArticle === title ? null : title)
  }

  return (
    <main className="min-h-screen bg-[var(--color-background)]">
      <NavbarNew />
      
      <section className="px-6 py-24 pt-32">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[var(--color-primary)]/20 bg-[var(--color-primary)]/10 px-3 py-1.5">
              <span className="size-2 rounded-full bg-[var(--color-primary)] shadow-[0_0_18px_rgba(214,140,45,0.8)]" />
              <p className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text)]/80">Centre d'aide</p>
            </div>
            <h1 className="font-heading text-5xl md:text-6xl font-bold text-[var(--color-text)] mb-4">
              Comment pouvons-nous vous aider ?
            </h1>
            <p className="text-[var(--color-text)]/70 max-w-2xl mx-auto text-balance text-lg mb-8">
              Trouvez des réponses à vos questions ou contactez notre équipe de support
            </p>

            {/* Search Bar */}
            <div className="max-w-2xl mx-auto">
              <div className="relative glass soft-shadow rounded-2xl">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-text)]/50 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Rechercher dans l'aide..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-transparent border-none outline-none text-[var(--color-text)] placeholder:text-[var(--color-text)]/50 font-body"
                />
              </div>
            </div>
          </div>

          {/* Help Categories */}
          <div className="mb-24">
            <h2 className="font-heading text-3xl font-bold text-[var(--color-text)] mb-8 text-center">
              Parcourir par catégorie
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {helpCategories.map((category) => {
                const Icon = category.icon
                return (
                  <div key={category.title} className="glass soft-shadow rounded-2xl p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-3 rounded-xl bg-[var(--color-primary)]/10">
                        <Icon className="w-6 h-6 text-[var(--color-primary)]" />
                      </div>
                      <h3 className="font-heading text-xl font-semibold text-[var(--color-text)]">
                        {category.title}
                      </h3>
                    </div>
                    <div className="space-y-3">
                      {category.articles.map((article) => (
                        <div key={article.title}>
                          <button
                            onClick={() => toggleArticle(article.title)}
                            className="w-full text-left flex items-center justify-between gap-2 text-[var(--color-text)]/80 hover:text-[var(--color-primary)] transition-colors"
                          >
                            <span className="text-sm">{article.title}</span>
                            {expandedArticle === article.title ? (
                              <ChevronUp className="w-4 h-4 shrink-0" />
                            ) : (
                              <ChevronDown className="w-4 h-4 shrink-0" />
                            )}
                          </button>
                          {expandedArticle === article.title && (
                            <p className="mt-2 text-sm text-[var(--color-text)]/70 leading-relaxed pl-2 border-l-2 border-[var(--color-primary)]/30">
                              {article.content}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* FAQ Section */}
          <div className="mb-24">
            <h2 className="font-heading text-3xl font-bold text-[var(--color-text)] mb-8 text-center">
              Questions Fréquemment Posées
            </h2>
            <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-6">
              {faqs.map((faq, index) => (
                <div key={index} className="glass soft-shadow rounded-2xl p-6">
                  <h3 className="font-heading text-lg font-semibold text-[var(--color-text)] mb-3">
                    {faq.question}
                  </h3>
                  <p className="text-[var(--color-text)]/80 leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Contact Support */}
          <div className="max-w-5xl mx-auto">
            <h2 className="font-heading text-3xl font-bold text-[var(--color-text)] mb-8 text-center">
              Besoin d'aide supplémentaire ?
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="glass soft-shadow rounded-2xl p-8 text-center">
                <div className="inline-flex p-4 rounded-full bg-[var(--color-primary)]/10 mb-4">
                  <Mail className="w-8 h-8 text-[var(--color-primary)]" />
                </div>
                <h3 className="font-heading text-xl font-semibold text-[var(--color-text)] mb-2">
                  Email
                </h3>
                <p className="text-[var(--color-text)]/70 mb-4">
                  Envoyez-nous un email et nous vous répondrons sous 24h
                </p>
                <a href="mailto:support@prouv.com" className="text-[var(--color-primary)] font-semibold hover:underline">
                  support@prouv.com
                </a>
              </div>

              <div className="glass soft-shadow rounded-2xl p-8 text-center">
                <div className="inline-flex p-4 rounded-full bg-[var(--color-primary)]/10 mb-4">
                  <MessageCircle className="w-8 h-8 text-[var(--color-primary)]" />
                </div>
                <h3 className="font-heading text-xl font-semibold text-[var(--color-text)] mb-2">
                  Chat en direct
                </h3>
                <p className="text-[var(--color-text)]/70 mb-4">
                  Discutez avec notre équipe en temps réel
                </p>
                <button className="text-[var(--color-primary)] font-semibold hover:underline">
                  Démarrer le chat
                </button>
              </div>

              <div className="glass soft-shadow rounded-2xl p-8 text-center">
                <div className="inline-flex p-4 rounded-full bg-[var(--color-primary)]/10 mb-4">
                  <Phone className="w-8 h-8 text-[var(--color-primary)]" />
                </div>
                <h3 className="font-heading text-xl font-semibold text-[var(--color-text)] mb-2">
                  Téléphone
                </h3>
                <p className="text-[var(--color-text)]/70 mb-4">
                  Appelez-nous du lundi au vendredi, 9h-18h
                </p>
                <a href="tel:+225XXXXXXXX" className="text-[var(--color-primary)] font-semibold hover:underline">
                  +225 XX XX XX XX
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
