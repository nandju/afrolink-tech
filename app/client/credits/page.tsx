"use client"

import { useState } from "react"
import { ClientSidebar } from "@/components/ui/client-sidebar"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CreditCard, TrendingUp, Package, ArrowRight, Check } from "lucide-react"
import Link from "next/link"

type CreditTransaction = {
  id: string
  date: string
  type: "purchase" | "usage"
  amount: number
  description: string
  balance: number
}

const mockTransactions: CreditTransaction[] = [
  { id: "1", date: "2024-01-15", type: "usage", amount: -45, description: "Formation React Avancé", balance: 155 },
  { id: "2", date: "2024-01-10", type: "usage", amount: -30, description: "Atelier Design Thinking", balance: 200 },
  { id: "3", date: "2024-01-08", type: "purchase", amount: 100, description: "Pack Formateur", balance: 230 },
  { id: "4", date: "2024-01-05", type: "usage", amount: -60, description: "Séminaire Leadership", balance: 130 },
  { id: "5", date: "2024-01-01", type: "purchase", amount: 20, description: "Pack Gratuit (Inscription)", balance: 190 },
]

const recommendedPackages = [
  {
    name: "Pack Formateur",
    credits: 100,
    price: "5 000 FCFA",
    pricePerCredit: "50 FCFA",
    popular: false,
  },
  {
    name: "Pack Institution",
    credits: 500,
    price: "20 000 FCFA",
    pricePerCredit: "40 FCFA",
    popular: true,
  },
  {
    name: "Pack Grand Événement",
    credits: 2000,
    price: "50 000 FCFA",
    pricePerCredit: "25 FCFA",
    popular: false,
  },
]

export default function CreditsPage() {
  const [currentCredits] = useState(155)
  const [totalUsed] = useState(135)
  const [totalPurchased] = useState(290)

  return (
    <div className="flex min-h-screen bg-[#FAFAFA]">
      <ClientSidebar />
      
      <main className="ml-64 flex-1 p-8">
        <div className="mx-auto max-w-7xl">
          {/* Header */}
          <div className="mb-8">
            <h1 className="font-heading text-4xl font-bold text-[#1E1E1E] mb-2">
              Gestion des crédits
            </h1>
            <p className="text-[#6B7280]">
              Suivez vos crédits et achetez des forfaits
            </p>
          </div>

          {/* Credit Overview */}
          <div className="grid gap-6 md:grid-cols-3 mb-8">
            <Card className="border-[#E5E7EB] bg-gradient-to-br from-[#D68C2D]/10 to-white shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 rounded-xl bg-[#D68C2D]/10">
                    <CreditCard className="h-6 w-6 text-[#D68C2D]" />
                  </div>
                  <span className="text-xs font-semibold text-[#D68C2D] bg-[#D68C2D]/10 px-2 py-1 rounded-full">
                    Disponibles
                  </span>
                </div>
                <p className="text-sm text-[#6B7280] mb-1">Crédits restants</p>
                <p className="text-4xl font-bold text-[#1E1E1E]">{currentCredits}</p>
                <p className="text-xs text-[#6B7280] mt-2">1 crédit = 1 certificat</p>
              </CardContent>
            </Card>

            <Card className="border-[#E5E7EB] bg-white shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 rounded-xl bg-[#12A2AC]/10">
                    <TrendingUp className="h-6 w-6 text-[#12A2AC]" />
                  </div>
                </div>
                <p className="text-sm text-[#6B7280] mb-1">Crédits utilisés</p>
                <p className="text-4xl font-bold text-[#1E1E1E]">{totalUsed}</p>
                <p className="text-xs text-[#6B7280] mt-2">Depuis votre inscription</p>
              </CardContent>
            </Card>

            <Card className="border-[#E5E7EB] bg-white shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 rounded-xl bg-[#10B981]/10">
                    <Package className="h-6 w-6 text-[#10B981]" />
                  </div>
                </div>
                <p className="text-sm text-[#6B7280] mb-1">Crédits achetés</p>
                <p className="text-4xl font-bold text-[#1E1E1E]">{totalPurchased}</p>
                <p className="text-xs text-[#6B7280] mt-2">Total de vos achats</p>
              </CardContent>
            </Card>
          </div>

          {/* Recommended Packages */}
          <Card className="border-[#E5E7EB] bg-white shadow-sm mb-8">
            <CardHeader>
              <CardTitle className="text-[#1E1E1E]">Forfaits recommandés</CardTitle>
              <CardDescription className="text-[#6B7280]">
                Rechargez vos crédits avec nos forfaits avantageux
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-3">
                {recommendedPackages.map((pkg) => (
                  <div
                    key={pkg.name}
                    className={`relative rounded-2xl border p-6 transition-all hover:-translate-y-1 ${
                      pkg.popular
                        ? "border-[#D68C2D] bg-gradient-to-br from-[#D68C2D]/10 to-white shadow-lg"
                        : "border-[#E5E7EB] bg-white shadow-sm"
                    }`}
                  >
                    {pkg.popular && (
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                        <span className="bg-[#D68C2D] text-white text-xs font-bold px-3 py-1 rounded-full">
                          ⭐ Populaire
                        </span>
                      </div>
                    )}
                    
                    <div className="mb-4">
                      <h3 className="font-heading text-xl font-bold text-[#1E1E1E] mb-2">{pkg.name}</h3>
                      <p className="text-3xl font-bold text-[#D68C2D]">{pkg.credits}</p>
                      <p className="text-sm text-[#6B7280]">crédits</p>
                    </div>

                    <div className="mb-6">
                      <p className="text-2xl font-bold text-[#1E1E1E]">{pkg.price}</p>
                      <p className="text-xs text-[#6B7280]">{pkg.pricePerCredit} par certificat</p>
                    </div>

                    <Button
                      className={`w-full rounded-xl ${
                        pkg.popular
                          ? "bg-[#D68C2D] text-white hover:bg-[#D68C2D]/90"
                          : "bg-[#1E1E1E] text-white hover:bg-[#1E1E1E]/90"
                      }`}
                    >
                      Acheter
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>

              <div className="mt-6 text-center">
                <Link href="/pricing">
                  <Button variant="outline" className="rounded-xl border-[#E5E7EB] text-[#1E1E1E] hover:bg-[#FAFAFA]">
                    Voir tous les forfaits
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Transaction History */}
          <Card className="border-[#E5E7EB] bg-white shadow-sm">
            <CardHeader>
              <CardTitle className="text-[#1E1E1E]">Historique des transactions</CardTitle>
              <CardDescription className="text-[#6B7280]">
                Suivez vos achats et utilisations de crédits
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockTransactions.map((transaction) => (
                  <div
                    key={transaction.id}
                    className="flex items-center justify-between p-4 rounded-lg border border-[#E5E7EB] bg-[#FAFAFA] hover:bg-white transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className={`p-3 rounded-xl ${
                          transaction.type === "purchase"
                            ? "bg-[#10B981]/10"
                            : "bg-[#EF4444]/10"
                        }`}
                      >
                        {transaction.type === "purchase" ? (
                          <TrendingUp className="h-5 w-5 text-[#10B981]" />
                        ) : (
                          <CreditCard className="h-5 w-5 text-[#EF4444]" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-[#1E1E1E]">{transaction.description}</p>
                        <p className="text-sm text-[#6B7280]">
                          {new Date(transaction.date).toLocaleDateString("fr-FR")}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p
                        className={`text-lg font-bold ${
                          transaction.type === "purchase" ? "text-[#10B981]" : "text-[#EF4444]"
                        }`}
                      >
                        {transaction.amount > 0 ? "+" : ""}
                        {transaction.amount}
                      </p>
                      <p className="text-sm text-[#6B7280]">Solde: {transaction.balance}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
