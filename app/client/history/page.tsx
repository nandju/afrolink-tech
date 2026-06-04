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
    <div className="flex min-h-screen bg-[#FAFAFA]">
      <ClientSidebar />
      
      <main className="ml-64 flex-1 p-8">
        <div className="mx-auto max-w-7xl">
          {/* Header */}
          <div className="mb-8">
            <h1 className="font-heading text-4xl font-bold text-[#1E1E1E] mb-2">
              Historique des certificats
            </h1>
            <p className="text-[#6B7280]">
              Consultez et téléchargez vos générations précédentes
            </p>
          </div>

          {/* Search and Filters */}
          <Card className="mb-6 border-[#E5E7EB] bg-white shadow-sm">
            <CardContent className="p-6">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-[#6B7280]" />
                  <Input
                    type="text"
                    placeholder="Rechercher par nom..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 border-[#E5E7EB] focus:border-[#D68C2D] focus:ring-[#D68C2D] placeholder:text-[#6B7280]"
                  />
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" className="border-[#E5E7EB] text-[#1E1E1E] hover:bg-[#FAFAFA]">
                    <Filter className="mr-2 h-4 w-4" />
                    Filtrer
                  </Button>
                  <Button variant="outline" className="border-[#E5E7EB] text-[#1E1E1E] hover:bg-[#FAFAFA]">
                    <Calendar className="mr-2 h-4 w-4" />
                    Date
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Statistics */}
          <div className="grid gap-6 md:grid-cols-3 mb-6">
            <Card className="border-[#E5E7EB] bg-white shadow-sm transition-all hover:shadow-md">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-[#6B7280]">Total générations</p>
                    <p className="text-3xl font-bold text-[#1E1E1E] mt-1">{history.length}</p>
                  </div>
                  <div className="p-3 rounded-xl bg-[#D68C2D]/10">
                    <Download className="h-6 w-6 text-[#D68C2D]" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-[#E5E7EB] bg-white shadow-sm transition-all hover:shadow-md">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-[#6B7280]">Participants totaux</p>
                    <p className="text-3xl font-bold text-[#1E1E1E] mt-1">
                      {history.reduce((sum, item) => sum + item.participants, 0)}
                    </p>
                  </div>
                  <div className="p-3 rounded-xl bg-[#12A2AC]/10">
                    <Users className="h-6 w-6 text-[#12A2AC]" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-[#E5E7EB] bg-white shadow-sm transition-all hover:shadow-md">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-[#6B7280]">Emails envoyés</p>
                    <p className="text-3xl font-bold text-[#1E1E1E] mt-1">
                      {history.reduce((sum, item) => sum + item.emailsSent, 0)}
                    </p>
                  </div>
                  <div className="p-3 rounded-xl bg-[#10B981]/10">
                    <Mail className="h-6 w-6 text-[#10B981]" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* History Table */}
          <Card className="border-[#E5E7EB] bg-white shadow-sm">
            <CardHeader>
              <CardTitle className="font-heading text-2xl font-bold text-[#1E1E1E]">Générations récentes</CardTitle>
              <CardDescription className="text-[#6B7280]">
                {filteredHistory.length} résultat{filteredHistory.length > 1 ? "s" : ""}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-[#E5E7EB]">
                      <th className="pb-3 text-left text-sm font-semibold text-[#6B7280]">Date</th>
                      <th className="pb-3 text-left text-sm font-semibold text-[#6B7280]">Nom du certificat</th>
                      <th className="pb-3 text-left text-sm font-semibold text-[#6B7280]">Participants</th>
                      <th className="pb-3 text-left text-sm font-semibold text-[#6B7280]">Emails</th>
                      <th className="pb-3 text-left text-sm font-semibold text-[#6B7280]">Statut</th>
                      <th className="pb-3 text-left text-sm font-semibold text-[#6B7280]">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredHistory.map((item) => (
                      <tr key={item.id} className="border-b border-[#E5E7EB] hover:bg-[#FAFAFA] transition-colors">
                        <td className="py-4 text-sm text-[#6B7280]">
                          {new Date(item.date).toLocaleDateString("fr-FR")}
                        </td>
                        <td className="py-4 text-sm font-medium text-[#1E1E1E]">{item.name}</td>
                        <td className="py-4 text-sm text-[#6B7280]">
                          <div className="flex items-center gap-2">
                            <Users className="h-4 w-4 text-[#12A2AC]" />
                            {item.participants}
                          </div>
                        </td>
                        <td className="py-4 text-sm text-[#6B7280]">
                          <div className="flex items-center gap-2">
                            <Mail className="h-4 w-4 text-[#10B981]" />
                            {item.emailsSent}/{item.participants}
                          </div>
                        </td>
                        <td className="py-4">
                          <div className="flex items-center gap-2">
                            {getStatusIcon(item.status)}
                            <span className="text-sm text-[#6B7280]">{getStatusLabel(item.status)}</span>
                          </div>
                        </td>
                        <td className="py-4">
                          <Button
                            size="sm"
                            className="bg-[#D68C2D] text-white hover:bg-[#D68C2D]/90"
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
                  <p className="text-[#6B7280]">Aucun résultat trouvé</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
