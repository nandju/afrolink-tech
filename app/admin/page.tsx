"use client"

import { AdminSidebar } from "@/components/ui/admin-sidebar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, FileText, Mail, CreditCard, TrendingUp, Activity } from "lucide-react"
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart"
import { AreaChart, Area, BarChart, Bar, CartesianGrid, XAxis } from "recharts"

const certificatesMonthlyData = [
  { month: "Août", certificates: 320 },
  { month: "Sept", certificates: 410 },
  { month: "Oct", certificates: 480 },
  { month: "Nov", certificates: 560 },
  { month: "Déc", certificates: 690 },
  { month: "Janv", certificates: 830 },
]

const revenueMonthlyData = [
  { month: "Août", revenue: 1200000 },
  { month: "Sept", revenue: 1450000 },
  { month: "Oct", revenue: 1680000 },
  { month: "Nov", revenue: 1950000 },
  { month: "Déc", revenue: 2150000 },
  { month: "Janv", revenue: 2400000 },
]

const certificatesChartConfig = {
  certificates: { label: "Certificats", color: "#D68C2D" },
} satisfies ChartConfig

const revenueChartConfig = {
  revenue: { label: "Revenus (FCFA)", color: "#12A2AC" },
} satisfies ChartConfig

const stats = [
  { label: "Utilisateurs", value: "1,234", change: "+12%", icon: Users, color: "text-[#D68C2D]", bgColor: "bg-[#D68C2D]/10" },
  { label: "Certificats", value: "5,678", change: "+23%", icon: FileText, color: "text-[#12A2AC]", bgColor: "bg-[#12A2AC]/10" },
  { label: "Emails envoyés", value: "3,456", change: "+18%", icon: Mail, color: "text-[#10B981]", bgColor: "bg-[#10B981]/10" },
  { label: "Crédits vendus", value: "89,234", change: "+31%", icon: CreditCard, color: "text-[#F59E0B]", bgColor: "bg-[#F59E0B]/10" },
]

const recentActivity = [
  { user: "Marie Dubois", action: "a généré 45 certificats", time: "Il y a 5 min", type: "success" },
  { user: "Jean Martin", action: "a acheté 100 crédits", time: "Il y a 12 min", type: "purchase" },
  { user: "Sophie Laurent", action: "s'est inscrit", time: "Il y a 23 min", type: "new" },
  { user: "Pierre Durand", action: "a envoyé 30 emails", time: "Il y a 1h", type: "email" },
  { user: "Claire Bernard", action: "a créé un ticket support", time: "Il y a 2h", type: "support" },
]

export default function AdminDashboard() {
  return (
    <div className="flex min-h-screen bg-[#FAFAFA]">
      <AdminSidebar />
      
      <main className="ml-64 flex-1 p-8">
        <div className="mx-auto max-w-7xl">
          {/* Header */}
          <div className="mb-8">
            <h1 className="font-heading text-3xl font-bold text-[#1E1E1E]">
              Dashboard Admin
            </h1>
            <p className="mt-1 text-[#6B7280]">
              Vue d'ensemble de la plateforme PROUV
            </p>
          </div>

          {/* Stats Grid */}
          <div className="mb-8 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat) => {
              const Icon = stat.icon
              return (
                <Card key={stat.label} className="border-[#E5E7EB] bg-white shadow-sm transition-shadow hover:shadow-md">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-[#6B7280]">{stat.label}</p>
                        <p className="mt-2 font-heading text-3xl font-bold text-[#1E1E1E]">{stat.value}</p>
                        <p className="mt-1 text-sm font-medium text-[#10B981]">{stat.change} ce mois</p>
                      </div>
                      <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${stat.bgColor}`}>
                        <Icon className={`h-6 w-6 ${stat.color}`} />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>

          {/* Charts Row */}
          <div className="mb-8 grid gap-6 lg:grid-cols-2">
            <Card className="border-[#E5E7EB] bg-white shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-[#1E1E1E]">Certificats générés</CardTitle>
              </CardHeader>
              <CardContent>
                <ChartContainer config={certificatesChartConfig} className="h-64 w-full">
                  <AreaChart data={certificatesMonthlyData} margin={{ left: 0, right: 12 }}>
                    <CartesianGrid vertical={false} />
                    <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={8} />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Area dataKey="certificates" type="monotone" fill="var(--color-certificates)" fillOpacity={0.2} stroke="var(--color-certificates)" strokeWidth={2} />
                  </AreaChart>
                </ChartContainer>
              </CardContent>
            </Card>

            <Card className="border-[#E5E7EB] bg-white shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-[#1E1E1E]">Revenus</CardTitle>
              </CardHeader>
              <CardContent>
                <ChartContainer config={revenueChartConfig} className="h-64 w-full">
                  <BarChart data={revenueMonthlyData} margin={{ left: 0, right: 12 }}>
                    <CartesianGrid vertical={false} />
                    <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={8} />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="revenue" fill="var(--color-revenue)" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ChartContainer>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity & Top Users */}
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Recent Activity */}
            <Card className="border-[#E5E7EB] bg-white shadow-sm">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg font-semibold text-[#1E1E1E]">Activité récente</CardTitle>
                  <Activity className="h-5 w-5 text-[#6B7280]" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivity.map((activity, index) => (
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

            {/* Top Users */}
            <Card className="border-[#E5E7EB] bg-white shadow-sm">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg font-semibold text-[#1E1E1E]">Top utilisateurs</CardTitle>
                  <TrendingUp className="h-5 w-5 text-[#6B7280]" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { name: "TechCorp", certificates: 1234, credits: 5000 },
                    { name: "InnovateCo", certificates: 987, credits: 3500 },
                    { name: "EduPlus", certificates: 756, credits: 2800 },
                    { name: "FormaPro", certificates: 654, credits: 2200 },
                    { name: "SkillUp", certificates: 543, credits: 1900 },
                  ].map((user, index) => (
                    <div key={index} className="flex items-center justify-between rounded-lg border border-[#E5E7EB] p-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#D68C2D]/10 font-heading text-sm font-bold text-[#D68C2D]">
                          #{index + 1}
                        </div>
                        <div>
                          <p className="font-semibold text-[#1E1E1E]">{user.name}</p>
                          <p className="text-xs text-[#6B7280]">{user.certificates} certificats</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-[#1E1E1E]">{user.credits}</p>
                        <p className="text-xs text-[#6B7280]">crédits</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
