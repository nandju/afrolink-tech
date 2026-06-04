"use client"

import { AdminSidebar } from "@/components/ui/admin-sidebar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { PlaceholderImage } from "@/components/ui/placeholder-image"
import { TrendingUp, Users, FileText, Mail, DollarSign, Activity } from "lucide-react"

export default function AdminAnalyticsPage() {
  return (
    <div className="flex min-h-screen bg-[#FAFAFA]">
      <AdminSidebar />
      
      <main className="ml-64 flex-1 p-8">
        <div className="mx-auto max-w-7xl">
          {/* Header */}
          <div className="mb-8">
            <h1 className="font-heading text-3xl font-bold text-[#1E1E1E]">Statistiques</h1>
            <p className="mt-1 text-[#6B7280]">Analyse des performances de la plateforme</p>
          </div>

          {/* KPIs */}
          <div className="mb-8 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <Card className="border-[#E5E7EB] bg-white shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-[#6B7280]">Croissance</p>
                    <p className="mt-2 font-heading text-3xl font-bold text-[#10B981]">+23%</p>
                    <p className="mt-1 text-xs text-[#6B7280]">vs mois dernier</p>
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
                    <p className="text-sm font-medium text-[#6B7280]">Utilisateurs actifs</p>
                    <p className="mt-2 font-heading text-3xl font-bold text-[#D68C2D]">892</p>
                    <p className="mt-1 text-xs text-[#6B7280]">ce mois</p>
                  </div>
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#D68C2D]/10">
                    <Users className="h-6 w-6 text-[#D68C2D]" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-[#E5E7EB] bg-white shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-[#6B7280]">Certificats</p>
                    <p className="mt-2 font-heading text-3xl font-bold text-[#12A2AC]">5,678</p>
                    <p className="mt-1 text-xs text-[#6B7280]">générés</p>
                  </div>
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#12A2AC]/10">
                    <FileText className="h-6 w-6 text-[#12A2AC]" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-[#E5E7EB] bg-white shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-[#6B7280]">Revenus</p>
                    <p className="mt-2 font-heading text-3xl font-bold text-[#10B981]">2.4M</p>
                    <p className="mt-1 text-xs text-[#6B7280]">FCFA</p>
                  </div>
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#10B981]/10">
                    <DollarSign className="h-6 w-6 text-[#10B981]" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Charts Row 1 */}
          <div className="mb-8 grid gap-6 lg:grid-cols-2">
            <Card className="border-[#E5E7EB] bg-white shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-[#1E1E1E]">
                  Utilisateurs par mois
                </CardTitle>
              </CardHeader>
              <CardContent>
                <PlaceholderImage aspectRatio="video" text="Chart: Utilisateurs mensuels" className="h-64" />
              </CardContent>
            </Card>

            <Card className="border-[#E5E7EB] bg-white shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-[#1E1E1E]">
                  Certificats générés
                </CardTitle>
              </CardHeader>
              <CardContent>
                <PlaceholderImage aspectRatio="video" text="Chart: Certificats par mois" className="h-64" />
              </CardContent>
            </Card>
          </div>

          {/* Charts Row 2 */}
          <div className="mb-8 grid gap-6 lg:grid-cols-2">
            <Card className="border-[#E5E7EB] bg-white shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-[#1E1E1E]">
                  Revenus mensuels
                </CardTitle>
              </CardHeader>
              <CardContent>
                <PlaceholderImage aspectRatio="video" text="Chart: Revenus" className="h-64" />
              </CardContent>
            </Card>

            <Card className="border-[#E5E7EB] bg-white shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-[#1E1E1E]">
                  Taux de conversion
                </CardTitle>
              </CardHeader>
              <CardContent>
                <PlaceholderImage aspectRatio="video" text="Chart: Conversion" className="h-64" />
              </CardContent>
            </Card>
          </div>

          {/* Activity Feed */}
          <Card className="border-[#E5E7EB] bg-white shadow-sm">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-semibold text-[#1E1E1E]">
                  Activité récente
                </CardTitle>
                <Activity className="h-5 w-5 text-[#6B7280]" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { user: "Marie Dubois", action: "a généré 45 certificats", time: "Il y a 5 min", type: "success" },
                  { user: "Jean Martin", action: "a acheté 100 crédits", time: "Il y a 12 min", type: "purchase" },
                  { user: "Sophie Laurent", action: "s'est inscrit", time: "Il y a 23 min", type: "new" },
                  { user: "Pierre Durand", action: "a envoyé 30 emails", time: "Il y a 1h", type: "email" },
                  { user: "Claire Bernard", action: "a créé un ticket support", time: "Il y a 2h", type: "support" },
                ].map((activity, index) => (
                  <div key={index} className="flex items-start gap-4 rounded-lg border border-[#E5E7EB] p-4 transition-colors hover:bg-[#FAFAFA]">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-[#D68C2D] to-[#12A2AC] font-heading text-sm font-bold text-white">
                      {activity.user.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-[#1E1E1E]">
                        <span className="font-semibold">{activity.user}</span> {activity.action}
                      </p>
                      <p className="mt-1 text-xs text-[#6B7280]">{activity.time}</p>
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
