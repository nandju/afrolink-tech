"use client"

import { useState } from "react"
import { AdminSidebar } from "@/components/ui/admin-sidebar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Filter, MoreVertical, Mail, Ban, CheckCircle, XCircle } from "lucide-react"

type User = {
  id: string
  name: string
  email: string
  company: string
  credits: number
  certificates: number
  status: "active" | "inactive" | "suspended"
  joinDate: string
}

const mockUsers: User[] = [
  { id: "1", name: "Marie Dubois", email: "marie@techcorp.com", company: "TechCorp", credits: 450, certificates: 1234, status: "active", joinDate: "2024-01-15" },
  { id: "2", name: "Jean Martin", email: "jean@innovate.com", company: "InnovateCo", credits: 320, certificates: 987, status: "active", joinDate: "2024-01-10" },
  { id: "3", name: "Sophie Laurent", email: "sophie@eduplus.com", company: "EduPlus", credits: 180, certificates: 756, status: "active", joinDate: "2024-01-05" },
  { id: "4", name: "Pierre Durand", email: "pierre@forma.com", company: "FormaPro", credits: 50, certificates: 654, status: "inactive", joinDate: "2023-12-20" },
  { id: "5", name: "Claire Bernard", email: "claire@skillup.com", company: "SkillUp", credits: 0, certificates: 543, status: "suspended", joinDate: "2023-12-15" },
]

export default function AdminUsersPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [users] = useState<User[]>(mockUsers)

  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.company.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const getStatusBadge = (status: string) => {
    const styles = {
      active: "bg-[#10B981]/10 text-[#10B981] border-[#10B981]/20",
      inactive: "bg-[#6B7280]/10 text-[#6B7280] border-[#6B7280]/20",
      suspended: "bg-[#EF4444]/10 text-[#EF4444] border-[#EF4444]/20"
    }
    const labels = {
      active: "Actif",
      inactive: "Inactif",
      suspended: "Suspendu"
    }
    return (
      <span className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-medium ${styles[status as keyof typeof styles]}`}>
        {status === "active" && <CheckCircle className="h-3 w-3" />}
        {status === "inactive" && <XCircle className="h-3 w-3" />}
        {status === "suspended" && <Ban className="h-3 w-3" />}
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
              <h1 className="font-heading text-3xl font-bold text-[#1E1E1E]">
                Utilisateurs
              </h1>
              <p className="mt-1 text-[#6B7280]">
                Gérez les utilisateurs de la plateforme
              </p>
            </div>
            <Button className="rounded-xl bg-[#D68C2D] text-white shadow-lg shadow-[#D68C2D]/25 hover:bg-[#D68C2D]/90">
              Ajouter un utilisateur
            </Button>
          </div>

          {/* Stats */}
          <div className="mb-6 grid gap-6 md:grid-cols-4">
            <Card className="border-[#E5E7EB] bg-white shadow-sm">
              <CardContent className="p-6">
                <p className="text-sm font-medium text-[#6B7280]">Total utilisateurs</p>
                <p className="mt-2 font-heading text-3xl font-bold text-[#1E1E1E]">{users.length}</p>
              </CardContent>
            </Card>
            <Card className="border-[#E5E7EB] bg-white shadow-sm">
              <CardContent className="p-6">
                <p className="text-sm font-medium text-[#6B7280]">Actifs</p>
                <p className="mt-2 font-heading text-3xl font-bold text-[#10B981]">
                  {users.filter(u => u.status === "active").length}
                </p>
              </CardContent>
            </Card>
            <Card className="border-[#E5E7EB] bg-white shadow-sm">
              <CardContent className="p-6">
                <p className="text-sm font-medium text-[#6B7280]">Inactifs</p>
                <p className="mt-2 font-heading text-3xl font-bold text-[#6B7280]">
                  {users.filter(u => u.status === "inactive").length}
                </p>
              </CardContent>
            </Card>
            <Card className="border-[#E5E7EB] bg-white shadow-sm">
              <CardContent className="p-6">
                <p className="text-sm font-medium text-[#6B7280]">Suspendus</p>
                <p className="mt-2 font-heading text-3xl font-bold text-[#EF4444]">
                  {users.filter(u => u.status === "suspended").length}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Search & Filters */}
          <Card className="mb-6 border-[#E5E7EB] bg-white shadow-sm">
            <CardContent className="p-6">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-[#6B7280]" />
                  <Input
                    type="text"
                    placeholder="Rechercher par nom, email ou entreprise..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="h-10 rounded-xl border-[#E5E7EB] pl-10"
                  />
                </div>
                <Button variant="outline" className="rounded-xl border-[#E5E7EB]">
                  <Filter className="mr-2 h-4 w-4" />
                  Filtrer
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Users Table */}
          <Card className="border-[#E5E7EB] bg-white shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-[#1E1E1E]">
                {filteredUsers.length} utilisateur{filteredUsers.length > 1 ? "s" : ""}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-[#E5E7EB]">
                      <th className="pb-3 text-left text-sm font-semibold text-[#6B7280]">Utilisateur</th>
                      <th className="pb-3 text-left text-sm font-semibold text-[#6B7280]">Entreprise</th>
                      <th className="pb-3 text-left text-sm font-semibold text-[#6B7280]">Crédits</th>
                      <th className="pb-3 text-left text-sm font-semibold text-[#6B7280]">Certificats</th>
                      <th className="pb-3 text-left text-sm font-semibold text-[#6B7280]">Statut</th>
                      <th className="pb-3 text-left text-sm font-semibold text-[#6B7280]">Date</th>
                      <th className="pb-3 text-left text-sm font-semibold text-[#6B7280]">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map((user) => (
                      <tr key={user.id} className="border-b border-[#E5E7EB] transition-colors hover:bg-[#FAFAFA]">
                        <td className="py-4">
                          <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-[#D68C2D] to-[#12A2AC] font-heading text-sm font-bold text-white">
                              {user.name.split(' ').map(n => n[0]).join('')}
                            </div>
                            <div>
                              <p className="font-medium text-[#1E1E1E]">{user.name}</p>
                              <p className="text-sm text-[#6B7280]">{user.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 text-sm text-[#1E1E1E]">{user.company}</td>
                        <td className="py-4">
                          <span className="font-semibold text-[#D68C2D]">{user.credits}</span>
                        </td>
                        <td className="py-4 text-sm text-[#1E1E1E]">{user.certificates}</td>
                        <td className="py-4">{getStatusBadge(user.status)}</td>
                        <td className="py-4 text-sm text-[#6B7280]">
                          {new Date(user.joinDate).toLocaleDateString("fr-FR")}
                        </td>
                        <td className="py-4">
                          <div className="flex items-center gap-2">
                            <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                              <Mail className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </div>
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
