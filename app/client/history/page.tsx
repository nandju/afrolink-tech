"use client"

import { useState } from "react"
import { ClientSidebar } from "@/components/ui/client-sidebar"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Download, Search, Filter, Calendar, Users, Mail, CheckCircle2, XCircle, Clock } from "lucide-react"

type CertificateHistory = {
  id: string
  date: string
  name: string
  participants: number
  emailsSent: number
  status: "completed" | "pending" | "failed"
  zipUrl?: string
}

const mockHistory: CertificateHistory[] = [
  {
    id: "1",
    date: "2024-01-15",
    name: "Formation React Avancé",
    participants: 45,
    emailsSent: 45,
    status: "completed",
    zipUrl: "#"
  },
  {
    id: "2",
    date: "2024-01-10",
    name: "Atelier Design Thinking",
    participants: 30,
    emailsSent: 28,
    status: "completed",
    zipUrl: "#"
  },
  {
    id: "3",
    date: "2024-01-05",
    name: "Séminaire Leadership",
    participants: 60,
    emailsSent: 0,
    status: "completed",
    zipUrl: "#"
  },
]

export default function HistoryPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [history] = useState<CertificateHistory[]>(mockHistory)

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle2 className="h-5 w-5 text-green-500" />
      case "pending":
        return <Clock className="h-5 w-5 text-yellow-500" />
      case "failed":
        return <XCircle className="h-5 w-5 text-red-500" />
      default:
        return null
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "completed":
        return "Terminé"
      case "pending":
        return "En cours"
      case "failed":
        return "Échoué"
      default:
        return status
    }
  }

  const filteredHistory = history.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="flex min-h-screen bg-[#000000]">
      <ClientSidebar />
      
      <main className="ml-64 flex-1 p-8">
        <div className="mx-auto max-w-7xl">
          {/* Header */}
          <div className="mb-8">
            <h1 className="font-heading text-4xl font-bold text-white mb-2">
              Historique des certificats
            </h1>
            <p className="text-[#ffffff]/70">
              Consultez et téléchargez vos générations précédentes
            </p>
          </div>

          {/* Search and Filters */}
          <Card className="mb-6 border-[#ffffff]/10 bg-[#0a0a0a]">
            <CardContent className="p-6">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-[#ffffff]/50" />
                  <Input
                    type="text"
                    placeholder="Rechercher par nom..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 bg-[#000000]/70 border-[#ffffff]/10 text-white placeholder:text-[#ffffff]/50"
                  />
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" className="border-[#ffffff]/10 text-white hover:bg-[#ffffff]/10">
                    <Filter className="mr-2 h-4 w-4" />
                    Filtrer
                  </Button>
                  <Button variant="outline" className="border-[#ffffff]/10 text-white hover:bg-[#ffffff]/10">
                    <Calendar className="mr-2 h-4 w-4" />
                    Date
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Statistics */}
          <div className="grid gap-6 md:grid-cols-3 mb-6">
            <Card className="border-[#ffffff]/10 bg-[#0a0a0a]">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-[#ffffff]/60">Total générations</p>
                    <p className="text-3xl font-bold text-white mt-1">{history.length}</p>
                  </div>
                  <div className="p-3 rounded-xl bg-[#ffa51f]/10">
                    <Download className="h-6 w-6 text-[#ffa51f]" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-[#ffffff]/10 bg-[#0a0a0a]">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-[#ffffff]/60">Participants totaux</p>
                    <p className="text-3xl font-bold text-white mt-1">
                      {history.reduce((sum, item) => sum + item.participants, 0)}
                    </p>
                  </div>
                  <div className="p-3 rounded-xl bg-[#12A2AC]/10">
                    <Users className="h-6 w-6 text-[#12A2AC]" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-[#ffffff]/10 bg-[#0a0a0a]">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-[#ffffff]/60">Emails envoyés</p>
                    <p className="text-3xl font-bold text-white mt-1">
                      {history.reduce((sum, item) => sum + item.emailsSent, 0)}
                    </p>
                  </div>
                  <div className="p-3 rounded-xl bg-green-500/10">
                    <Mail className="h-6 w-6 text-green-500" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* History Table */}
          <Card className="border-[#ffffff]/10 bg-[#0a0a0a]">
            <CardHeader>
              <CardTitle className="text-white">Générations récentes</CardTitle>
              <CardDescription className="text-[#ffffff]/60">
                {filteredHistory.length} résultat{filteredHistory.length > 1 ? "s" : ""}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-[#ffffff]/10">
                      <th className="pb-3 text-left text-sm font-semibold text-[#ffffff]/70">Date</th>
                      <th className="pb-3 text-left text-sm font-semibold text-[#ffffff]/70">Nom du certificat</th>
                      <th className="pb-3 text-left text-sm font-semibold text-[#ffffff]/70">Participants</th>
                      <th className="pb-3 text-left text-sm font-semibold text-[#ffffff]/70">Emails</th>
                      <th className="pb-3 text-left text-sm font-semibold text-[#ffffff]/70">Statut</th>
                      <th className="pb-3 text-left text-sm font-semibold text-[#ffffff]/70">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredHistory.map((item) => (
                      <tr key={item.id} className="border-b border-[#ffffff]/5 hover:bg-[#ffffff]/5 transition-colors">
                        <td className="py-4 text-sm text-[#ffffff]/80">
                          {new Date(item.date).toLocaleDateString("fr-FR")}
                        </td>
                        <td className="py-4 text-sm font-medium text-white">{item.name}</td>
                        <td className="py-4 text-sm text-[#ffffff]/80">
                          <div className="flex items-center gap-2">
                            <Users className="h-4 w-4 text-[#12A2AC]" />
                            {item.participants}
                          </div>
                        </td>
                        <td className="py-4 text-sm text-[#ffffff]/80">
                          <div className="flex items-center gap-2">
                            <Mail className="h-4 w-4 text-green-500" />
                            {item.emailsSent}/{item.participants}
                          </div>
                        </td>
                        <td className="py-4">
                          <div className="flex items-center gap-2">
                            {getStatusIcon(item.status)}
                            <span className="text-sm text-[#ffffff]/80">{getStatusLabel(item.status)}</span>
                          </div>
                        </td>
                        <td className="py-4">
                          <Button
                            size="sm"
                            className="bg-[#ffa51f] text-[#000000] hover:bg-[#ffa51f]/90"
                            onClick={() => window.open(item.zipUrl, "_blank")}
                          >
                            <Download className="mr-2 h-4 w-4" />
                            ZIP
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {filteredHistory.length === 0 && (
                <div className="py-12 text-center">
                  <p className="text-[#ffffff]/60">Aucun résultat trouvé</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
