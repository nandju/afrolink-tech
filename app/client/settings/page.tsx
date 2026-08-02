"use client"

import { useState } from "react"
import { ClientLayout } from "@/components/ui/client-layout"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { User, Building, Bell, Lock, Phone, Save } from "lucide-react"
import { toast } from "sonner"

export default function SettingsPage() {
  const [profileData, setProfileData] = useState({
    name: "Jean Dupont",
    email: "jean.dupont@example.com",
    phone: "+225 XX XX XX XX",
    company: "Mon Entreprise",
    position: "Formateur",
  })

  const [passwordData, setPasswordData] = useState({
    current: "",
    new: "",
    confirm: "",
  })

  const [notifications, setNotifications] = useState({
    emailCertificates: true,
    emailCredits: true,
    emailNews: false,
  })

  const handleProfileUpdate = (e: React.FormEvent) => {
    e.preventDefault()
    toast.success("Profil mis à jour avec succès !")
  }

  const handlePasswordUpdate = (e: React.FormEvent) => {
    e.preventDefault()
    if (passwordData.new !== passwordData.confirm) {
      toast.error("Les mots de passe ne correspondent pas")
      return
    }
    toast.success("Mot de passe modifié avec succès !")
    setPasswordData({ current: "", new: "", confirm: "" })
  }

  const handleNotificationsUpdate = () => {
    toast.success("Préférences de notifications mises à jour !")
  }

  return (
    <ClientLayout>
      <div className="mx-auto max-w-4xl">
          {/* Header */}
          <div className="mb-8">
            <h1 className="font-heading text-4xl font-bold text-[#1E1E1E] mb-2">
              Paramètres
            </h1>
            <p className="text-[#6B7280]">
              Gérez vos informations personnelles et préférences
            </p>
          </div>

          {/* Profile Settings */}
          <Card className="border-[#E5E7EB] bg-white shadow-sm mb-6">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-[#D68C2D]/10">
                  <User className="h-5 w-5 text-[#D68C2D]" />
                </div>
                <div>
                  <CardTitle className="text-[#1E1E1E]">Informations personnelles</CardTitle>
                  <CardDescription className="text-[#6B7280]">
                    Mettez à jour vos informations de profil
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleProfileUpdate} className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-[#1E1E1E]">Nom complet</Label>
                    <Input
                      id="name"
                      value={profileData.name}
                      onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                      className="rounded-xl border-[#E5E7EB]"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-[#1E1E1E]">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={profileData.email}
                      onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                      className="rounded-xl border-[#E5E7EB]"
                    />
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-[#1E1E1E]">Téléphone</Label>
                    <Input
                      id="phone"
                      value={profileData.phone}
                      onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                      className="rounded-xl border-[#E5E7EB]"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="position" className="text-[#1E1E1E]">Poste</Label>
                    <Input
                      id="position"
                      value={profileData.position}
                      onChange={(e) => setProfileData({ ...profileData, position: e.target.value })}
                      className="rounded-xl border-[#E5E7EB]"
                    />
                  </div>
                </div>

                <Button type="submit" className="rounded-xl bg-[#D68C2D] text-white hover:bg-[#D68C2D]/90">
                  <Save className="mr-2 h-4 w-4" />
                  Enregistrer les modifications
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Company Settings */}
          <Card className="border-[#E5E7EB] bg-white shadow-sm mb-6">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-[#12A2AC]/10">
                  <Building className="h-5 w-5 text-[#12A2AC]" />
                </div>
                <div>
                  <CardTitle className="text-[#1E1E1E]">Informations entreprise</CardTitle>
                  <CardDescription className="text-[#6B7280]">
                    Informations sur votre organisation
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="company" className="text-[#1E1E1E]">Nom de l'entreprise</Label>
                  <Input
                    id="company"
                    value={profileData.company}
                    onChange={(e) => setProfileData({ ...profileData, company: e.target.value })}
                    className="rounded-xl border-[#E5E7EB]"
                  />
                </div>
                <Button className="rounded-xl bg-[#D68C2D] text-white hover:bg-[#D68C2D]/90">
                  <Save className="mr-2 h-4 w-4" />
                  Enregistrer
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Password Settings */}
          <Card className="border-[#E5E7EB] bg-white shadow-sm mb-6">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-[#EF4444]/10">
                  <Lock className="h-5 w-5 text-[#EF4444]" />
                </div>
                <div>
                  <CardTitle className="text-[#1E1E1E]">Sécurité</CardTitle>
                  <CardDescription className="text-[#6B7280]">
                    Modifiez votre mot de passe
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <form onSubmit={handlePasswordUpdate} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="current-password" className="text-[#1E1E1E]">Mot de passe actuel</Label>
                  <Input
                    id="current-password"
                    type="password"
                    value={passwordData.current}
                    onChange={(e) => setPasswordData({ ...passwordData, current: e.target.value })}
                    className="rounded-xl border-[#E5E7EB]"
                  />
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="new-password" className="text-[#1E1E1E]">Nouveau mot de passe</Label>
                    <Input
                      id="new-password"
                      type="password"
                      value={passwordData.new}
                      onChange={(e) => setPasswordData({ ...passwordData, new: e.target.value })}
                      className="rounded-xl border-[#E5E7EB]"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirm-password" className="text-[#1E1E1E]">Confirmer le mot de passe</Label>
                    <Input
                      id="confirm-password"
                      type="password"
                      value={passwordData.confirm}
                      onChange={(e) => setPasswordData({ ...passwordData, confirm: e.target.value })}
                      className="rounded-xl border-[#E5E7EB]"
                    />
                  </div>
                </div>
                <Button type="submit" className="rounded-xl bg-[#D68C2D] text-white hover:bg-[#D68C2D]/90">
                  <Lock className="mr-2 h-4 w-4" />
                  Modifier le mot de passe
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Notification Settings */}
          <Card className="border-[#E5E7EB] bg-white shadow-sm">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-[#F59E0B]/10">
                  <Bell className="h-5 w-5 text-[#F59E0B]" />
                </div>
                <div>
                  <CardTitle className="text-[#1E1E1E]">Notifications</CardTitle>
                  <CardDescription className="text-[#6B7280]">
                    Gérez vos préférences de notifications
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 rounded-lg border border-[#E5E7EB] bg-[#FAFAFA]">
                  <div>
                    <p className="font-medium text-[#1E1E1E]">Notifications de certificats</p>
                    <p className="text-sm text-[#6B7280]">Recevoir un email après chaque génération</p>
                  </div>
                  <button
                    onClick={() => setNotifications({ ...notifications, emailCertificates: !notifications.emailCertificates })}
                    className={`relative h-6 w-11 rounded-full transition-colors ${
                      notifications.emailCertificates ? "bg-[#D68C2D]" : "bg-[#E5E7EB]"
                    }`}
                  >
                    <span
                      className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white transition-transform ${
                        notifications.emailCertificates ? "translate-x-5" : ""
                      }`}
                    />
                  </button>
                </div>

                <div className="flex items-center justify-between p-4 rounded-lg border border-[#E5E7EB] bg-[#FAFAFA]">
                  <div>
                    <p className="font-medium text-[#1E1E1E]">Alertes de crédits</p>
                    <p className="text-sm text-[#6B7280]">Être notifié quand vos crédits sont faibles</p>
                  </div>
                  <button
                    onClick={() => setNotifications({ ...notifications, emailCredits: !notifications.emailCredits })}
                    className={`relative h-6 w-11 rounded-full transition-colors ${
                      notifications.emailCredits ? "bg-[#D68C2D]" : "bg-[#E5E7EB]"
                    }`}
                  >
                    <span
                      className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white transition-transform ${
                        notifications.emailCredits ? "translate-x-5" : ""
                      }`}
                    />
                  </button>
                </div>

                <div className="flex items-center justify-between p-4 rounded-lg border border-[#E5E7EB] bg-[#FAFAFA]">
                  <div>
                    <p className="font-medium text-[#1E1E1E]">Actualités et promotions</p>
                    <p className="text-sm text-[#6B7280]">Recevoir les nouveautés PROUV</p>
                  </div>
                  <button
                    onClick={() => setNotifications({ ...notifications, emailNews: !notifications.emailNews })}
                    className={`relative h-6 w-11 rounded-full transition-colors ${
                      notifications.emailNews ? "bg-[#D68C2D]" : "bg-[#E5E7EB]"
                    }`}
                  >
                    <span
                      className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white transition-transform ${
                        notifications.emailNews ? "translate-x-5" : ""
                      }`}
                    />
                  </button>
                </div>

                <Button onClick={handleNotificationsUpdate} className="rounded-xl bg-[#D68C2D] text-white hover:bg-[#D68C2D]/90">
                  <Save className="mr-2 h-4 w-4" />
                  Enregistrer les préférences
                </Button>
              </div>
            </CardContent>
          </Card>
      </div>
    </ClientLayout>
  )
}
