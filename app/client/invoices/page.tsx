"use client"

import { useState } from "react"
import { ClientSidebar } from "@/components/ui/client-sidebar"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Download, Search, FileText, Calendar, CreditCard } from "lucide-react"

type Invoice = {
  id: string
  number: string
  date: string
  amount: string
  status: "paid" | "pending"
  description: string
  pdfUrl?: string
}

const mockInvoices: Invoice[] = [
  {
    id: "1",
    number: "INV-2024-001",
    date: "2024-01-08",
    amount: "5 000 FCFA",
    status: "paid",
    description: "Pack Formateur - 100 crédits",
    pdfUrl: "#"
  },
  {
    id: "2",
    number: "INV-2024-002",
    date: "2024-01-01",
    amount: "0 FCFA",
    status: "paid",
    description: "Pack Gratuit - 20 crédits",
    pdfUrl: "#"
  },
]

export default function InvoicesPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [invoices] = useState<Invoice[]>(mockInvoices)

  const filteredInvoices = invoices.filter((invoice) =>
    invoice.number.toLowerCase().includes(searchQuery.toLowerCase()) ||
    invoice.description.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const totalAmount = invoices.reduce((sum, inv) => {
    const amount = parseInt(inv.amount.replace(/[^0-9]/g, ""))
    return sum + amount
  }, 0)

  return (
    <div className="flex min-h-screen bg-[#000000]">
      <ClientSidebar />
      
      <main className="ml-64 flex-1 p-8">
        <div className="mx-auto max-w-6xl">
          {/* Header */}
          <div className="mb-8">
            <h1 className="font-heading text-4xl font-bold text-white mb-2">
              Factures
            </h1>
            <p className="text-[#ffffff]/70">
              Consultez et téléchargez vos factures
            </p>
          </div>

          {/* Search */}
          <Card className="mb-6 border-[#ffffff]/10 bg-[#0a0a0a]">
            <CardContent className="p-6">
              <div className="relative max-w-md">
                <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-[#ffffff]/50" />
                <Input
                  type="text"
                  placeholder="Rechercher par numéro ou description..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-[#000000]/70 border-[#ffffff]/10 text-white placeholder:text-[#ffffff]/50"
                />
              </div>
            </CardContent>
          </Card>

          {/* Statistics */}
          <div className="grid gap-6 md:grid-cols-3 mb-6">
            <Card className="border-[#ffffff]/10 bg-[#0a0a0a]">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-[#ffffff]/60">Total factures</p>
                    <p className="text-3xl font-bold text-white mt-1">{invoices.length}</p>
                  </div>
                  <div className="p-3 rounded-xl bg-[#ffa51f]/10">
                    <FileText className="h-6 w-6 text-[#ffa51f]" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-[#ffffff]/10 bg-[#0a0a0a]">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-[#ffffff]/60">Montant total</p>
                    <p className="text-3xl font-bold text-white mt-1">{totalAmount.toLocaleString()} FCFA</p>
                  </div>
                  <div className="p-3 rounded-xl bg-green-500/10">
                    <CreditCard className="h-6 w-6 text-green-500" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-[#ffffff]/10 bg-[#0a0a0a]">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-[#ffffff]/60">Cette année</p>
                    <p className="text-3xl font-bold text-white mt-1">2024</p>
                  </div>
                  <div className="p-3 rounded-xl bg-[#12A2AC]/10">
                    <Calendar className="h-6 w-6 text-[#12A2AC]" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Invoices Table */}
          <Card className="border-[#ffffff]/10 bg-[#0a0a0a]">
            <CardHeader>
              <CardTitle className="text-white">Toutes les factures</CardTitle>
              <CardDescription className="text-[#ffffff]/60">
                {filteredInvoices.length} facture{filteredInvoices.length > 1 ? "s" : ""}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-[#ffffff]/10">
                      <th className="pb-3 text-left text-sm font-semibold text-[#ffffff]/70">Numéro</th>
                      <th className="pb-3 text-left text-sm font-semibold text-[#ffffff]/70">Date</th>
                      <th className="pb-3 text-left text-sm font-semibold text-[#ffffff]/70">Description</th>
                      <th className="pb-3 text-left text-sm font-semibold text-[#ffffff]/70">Montant</th>
                      <th className="pb-3 text-left text-sm font-semibold text-[#ffffff]/70">Statut</th>
                      <th className="pb-3 text-left text-sm font-semibold text-[#ffffff]/70">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredInvoices.map((invoice) => (
                      <tr key={invoice.id} className="border-b border-[#ffffff]/5 hover:bg-[#ffffff]/5 transition-colors">
                        <td className="py-4 text-sm font-medium text-white">{invoice.number}</td>
                        <td className="py-4 text-sm text-[#ffffff]/80">
                          {new Date(invoice.date).toLocaleDateString("fr-FR")}
                        </td>
                        <td className="py-4 text-sm text-[#ffffff]/80">{invoice.description}</td>
                        <td className="py-4 text-sm font-semibold text-white">{invoice.amount}</td>
                        <td className="py-4">
                          <span className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium ${
                            invoice.status === "paid" 
                              ? "bg-green-500/10 text-green-500" 
                              : "bg-yellow-500/10 text-yellow-500"
                          }`}>
                            {invoice.status === "paid" ? "Payée" : "En attente"}
                          </span>
                        </td>
                        <td className="py-4">
                          <Button
                            size="sm"
                            className="bg-[#ffa51f] text-[#000000] hover:bg-[#ffa51f]/90"
                            onClick={() => window.open(invoice.pdfUrl, "_blank")}
                          >
                            <Download className="mr-2 h-4 w-4" />
                            PDF
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {filteredInvoices.length === 0 && (
                <div className="py-12 text-center">
                  <FileText className="mx-auto h-12 w-12 text-[#ffffff]/30 mb-4" />
                  <p className="text-[#ffffff]/60">Aucune facture trouvée</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
