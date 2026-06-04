"use client"

import { useState } from "react"
import { AdminSidebar } from "@/components/ui/admin-sidebar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Settings, Mail, Bell, Shield, Save } from "lucide-react"
import { toast } from "sonner"

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState({
    siteName: "PROUV",
    siteEmail: "contact@prouv.com",
    supportEmail: "support@prouv.com",
    defaultCredits: "20",
    emailNotifications: true,
    maintenanceMode: false,
    allowRegistration: true,
  })

  const handleSave = () => {
    toast.success("Paramètres enregistrés avec succès !")
  }

  return (
    <div className="flex min-h-screen bg-[#FAFAFA]">
      <AdminSidebar />
      
      <main className="ml-64 flex-1 p-8">
        <div className="mx-auto max-w-4xl">
          {/* Header */}
          <div className="mb-8">
            <h1 className="font-heading text-3xl font-bold text-[#1E1E1E]">Paramètres</h1>
            <p className="mt-1 text-[#6B7280]">Configuration de la plateforme</p>
          </div>

          {/* General Settings */}
          <Card className="mb-6 border-[#E5E7EB] bg-white shadow-sm">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#D68C2D]/10">
                  <Settings className="h-5 w-5 text-[#D68C2D]" />
                </div>
                <CardTitle className="text-lg font-semibold text-[#1E1E1E]">Paramètres généraux</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="siteName" className="text-sm font-medium text-[#1E1E1E]">
                  Nom du site
                </Label>
                <Input
                  id="siteName"
                  value={settings.siteName}
                  onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
                  className="h-10 rounded-xl border-[#E5E7EB]"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="defaultCredits" className="text-sm font-medium text-[#1E1E1E]">
                  Crédits offerts à l'inscription
                </Label>
                <Input
                  id="defaultCredits"
                  type="number"
                  value={settings.defaultCredits}
                  onChange={(e) => setSettings({ ...settings, defaultCredits: e.target.value })}
                  className="h-10 rounded-xl border-[#E5E7EB]"
                />
              </div>
            </CardContent>
          </Card>

          {/* Email Settings */}
          <Card className="mb-6 border-[#E5E7EB] bg-white shadow-sm">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#12A2AC]/10">
                  <Mail className="h-5 w-5 text-[#12A2AC]" />
                </div>
                <CardTitle className="text-lg font-semibold text-[#1E1E1E]">Configuration Email</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="siteEmail" className="text-sm font-medium text-[#1E1E1E]">
                  Email principal
                </Label>
                <Input
                  id="siteEmail"
                  type="email"
                  value={settings.siteEmail}
                  onChange={(e) => setSettings({ ...settings, siteEmail: e.target.value })}
                  className="h-10 rounded-xl border-[#E5E7EB]"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="supportEmail" className="text-sm font-medium text-[#1E1E1E]">
                  Email support
                </Label>
                <Input
                  id="supportEmail"
                  type="email"
                  value={settings.supportEmail}
                  onChange={(e) => setSettings({ ...settings, supportEmail: e.target.value })}
                  className="h-10 rounded-xl border-[#E5E7EB]"
                />
              </div>
            </CardContent>
          </Card>

          {/* System Settings */}
          <Card className="mb-6 border-[#E5E7EB] bg-white shadow-sm">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#10B981]/10">
                  <Shield className="h-5 w-5 text-[#10B981]" />
                </div>
                <CardTitle className="text-lg font-semibold text-[#1E1E1E]">Système</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between rounded-xl border border-[#E5E7EB] p-4">
                <div>
                  <p className="font-medium text-[#1E1E1E]">Notifications email</p>
                  <p className="text-sm text-[#6B7280]">Recevoir les notifications par email</p>
                </div>
                <button
                  onClick={() => setSettings({ ...settings, emailNotifications: !settings.emailNotifications })}
                  className={`relative h-6 w-11 rounded-full transition-colors ${
                    settings.emailNotifications ? "bg-[#D68C2D]" : "bg-[#E5E7EB]"
                  }`}
                >
                  <span
                    className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white transition-transform ${
                      settings.emailNotifications ? "translate-x-5" : ""
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between rounded-xl border border-[#E5E7EB] p-4">
                <div>
                  <p className="font-medium text-[#1E1E1E]">Autoriser les inscriptions</p>
                  <p className="text-sm text-[#6B7280]">Permettre aux nouveaux utilisateurs de s'inscrire</p>
                </div>
                <button
                  onClick={() => setSettings({ ...settings, allowRegistration: !settings.allowRegistration })}
                  className={`relative h-6 w-11 rounded-full transition-colors ${
                    settings.allowRegistration ? "bg-[#D68C2D]" : "bg-[#E5E7EB]"
                  }`}
                >
                  <span
                    className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white transition-transform ${
                      settings.allowRegistration ? "translate-x-5" : ""
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between rounded-xl border border-[#EF4444]/20 bg-[#EF4444]/5 p-4">
                <div>
                  <p className="font-medium text-[#1E1E1E]">Mode maintenance</p>
                  <p className="text-sm text-[#6B7280]">Désactiver temporairement la plateforme</p>
                </div>
                <button
                  onClick={() => setSettings({ ...settings, maintenanceMode: !settings.maintenanceMode })}
                  className={`relative h-6 w-11 rounded-full transition-colors ${
                    settings.maintenanceMode ? "bg-[#EF4444]" : "bg-[#E5E7EB]"
                  }`}
                >
                  <span
                    className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white transition-transform ${
                      settings.maintenanceMode ? "translate-x-5" : ""
                    }`}
                  />
                </button>
              </div>
            </CardContent>
          </Card>

          {/* Save Button */}
          <Button
            onClick={handleSave}
            className="h-12 w-full rounded-xl bg-[#D68C2D] text-base font-semibold text-white shadow-lg shadow-[#D68C2D]/25 hover:bg-[#D68C2D]/90"
          >
            <Save className="mr-2 h-5 w-5" />
            Enregistrer les modifications
          </Button>
        </div>
      </main>
    </div>
  )
}
