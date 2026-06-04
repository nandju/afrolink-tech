"use client"

import { AdminSidebar } from "@/components/ui/admin-sidebar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Plus, TrendingUp, Users, CreditCard } from "lucide-react"
import { useState } from "react"

type CreditPackage = {
  id: string
  name: string
  credits: number
  price: string
  active: boolean
  sales: number
}

const mockPackages: CreditPackage[] = [
  { id: "1", name: "Starter", credits: 50, price: "2 500 FCFA", active: true, sales: 145 },
  { id: "2", name: "Pro", credits: 200, price: "8 000 FCFA", active: true, sales: 89 },
  { id: "3", name: "Business", credits: 500, price: "18 000 FCFA", active: true, sales: 56 },
  { id: "4", name: "Enterprise", credits: 2000, price: "60 000 FCFA", active: true, sales: 23 },
]

export default function AdminCreditsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [packages] = useState<CreditPackage[]>(mockPackages)

  const filteredPackages = packages.filter((pkg) =>
    pkg.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const totalCredits = packages.reduce((sum, pkg) => sum + (pkg.credits * pkg.sales), 0)
  const totalRevenue = packages.reduce((sum, pkg) => sum + (parseInt(pkg.price.replace(/[^0-9]/g, "")) * pkg.sales), 0)

  return (
    <div className="flex min-h-screen bg-[#FAFAFA]">
      <AdminSidebar />
      
      <main className="ml-64 flex-1 p-8">
        <div className="mx-auto max-w-7xl">
          {/* Header */}
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="font-heading text-3xl font-bold text-[#1E1E1E]">Gestion des Crédits</h1>
              <p className="mt-1 text-[#6B7280]">Gérez les forfaits et les crédits</p>
            </div>
            <Button className="rounded-xl bg-[#D68C2D] text-white shadow-lg shadow-[#D68C2D]/25 hover:bg-[#D68C2D]/90">
              <Plus className="mr-2 h-4 w-4" />
              Nouveau forfait
            </Button>
          </div>

          {/* Stats */}
          <div className="mb-6 grid gap-6 md:grid-cols-3">
            <Card className="border-[#E5E7EB] bg-white shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-[#6B7280]">Crédits vendus</p>
                    <p className="mt-2 font-heading text-3xl font-bold text-[#1E1E1E]">
                      {totalCredits.toLocaleString()}
                    </p>
                  </div>
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#D68C2D]/10">
                    <CreditCard className="h-6 w-6 text-[#D68C2D]" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-[#E5E7EB] bg-white shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-[#6B7280]">Revenus totaux</p>
                    <p className="mt-2 font-heading text-3xl font-bold text-[#1E1E1E]">
                      {totalRevenue.toLocaleString()} FCFA
                    </p>
                  </div>
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#10B981]/10">
                    <TrendingUp className="h-6 w-6 text-[#10B981]" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-[#E5E7EB] bg-white shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-[#6B7280]">Forfaits actifs</p>
                    <p className="mt-2 font-heading text-3xl font-bold text-[#1E1E1E]">
                      {packages.filter(p => p.active).length}
                    </p>
                  </div>
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#12A2AC]/10">
                    <Users className="h-6 w-6 text-[#12A2AC]" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Search */}
          <Card className="mb-6 border-[#E5E7EB] bg-white shadow-sm">
            <CardContent className="p-6">
              <div className="relative max-w-md">
                <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-[#6B7280]" />
                <Input
                  type="text"
                  placeholder="Rechercher un forfait..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="h-10 rounded-xl border-[#E5E7EB] pl-10"
                />
              </div>
            </CardContent>
          </Card>

          {/* Packages Grid */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {filteredPackages.map((pkg) => (
              <Card key={pkg.id} className="border-[#E5E7EB] bg-white shadow-sm transition-shadow hover:shadow-md">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg font-semibold text-[#1E1E1E]">{pkg.name}</CardTitle>
                    <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${
                      pkg.active 
                        ? "bg-[#10B981]/10 text-[#10B981]" 
                        : "bg-[#6B7280]/10 text-[#6B7280]"
                    }`}>
                      {pkg.active ? "Actif" : "Inactif"}
                    </span>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-[#6B7280]">Crédits</p>
                      <p className="mt-1 font-heading text-2xl font-bold text-[#D68C2D]">
                        {pkg.credits}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-[#6B7280]">Prix</p>
                      <p className="mt-1 text-lg font-semibold text-[#1E1E1E]">{pkg.price}</p>
                    </div>
                    <div>
                      <p className="text-sm text-[#6B7280]">Ventes</p>
                      <p className="mt-1 text-lg font-semibold text-[#1E1E1E]">{pkg.sales}</p>
                    </div>
                    <div className="flex gap-2 pt-2">
                      <Button variant="outline" size="sm" className="flex-1 rounded-xl border-[#E5E7EB]">
                        Modifier
                      </Button>
                      <Button variant="outline" size="sm" className="flex-1 rounded-xl border-[#E5E7EB]">
                        Stats
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}
