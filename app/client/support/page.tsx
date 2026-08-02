"use client"

import { useState } from "react"
import { ClientLayout } from "@/components/ui/client-layout"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { MessageSquare, Plus, Clock, CheckCircle2, AlertCircle, Send } from "lucide-react"
import { toast } from "sonner"

type Ticket = {
  id: string
  subject: string
  status: "open" | "in_progress" | "resolved"
  priority: "low" | "medium" | "high"
  date: string
  lastUpdate: string
  messages: number
}

const mockTickets: Ticket[] = [
  {
    id: "1",
    subject: "Problème d'envoi d'emails",
    status: "in_progress",
    priority: "high",
    date: "2024-01-15",
    lastUpdate: "2024-01-16",
    messages: 3
  },
  {
    id: "2",
    subject: "Question sur les crédits",
    status: "resolved",
    priority: "medium",
    date: "2024-01-10",
    lastUpdate: "2024-01-12",
    messages: 5
  },
  {
    id: "3",
    subject: "Demande de fonctionnalité",
    status: "open",
    priority: "low",
    date: "2024-01-08",
    lastUpdate: "2024-01-08",
    messages: 1
  },
]

export default function SupportPage() {
  const [showNewTicket, setShowNewTicket] = useState(false)
  const [tickets] = useState<Ticket[]>(mockTickets)
  const [newTicket, setNewTicket] = useState({
    subject: "",
    priority: "medium",
    message: ""
  })

  const handleCreateTicket = (e: React.FormEvent) => {
    e.preventDefault()
    toast.success("Ticket créé avec succès ! Notre équipe vous répondra bientôt.")
    setNewTicket({ subject: "", priority: "medium", message: "" })
    setShowNewTicket(false)
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "open":
        return <AlertCircle className="h-5 w-5 text-yellow-500" />
      case "in_progress":
        return <Clock className="h-5 w-5 text-blue-500" />
      case "resolved":
        return <CheckCircle2 className="h-5 w-5 text-green-500" />
      default:
        return null
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "open":
        return "Ouvert"
      case "in_progress":
        return "En cours"
      case "resolved":
        return "Résolu"
      default:
        return status
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "text-red-500 bg-red-500/10"
      case "medium":
        return "text-yellow-500 bg-yellow-500/10"
      case "low":
        return "text-green-500 bg-green-500/10"
      default:
        return "text-gray-500 bg-gray-500/10"
    }
  }

  const getPriorityLabel = (priority: string) => {
    switch (priority) {
      case "high":
        return "Haute"
      case "medium":
        return "Moyenne"
      case "low":
        return "Basse"
      default:
        return priority
    }
  }

  return (
    <ClientLayout>
      <div className="mx-auto max-w-7xl">
          {/* Header */}
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="font-heading text-4xl font-bold text-[#1E1E1E] mb-2">
                Support
              </h1>
              <p className="text-[#6B7280]">
                Créez et suivez vos tickets de support
              </p>
            </div>
            <Button
              onClick={() => setShowNewTicket(!showNewTicket)}
              className="bg-gradient-to-r from-[#D68C2D] to-[#12A2AC] text-white hover:shadow-lg transition-all"
            >
              <Plus className="mr-2 h-5 w-5" />
              Nouveau ticket
            </Button>
          </div>

          {/* New Ticket Form */}
          {showNewTicket && (
            <Card className="border-[#E5E7EB] bg-white shadow-sm mb-6">
              <CardHeader>
                <CardTitle className="font-heading text-2xl font-bold text-[#1E1E1E]">Créer un nouveau ticket</CardTitle>
                <CardDescription className="text-[#6B7280]">
                  Décrivez votre problème ou votre question en détail
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleCreateTicket} className="space-y-5">
                  <div className="space-y-2">
                    <Label htmlFor="subject" className="text-sm font-medium text-[#1E1E1E]">Sujet</Label>
                    <Input
                      id="subject"
                      value={newTicket.subject}
                      onChange={(e) => setNewTicket({ ...newTicket, subject: e.target.value })}
                      placeholder="Décrivez brièvement votre demande"
                      className="h-11 border-[#E5E7EB] focus:border-[#D68C2D] focus:ring-[#D68C2D]"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="priority" className="text-sm font-medium text-[#1E1E1E]">Priorité</Label>
                    <select
                      id="priority"
                      value={newTicket.priority}
                      onChange={(e) => setNewTicket({ ...newTicket, priority: e.target.value })}
                      className="h-11 w-full rounded-xl border border-[#E5E7EB] bg-white px-3 text-[#1E1E1E] focus:border-[#D68C2D] focus:outline-none focus:ring-2 focus:ring-[#D68C2D]/20"
                    >
                      <option value="low">Basse</option>
                      <option value="medium">Moyenne</option>
                      <option value="high">Haute</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message" className="text-sm font-medium text-[#1E1E1E]">Message</Label>
                    <textarea
                      id="message"
                      value={newTicket.message}
                      onChange={(e) => setNewTicket({ ...newTicket, message: e.target.value })}
                      rows={6}
                      placeholder="Décrivez votre problème en détail..."
                      className="w-full rounded-xl border border-[#E5E7EB] bg-white p-4 text-[#1E1E1E] placeholder:text-[#6B7280] resize-none focus:border-[#D68C2D] focus:outline-none focus:ring-2 focus:ring-[#D68C2D]/20"
                      required
                    />
                  </div>

                  <div className="flex gap-3">
                    <Button type="submit" className="h-11 bg-gradient-to-r from-[#D68C2D] to-[#12A2AC] text-white hover:shadow-lg transition-all">
                      <Send className="mr-2 h-5 w-5" />
                      Envoyer le ticket
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setShowNewTicket(false)}
                      className="h-11 border-[#E5E7EB] text-[#1E1E1E] hover:bg-[#FAFAFA]"
                    >
                      Annuler
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}

          {/* Tickets Statistics */}
          <div className="grid gap-6 md:grid-cols-3 mb-6">
            <Card className="border-[#E5E7EB] bg-white shadow-sm transition-all hover:shadow-md">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-[#6B7280]">Tickets ouverts</p>
                    <p className="text-3xl font-bold text-[#1E1E1E] mt-1">
                      {tickets.filter(t => t.status === "open" || t.status === "in_progress").length}
                    </p>
                  </div>
                  <div className="p-3 rounded-xl bg-[#F59E0B]/10">
                    <AlertCircle className="h-6 w-6 text-[#F59E0B]" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-[#E5E7EB] bg-white shadow-sm transition-all hover:shadow-md">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-[#6B7280]">En cours</p>
                    <p className="text-3xl font-bold text-[#1E1E1E] mt-1">
                      {tickets.filter(t => t.status === "in_progress").length}
                    </p>
                  </div>
                  <div className="p-3 rounded-xl bg-[#12A2AC]/10">
                    <Clock className="h-6 w-6 text-[#12A2AC]" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-[#E5E7EB] bg-white shadow-sm transition-all hover:shadow-md">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-[#6B7280]">Résolus</p>
                    <p className="text-3xl font-bold text-[#1E1E1E] mt-1">
                      {tickets.filter(t => t.status === "resolved").length}
                    </p>
                  </div>
                  <div className="p-3 rounded-xl bg-[#10B981]/10">
                    <CheckCircle2 className="h-6 w-6 text-[#10B981]" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Tickets List */}
          <Card className="border-[#E5E7EB] bg-white shadow-sm">
            <CardHeader>
              <CardTitle className="font-heading text-2xl font-bold text-[#1E1E1E]">Mes tickets</CardTitle>
              <CardDescription className="text-[#6B7280]">
                {tickets.length} ticket{tickets.length > 1 ? "s" : ""} au total
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {tickets.map((ticket) => (
                  <div
                    key={ticket.id}
                    className="flex items-center justify-between p-5 rounded-xl border border-[#E5E7EB] bg-white hover:border-[#D68C2D]/30 hover:shadow-md transition-all cursor-pointer"
                  >
                    <div className="flex items-center gap-4 flex-1">
                      <div className="p-3 rounded-xl bg-[#D68C2D]/10">
                        <MessageSquare className="h-6 w-6 text-[#D68C2D]" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold text-[#1E1E1E]">{ticket.subject}</h3>
                          <span className={`text-xs font-medium px-3 py-1 rounded-full ${getPriorityColor(ticket.priority)}`}>
                            {getPriorityLabel(ticket.priority)}
                          </span>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-[#6B7280]">
                          <span>Créé le {new Date(ticket.date).toLocaleDateString("fr-FR")}</span>
                          <span>•</span>
                          <span>{ticket.messages} message{ticket.messages > 1 ? "s" : ""}</span>
                          <span>•</span>
                          <span>Mis à jour le {new Date(ticket.lastUpdate).toLocaleDateString("fr-FR")}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(ticket.status)}
                        <span className="text-sm font-medium text-[#6B7280]">{getStatusLabel(ticket.status)}</span>
                      </div>
                      <Button
                        size="sm"
                        className="bg-[#D68C2D] text-white hover:bg-[#D68C2D]/90"
                      >
                        Voir
                      </Button>
                    </div>
                  </div>
                ))}
              </div>

              {tickets.length === 0 && (
                <div className="py-12 text-center">
                  <MessageSquare className="mx-auto h-12 w-12 text-[#6B7280]/30 mb-4" />
                  <p className="text-[#6B7280]">Aucun ticket pour le moment</p>
                  <p className="text-sm text-[#6B7280]/70 mt-2">
                    Créez un ticket si vous avez besoin d'aide
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
      </div>
    </ClientLayout>
  )
}
