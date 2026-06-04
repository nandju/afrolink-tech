"use client"

import { AdminSidebar } from "@/components/ui/admin-sidebar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Download, TrendingUp, CreditCard, CheckCircle } from "lucide-react"
import { useState } from "react"

type Transaction = {
  id: string
  user: string
  type: "purchase" | "refund"
  amount: string
  credits: number
  status: "completed" | "pending" | "failed"
  date: string
  method: "card" | "mobile"
}

const mockTransactions: Transaction[] = [
  { id: "TXN-001", user: "Marie Dubois", type: "purchase", amount: "5 000 FCFA", credits: 100, status: "completed", date: "2024-01-15", method: "card" },
  { id: "TXN-002", user: "Jean Martin", type: "purchase", amount: "20 000 FCFA", credits: 500, status: "completed", date: "2024-01-14", method: "mobile" },
  { id: "TXN-003", user: "Sophie Laurent", type: "purchase", amount: "10 000 FCFA", credits: 250, status: "completed", date: "2024-01-13", method: "card" },
  { id: "TXN-004", user: "Pierre Durand", type: "refund", amount: "5 000 FCFA", credits: -100, status: "completed", date: "2024-01-12", method: "card" },
  { id: "TXN-005", user: "Claire Bernard", type: "purchase", amount: "50 000 FCFA", credits: 2000, status: "pending", date: "2024-01-11", method: "mobile" },
]

export default function AdminTransactionsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [transactions] = useState<Transaction[]>(mockTransactions)

  const filteredTransactions = transactions.filter((t) =>
    t.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.user.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const totalRevenue = transactions
    .filter(t => t.type === "purchase" && t.status === "completed")
    .reduce((sum, t) => sum + parseInt(t.amount.replace(/[^0-9]/g, "")), 0)

  const getStatusBadge = (status: string) => {
    const styles = {
      completed: "bg-[#10B981]/10 text-[#10B981] border-[#10B981]/20",
      pending: "bg-[#F59E0B]/10 text-[#F59E0B] border-[#F59E0B]/20",
      failed: "bg-[#EF4444]/10 text-[#EF4444] border-[#EF4444]/20"
    }
    const labels = { completed: "Complété", pending: "En attente", failed: "Échoué" }
    return (
      <span className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-medium ${styles[status as keyof typeof styles]}`}>
        {labels[status as keyof typeof labels]}
      </span>
    )
  }

  return (
    <div className="flex min-h-screen bg-[#FAFAFA]">
      <AdminSidebar />
      
      <main className="ml-64 flex-1 p-8">
        <div className="mx-auto max-w-7xl">
          {/* Header */}
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="font-heading text-3xl font-bold text-[#1E1E1E]">Transactions</h1>
              <p className="mt-1 text-[#6B7280]">Historique des paiements et achats</p>
            </div>
            <Button className="rounded-xl border-[#E5E7EB] bg-white text-[#1E1E1E] hover:bg-[#FAFAFA]" variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Exporter
            </Button>
          </div>

          {/* Stats */}
          <div className="mb-6 grid gap-6 md:grid-cols-4">
            <Card className="border-[#E5E7EB] bg-white shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-[#6B7280]">Revenus totaux</p>
                    <p className="mt-2 font-heading text-2xl font-bold text-[#1E1E1E]">
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
                    <p className="text-sm font-medium text-[#6B7280]">Transactions</p>
                    <p className="mt-2 font-heading text-2xl font-bold text-[#1E1E1E]">{transactions.length}</p>
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
                    <p className="text-sm font-medium text-[#6B7280]">Complétées</p>
                    <p className="mt-2 font-heading text-2xl font-bold text-[#10B981]">
                      {transactions.filter(t => t.status === "completed").length}
                    </p>
                  </div>
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#10B981]/10">
                    <CheckCircle className="h-6 w-6 text-[#10B981]" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-[#E5E7EB] bg-white shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-[#6B7280]">En attente</p>
                    <p className="mt-2 font-heading text-2xl font-bold text-[#F59E0B]">
                      {transactions.filter(t => t.status === "pending").length}
                    </p>
                  </div>
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#F59E0B]/10">
                    <CreditCard className="h-6 w-6 text-[#F59E0B]" />
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
                  placeholder="Rechercher par ID ou utilisateur..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="h-10 rounded-xl border-[#E5E7EB] pl-10"
                />
              </div>
            </CardContent>
          </Card>

          {/* Transactions Table */}
          <Card className="border-[#E5E7EB] bg-white shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-[#1E1E1E]">
                {filteredTransactions.length} transaction{filteredTransactions.length > 1 ? "s" : ""}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-[#E5E7EB]">
                      <th className="pb-3 text-left text-sm font-semibold text-[#6B7280]">ID</th>
                      <th className="pb-3 text-left text-sm font-semibold text-[#6B7280]">Utilisateur</th>
                      <th className="pb-3 text-left text-sm font-semibold text-[#6B7280]">Type</th>
                      <th className="pb-3 text-left text-sm font-semibold text-[#6B7280]">Montant</th>
                      <th className="pb-3 text-left text-sm font-semibold text-[#6B7280]">Crédits</th>
                      <th className="pb-3 text-left text-sm font-semibold text-[#6B7280]">Méthode</th>
                      <th className="pb-3 text-left text-sm font-semibold text-[#6B7280]">Statut</th>
                      <th className="pb-3 text-left text-sm font-semibold text-[#6B7280]">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredTransactions.map((transaction) => (
                      <tr key={transaction.id} className="border-b border-[#E5E7EB] transition-colors hover:bg-[#FAFAFA]">
                        <td className="py-4 font-mono text-sm text-[#1E1E1E]">{transaction.id}</td>
                        <td className="py-4 text-sm text-[#1E1E1E]">{transaction.user}</td>
                        <td className="py-4">
                          <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${
                            transaction.type === "purchase" 
                              ? "bg-[#10B981]/10 text-[#10B981]" 
                              : "bg-[#EF4444]/10 text-[#EF4444]"
                          }`}>
                            {transaction.type === "purchase" ? "Achat" : "Remboursement"}
                          </span>
                        </td>
                        <td className="py-4 font-semibold text-[#1E1E1E]">{transaction.amount}</td>
                        <td className="py-4">
                          <span className={transaction.credits > 0 ? "text-[#10B981]" : "text-[#EF4444]"}>
                            {transaction.credits > 0 ? "+" : ""}{transaction.credits}
                          </span>
                        </td>
                        <td className="py-4 text-sm text-[#6B7280] capitalize">{transaction.method}</td>
                        <td className="py-4">{getStatusBadge(transaction.status)}</td>
                        <td className="py-4 text-sm text-[#6B7280]">
                          {new Date(transaction.date).toLocaleDateString("fr-FR")}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
