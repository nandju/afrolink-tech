"use client"

import { useState } from "react"
import { ClientSidebar } from "@/components/ui/client-sidebar"
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
    <div className="flex min-h-screen bg-[#000000]">
      <ClientSidebar />
      
      <main className="ml-64 flex-1 p-8">
        <div className="mx-auto max-w-6xl">
          {/* Header */}
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="font-heading text-4xl font-bold text-white mb-2">
                Support
              </h1>
              <p className="text-[#ffffff]/70">
                Créez et suivez vos tickets de support
              </p>
            </div>
            <Button
              onClick={() => setShowNewTicket(!showNewTicket)}
              className="bg-[#ffa51f] text-[#000000] hover:bg-[#ffa51f]/90"
            >
              <Plus className="mr-2 h-4 w-4" />
              Nouveau ticket
            </Button>
          </div>

          {/* New Ticket Form */}
          {showNewTicket && (
            <Card className="border-[#ffffff]/10 bg-[#0a0a0a] mb-6">
              <CardHeader>
                <CardTitle className="text-white">Créer un nouveau ticket</CardTitle>
                <CardDescription className="text-[#ffffff]/60">
                  Décrivez votre problème ou votre question
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleCreateTicket} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="subject" className="text-[#ffffff]/80">Sujet</Label>
                    <Input
                      id="subject"
                      value={newTicket.subject}
                      onChange={(e) => setNewTicket({ ...newTicket, subject: e.target.value })}
                      placeholder="Décrivez brièvement votre demande"
                      className="bg-[#000000]/70 border-[#ffffff]/10 text-white"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="priority" className="text-[#ffffff]/80">Priorité</Label>
                    <select
                      id="priority"
                      value={newTicket.priority}
                      onChange={(e) => setNewTicket({ ...newTicket, priority: e.target.value })}
                      className="w-full rounded-lg border border-[#ffffff]/10 bg-[#000000]/70 px-3 py-2 text-white"
                    >
                      <option value="low">Basse</option>
                      <option value="medium">Moyenne</option>
                      <option value="high">Haute</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message" className="text-[#ffffff]/80">Message</Label>
                    <textarea
                      id="message"
                      value={newTicket.message}
                      onChange={(e) => setNewTicket({ ...newTicket, message: e.target.value })}
                      rows={6}
                      placeholder="Décrivez votre problème en détail..."
                      className="w-full rounded-lg border border-[#ffffff]/10 bg-[#000000]/70 p-3 text-white placeholder:text-[#ffffff]/50 resize-none"
                      required
                    />
                  </div>

                  <div className="flex gap-3">
                    <Button type="submit" className="bg-[#ffa51f] text-[#000000] hover:bg-[#ffa51f]/90">
                      <Send className="mr-2 h-4 w-4" />
                      Envoyer
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setShowNewTicket(false)}
                      className="border-[#ffffff]/10 text-white hover:bg-[#ffffff]/10"
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
            <Card className="border-[#ffffff]/10 bg-[#0a0a0a]">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-[#ffffff]/60">Tickets ouverts</p>
                    <p className="text-3xl font-bold text-white mt-1">
                      {tickets.filter(t => t.status === "open" || t.status === "in_progress").length}
                    </p>
                  </div>
                  <div className="p-3 rounded-xl bg-yellow-500/10">
                    <AlertCircle className="h-6 w-6 text-yellow-500" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-[#ffffff]/10 bg-[#0a0a0a]">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-[#ffffff]/60">En cours</p>
                    <p className="text-3xl font-bold text-white mt-1">
                      {tickets.filter(t => t.status === "in_progress").length}
                    </p>
                  </div>
                  <div className="p-3 rounded-xl bg-blue-500/10">
                    <Clock className="h-6 w-6 text-blue-500" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-[#ffffff]/10 bg-[#0a0a0a]">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-[#ffffff]/60">Résolus</p>
                    <p className="text-3xl font-bold text-white mt-1">
                      {tickets.filter(t => t.status === "resolved").length}
                    </p>
                  </div>
                  <div className="p-3 rounded-xl bg-green-500/10">
                    <CheckCircle2 className="h-6 w-6 text-green-500" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Tickets List */}
          <Card className="border-[#ffffff]/10 bg-[#0a0a0a]">
            <CardHeader>
              <CardTitle className="text-white">Mes tickets</CardTitle>
              <CardDescription className="text-[#ffffff]/60">
                {tickets.length} ticket{tickets.length > 1 ? "s" : ""} au total
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {tickets.map((ticket) => (
                  <div
                    key={ticket.id}
                    className="flex items-center justify-between p-4 rounded-lg border border-[#ffffff]/10 bg-[#000000]/50 hover:bg-[#ffffff]/5 transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-4 flex-1">
                      <div className="p-3 rounded-xl bg-[#ffa51f]/10">
                        <MessageSquare className="h-5 w-5 text-[#ffa51f]" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-1">
                          <h3 className="font-semibold text-white">{ticket.subject}</h3>
                          <span className={`text-xs font-medium px-2 py-1 rounded-full ${getPriorityColor(ticket.priority)}`}>
                            {getPriorityLabel(ticket.priority)}
                          </span>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-[#ffffff]/60">
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
                        <span className="text-sm text-[#ffffff]/80">{getStatusLabel(ticket.status)}</span>
                      </div>
                      <Button
                        size="sm"
                        className="bg-[#ffa51f] text-[#000000] hover:bg-[#ffa51f]/90"
                      >
                        Voir
                      </Button>
                    </div>
                  </div>
                ))}
              </div>

              {tickets.length === 0 && (
                <div className="py-12 text-center">
                  <MessageSquare className="mx-auto h-12 w-12 text-[#ffffff]/30 mb-4" />
                  <p className="text-[#ffffff]/60">Aucun ticket pour le moment</p>
                  <p className="text-sm text-[#ffffff]/40 mt-2">
                    Créez un ticket si vous avez besoin d'aide
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
