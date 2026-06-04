"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ClientSidebar } from "@/components/ui/client-sidebar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  FileText,
  CreditCard,
  Mail,
  Clock,
  TrendingUp,
  Plus,
  Download,
  Calendar,
  ArrowRight,
} from "lucide-react"

export default function ClientDashboard() {
  const router = useRouter()
  const [userName, setUserName] = useState("Utilisateur")

  useEffect(() => {
    if (typeof window !== "undefined") {
      const authenticated = sessionStorage.getItem("authenticated") === "true"
      if (!authenticated) {
        router.push("/login")
      }
    }
  }, [router])

  // Mock data - replace with real data from API
  const stats = {
    certificatesGenerated: 247,
    remainingCredits: 1850,
    emailsSent: 189,
    totalHistory: 32,
  }

  const recentActivity = [
    {
      id: 1,
      action: "Certificats générés",
      details: "Formation Marketing Digital - 25 certificats",
      date: "Il y a 2 heures",
      icon: FileText,
    },
    {
      id: 2,
      action: "Crédits achetés",
      details: "Pack Premium - 1000 crédits",
      date: "Il y a 1 jour",
      icon: CreditCard,
    },
    {
      id: 3,
      action: "Emails envoyés",
      details: "Webinaire Leadership - 18 participants",
      date: "Il y a 3 jours",
      icon: Mail,
    },
  ]

  const latestCertificates = [
    {
      id: 1,
      name: "Formation Marketing Digital",
      participants: 25,
      date: "2026-06-04",
      status: "completed",
    },
    {
      id: 2,
      name: "Webinaire Leadership",
      participants: 18,
      date: "2026-06-01",
      status: "completed",
    },
    {
      id: 3,
      name: "Atelier Innovation",
      participants: 32,
      date: "2026-05-28",
      status: "completed",
    },
  ]

  return (
    <div className="flex min-h-screen bg-[#FAFAFA]">
      <ClientSidebar />

      <main className="ml-64 flex-1 p-8">
        <div className="mx-auto max-w-7xl">
          {/* Header */}
          <div className="mb-8">
            <h1 className="font-heading text-4xl font-bold text-[#1E1E1E]">
              Bonjour, {userName} 👋
            </h1>
            <p className="mt-2 text-lg text-[#6B7280]">
              Gérez vos certificats et vos crédits en toute simplicité.
            </p>
          </div>

          {/* KPI Cards */}
          <div className="mb-8 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <Card className="border-[#E5E7EB] bg-white shadow-sm transition-all hover:shadow-md">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-[#6B7280]">
                  Certificats générés
                </CardTitle>
                <FileText className="h-5 w-5 text-[#D68C2D]" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-[#1E1E1E]">
                  {stats.certificatesGenerated}
                </div>
                <p className="mt-1 flex items-center text-xs text-[#12A2AC]">
                  <TrendingUp className="mr-1 h-3 w-3" />
                  +12% ce mois
                </p>
              </CardContent>
            </Card>

            <Card className="border-[#E5E7EB] bg-white shadow-sm transition-all hover:shadow-md">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-[#6B7280]">
                  Crédits restants
                </CardTitle>
                <CreditCard className="h-5 w-5 text-[#D68C2D]" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-[#1E1E1E]">
                  {stats.remainingCredits}
                </div>
                <p className="mt-1 text-xs text-[#6B7280]">
                  1 crédit = 1 certificat
                </p>
              </CardContent>
            </Card>

            <Card className="border-[#E5E7EB] bg-white shadow-sm transition-all hover:shadow-md">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-[#6B7280]">
                  Emails envoyés
                </CardTitle>
                <Mail className="h-5 w-5 text-[#D68C2D]" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-[#1E1E1E]">
                  {stats.emailsSent}
                </div>
                <p className="mt-1 text-xs text-[#6B7280]">
                  Envoi automatique activé
                </p>
              </CardContent>
            </Card>

            <Card className="border-[#E5E7EB] bg-white shadow-sm transition-all hover:shadow-md">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-[#6B7280]">
                  Total historique
                </CardTitle>
                <Clock className="h-5 w-5 text-[#D68C2D]" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-[#1E1E1E]">
                  {stats.totalHistory}
                </div>
                <p className="mt-1 text-xs text-[#6B7280]">
                  Générations réussies
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Main Action Button */}
          <Card className="mb-8 border-[#D68C2D] bg-gradient-to-br from-[#D68C2D] to-[#12A2AC] shadow-lg">
            <CardContent className="p-8">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-heading text-2xl font-bold text-white">
                    Créer un nouveau certificat
                  </h2>
                  <p className="mt-2 text-white/90">
                    Importez votre PDF, configurez vos champs et générez vos certificats en quelques clics
                  </p>
                </div>
                <Button
                  onClick={() => router.push("/dashboard")}
                  size="lg"
                  className="group h-14 bg-white px-8 text-lg font-semibold text-[#D68C2D] shadow-xl hover:bg-white/95"
                >
                  <Plus className="mr-2 h-6 w-6" />
                  Générer des certificats
                  <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Button>
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-8 lg:grid-cols-2">
            {/* Recent Activity */}
            <Card className="border-[#E5E7EB] bg-white shadow-sm">
              <CardHeader>
                <CardTitle className="font-heading text-xl font-bold text-[#1E1E1E]">
                  Activité récente
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivity.map((activity) => {
                    const Icon = activity.icon
                    return (
                      <div
                        key={activity.id}
                        className="flex items-start gap-4 rounded-xl border border-[#E5E7EB] bg-[#FAFAFA] p-4 transition-all hover:border-[#D68C2D]/30"
                      >
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#D68C2D]/10">
                          <Icon className="h-5 w-5 text-[#D68C2D]" />
                        </div>
                        <div className="flex-1">
                          <p className="font-semibold text-[#1E1E1E]">
                            {activity.action}
                          </p>
                          <p className="mt-1 text-sm text-[#6B7280]">
                            {activity.details}
                          </p>
                          <p className="mt-2 flex items-center text-xs text-[#6B7280]">
                            <Clock className="mr-1 h-3 w-3" />
                            {activity.date}
                          </p>
                        </div>
                      </div>
                    )
                  })}
                </div>
                <Button
                  variant="outline"
                  className="mt-6 w-full border-[#E5E7EB] hover:border-[#D68C2D]/30"
                  onClick={() => router.push("/client/history")}
                >
                  Voir tout l'historique
                </Button>
              </CardContent>
            </Card>

            {/* Latest Certificates */}
            <Card className="border-[#E5E7EB] bg-white shadow-sm">
              <CardHeader>
                <CardTitle className="font-heading text-xl font-bold text-[#1E1E1E]">
                  Derniers certificats
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {latestCertificates.map((cert) => (
                    <div
                      key={cert.id}
                      className="flex items-center justify-between rounded-xl border border-[#E5E7EB] bg-[#FAFAFA] p-4 transition-all hover:border-[#D68C2D]/30"
                    >
                      <div className="flex-1">
                        <p className="font-semibold text-[#1E1E1E]">
                          {cert.name}
                        </p>
                        <div className="mt-2 flex items-center gap-4 text-xs text-[#6B7280]">
                          <span className="flex items-center">
                            <FileText className="mr-1 h-3 w-3" />
                            {cert.participants} participants
                          </span>
                          <span className="flex items-center">
                            <Calendar className="mr-1 h-3 w-3" />
                            {cert.date}
                          </span>
                        </div>
                      </div>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-[#D68C2D] hover:bg-[#D68C2D]/10"
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
                <Button
                  variant="outline"
                  className="mt-6 w-full border-[#E5E7EB] hover:border-[#D68C2D]/30"
                  onClick={() => router.push("/client/history")}
                >
                  Voir tous les certificats
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
