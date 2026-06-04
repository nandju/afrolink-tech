"use client"

import { AdminSidebar } from "@/components/ui/admin-sidebar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, MessageSquare, Clock, CheckCircle, AlertCircle } from "lucide-react"
import { useState } from "react"

type Ticket = {
  id: string
  user: string
  subject: string
  status: "open" | "in_progress" | "resolved" | "closed"
  priority: "low" | "medium" | "high" | "urgent"
  created: string
  updated: string
  messages: number
}

const mockTickets: Ticket[] = [
  { id: "TKT-001", user: "Marie Dubois", subject: "Problème de génération PDF", status: "open", priority: "high", created: "2024-01-15", updated: "2024-01-15", messages: 1 },
  { id: "TKT-002", user: "Jean Martin", subject: "Question sur les crédits", status: "in_progress", priority: "medium", created: "2024-01-14", updated: "2024-01-15", messages: 3 },
  { id: "TKT-003", user: "Sophie Laurent", subject: "Import Excel ne fonctionne pas", status: "resolved", priority: "urgent", created: "2024-01-13", updated: "2024-01-14", messages: 5 },
  { id: "TKT-004", user: "Pierre Durand", subject: "Demande de fonctionnalité", status: "closed", priority: "low", created: "2024-01-12", updated: "2024-01-13", messages: 2 },
  { id: "TKT-005", user: "Claire Bernard", subject: "Erreur lors de l'envoi d'emails", status: "in_progress", priority: "high", created: "2024-01-11", updated: "2024-01-15", messages: 4 },
]

export default function AdminSupportPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [tickets] = useState<Ticket[]>(mockTickets)

  const filteredTickets = tickets.filter((ticket) =>
    ticket.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    ticket.user.toLowerCase().includes(searchQuery.toLowerCase()) ||
    ticket.subject.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const getStatusBadge = (status: string) => {
    const styles = {
      open: "bg-[#F59E0B]/10 text-[#F59E0B] border-[#F59E0B]/20",
      in_progress: "bg-[#12A2AC]/10 text-[#12A2AC] border-[#12A2AC]/20",
      resolved: "bg-[#10B981]/10 text-[#10B981] border-[#10B981]/20",
      closed: "bg-[#6B7280]/10 text-[#6B7280] border-[#6B7280]/20"
    }
    const labels = { open: "Ouvert", in_progress: "En cours", resolved: "Résolu", closed: "Fermé" }
    return (
      <span className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-medium ${styles[status as keyof typeof styles]}`}>
        {labels[status as keyof typeof labels]}
      </span>
    )
  }

  const getPriorityBadge = (priority: string) => {
    const styles = {
      low: "bg-[#6B7280]/10 text-[#6B7280]",
      medium: "bg-[#F59E0B]/10 text-[#F59E0B]",
      high: "bg-[#EF4444]/10 text-[#EF4444]",
      urgent: "bg-[#EF4444] text-white"
    }
    const labels = { low: "Basse", medium: "Moyenne", high: "Haute", urgent: "Urgente" }
    return (
      <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${styles[priority as keyof typeof styles]}`}>
        {labels[priority as keyof typeof labels]}
      </span>
    )
  }

  return (
    <div className="flex min-h-screen bg-[#FAFAFA]">
      <AdminSidebar />
      
      <main className="ml-64 flex-1 p-8">
        <div className="mx-auto max-w-7xl">
          {/* Header */}
          <div className="mb-8">
            <h1 className="font-heading text-3xl font-bold text-[#1E1E1E]">Support</h1>
            <p className="mt-1 text-[#6B7280]">Gérez les tickets de support</p>
          </div>

          {/* Stats */}
          <div className="mb-6 grid gap-6 md:grid-cols-4">
            <Card className="border-[#E5E7EB] bg-white shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-[#6B7280]">Ouverts</p>
                    <p className="mt-2 font-heading text-3xl font-bold text-[#F59E0B]">
                      {tickets.filter(t => t.status === "open").length}
                    </p>
                  </div>
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#F59E0B]/10">
                    <AlertCircle className="h-6 w-6 text-[#F59E0B]" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-[#E5E7EB] bg-white shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-[#6B7280]">En cours</p>
                    <p className="mt-2 font-heading text-3xl font-bold text-[#12A2AC]">
                      {tickets.filter(t => t.status === "in_progress").length}
                    </p>
                  </div>
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#12A2AC]/10">
                    <Clock className="h-6 w-6 text-[#12A2AC]" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-[#E5E7EB] bg-white shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-[#6B7280]">Résolus</p>
                    <p className="mt-2 font-heading text-3xl font-bold text-[#10B981]">
                      {tickets.filter(t => t.status === "resolved").length}
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
                    <p className="text-sm font-medium text-[#6B7280]">Total</p>
                    <p className="mt-2 font-heading text-3xl font-bold text-[#1E1E1E]">
                      {tickets.length}
                    </p>
                  </div>
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#D68C2D]/10">
                    <MessageSquare className="h-6 w-6 text-[#D68C2D]" />
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
                  placeholder="Rechercher par ID, utilisateur ou sujet..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="h-10 rounded-xl border-[#E5E7EB] pl-10"
                />
              </div>
            </CardContent>
          </Card>

          {/* Tickets Table */}
          <Card className="border-[#E5E7EB] bg-white shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-[#1E1E1E]">
                {filteredTickets.length} ticket{filteredTickets.length > 1 ? "s" : ""}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-[#E5E7EB]">
                      <th className="pb-3 text-left text-sm font-semibold text-[#6B7280]">ID</th>
                      <th className="pb-3 text-left text-sm font-semibold text-[#6B7280]">Utilisateur</th>
                      <th className="pb-3 text-left text-sm font-semibold text-[#6B7280]">Sujet</th>
                      <th className="pb-3 text-left text-sm font-semibold text-[#6B7280]">Priorité</th>
                      <th className="pb-3 text-left text-sm font-semibold text-[#6B7280]">Statut</th>
                      <th className="pb-3 text-left text-sm font-semibold text-[#6B7280]">Messages</th>
                      <th className="pb-3 text-left text-sm font-semibold text-[#6B7280]">Créé</th>
                      <th className="pb-3 text-left text-sm font-semibold text-[#6B7280]">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredTickets.map((ticket) => (
                      <tr key={ticket.id} className="border-b border-[#E5E7EB] transition-colors hover:bg-[#FAFAFA]">
                        <td className="py-4 font-mono text-sm text-[#1E1E1E]">{ticket.id}</td>
                        <td className="py-4 text-sm text-[#1E1E1E]">{ticket.user}</td>
                        <td className="py-4 text-sm text-[#1E1E1E]">{ticket.subject}</td>
                        <td className="py-4">{getPriorityBadge(ticket.priority)}</td>
                        <td className="py-4">{getStatusBadge(ticket.status)}</td>
                        <td className="py-4">
                          <div className="flex items-center gap-2">
                            <MessageSquare className="h-4 w-4 text-[#6B7280]" />
                            <span className="text-sm text-[#1E1E1E]">{ticket.messages}</span>
                          </div>
                        </td>
                        <td className="py-4 text-sm text-[#6B7280]">
                          {new Date(ticket.created).toLocaleDateString("fr-FR")}
                        </td>
                        <td className="py-4">
                          <Button size="sm" variant="outline" className="rounded-xl border-[#E5E7EB]">
                            Voir
                          </Button>
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
