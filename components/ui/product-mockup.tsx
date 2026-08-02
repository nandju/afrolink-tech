"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  MousePointer2,
  ShieldCheck,
  Wallet,
  CheckCircle2,
  Search,
  Download,
  Mail,
  Users,
  FileText,
  Bell,
  ChevronRight,
  CircleDot,
  ArrowUpRight,
  TrendingUp,
  QrCode,
} from "lucide-react"

type MockupView = "dashboard" | "editor" | "verification" | "wallet"

interface ProductMockupProps {
  view: MockupView
  className?: string
}

function BrowserFrame({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn("overflow-hidden rounded-2xl border border-[#E5E7EB] bg-white shadow-2xl shadow-[#1E1E1E]/10", className)}>
      {/* Top bar */}
      <div className="flex items-center gap-2 border-b border-[#E5E7EB] bg-[#FAFAFA] px-4 py-3">
        <div className="flex gap-1.5">
          <div className="h-3 w-3 rounded-full bg-[#EF4444]/80" />
          <div className="h-3 w-3 rounded-full bg-[#F59E0B]/80" />
          <div className="h-3 w-3 rounded-full bg-[#10B981]/80" />
        </div>
        <div className="mx-auto flex items-center gap-2 rounded-lg bg-white px-4 py-1.5 text-xs text-[#6B7280] border border-[#E5E7EB]">
          <CircleDot className="h-3 w-3 text-[#10B981]" />
          app.prouv.com/dashboard
        </div>
      </div>
      {children}
    </div>
  )
}

function DashboardMockup() {
  return (
    <div className="flex h-[420px]">
      {/* Sidebar */}
      <div className="flex w-14 flex-col items-center gap-4 border-r border-[#E5E7EB] bg-[#FAFAFA] py-4">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#D68C2D]">
          <span className="text-xs font-bold text-white">P</span>
        </div>
        <LayoutDashboard className="h-5 w-5 text-[#D68C2D]" />
        <FileText className="h-5 w-5 text-[#6B7280]" />
        <Users className="h-5 w-5 text-[#6B7280]" />
        <Wallet className="h-5 w-5 text-[#6B7280]" />
        <TrendingUp className="h-5 w-5 text-[#6B7280]" />
      </div>
      {/* Main content */}
      <div className="flex-1 overflow-hidden p-5">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <div className="text-sm font-bold text-[#1E1E1E]">Tableau de bord</div>
            <div className="text-xs text-[#6B7280]">Vue d'ensemble de vos certificats</div>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#D68C2D]/10">
              <Bell className="h-3.5 w-3.5 text-[#D68C2D]" />
            </div>
            <div className="h-7 w-7 rounded-full bg-gradient-to-br from-[#D68C2D] to-[#12A2AC]" />
          </div>
        </div>
        {/* Stats cards */}
        <div className="mb-4 grid grid-cols-3 gap-3">
          {[
            { label: "Certificats", value: "1 248", icon: FileText, color: "text-[#D68C2D]", bg: "bg-[#D68C2D]/10" },
            { label: "Participants", value: "1 205", icon: Users, color: "text-[#12A2AC]", bg: "bg-[#12A2AC]/10" },
            { label: "Vérifications", value: "342", icon: ShieldCheck, color: "text-[#10B981]", bg: "bg-[#10B981]/10" },
          ].map((stat) => (
            <div key={stat.label} className="rounded-xl border border-[#E5E7EB] bg-white p-3">
              <div className={cn("mb-2 flex h-7 w-7 items-center justify-center rounded-lg", stat.bg)}>
                <stat.icon className={cn("h-3.5 w-3.5", stat.color)} />
              </div>
              <div className="text-lg font-bold text-[#1E1E1E]">{stat.value}</div>
              <div className="text-[10px] text-[#6B7280]">{stat.label}</div>
            </div>
          ))}
        </div>
        {/* Chart placeholder + recent activity */}
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-xl border border-[#E5E7EB] bg-white p-3">
            <div className="mb-3 text-xs font-semibold text-[#1E1E1E]">Évolution mensuelle</div>
            <div className="flex h-24 items-end gap-1.5">
              {[40, 65, 45, 80, 55, 90, 70, 100, 75, 85, 60, 95].map((h, i) => (
                <div
                  key={i}
                  className="flex-1 rounded-t bg-gradient-to-t from-[#D68C2D]/40 to-[#D68C2D]"
                  style={{ height: `${h}%` }}
                />
              ))}
            </div>
          </div>
          <div className="rounded-xl border border-[#E5E7EB] bg-white p-3">
            <div className="mb-3 text-xs font-semibold text-[#1E1E1E]">Activité récente</div>
            <div className="space-y-2">
              {[
                { name: "Kouadio Jean-Marc", action: "Certificat généré", time: "Il y a 2 min" },
                { name: "Aminata Traoré", action: "Email envoyé", time: "Il y a 5 min" },
                { name: "Ibrahim Koné", action: "Vérification publique", time: "Il y a 12 min" },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-2">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-[#D68C2D] to-[#12A2AC] text-[8px] font-bold text-white">
                    {item.name.split(" ").map(n => n[0]).join("")}
                  </div>
                  <div className="flex-1 overflow-hidden">
                    <div className="truncate text-[10px] font-medium text-[#1E1E1E]">{item.name}</div>
                    <div className="text-[9px] text-[#6B7280]">{item.action} · {item.time}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function EditorMockup() {
  return (
    <div className="flex h-[420px]">
      {/* Left rail */}
      <div className="flex w-12 flex-col items-center gap-3 border-r border-[#E5E7EB] bg-[#FAFAFA] py-4">
        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-r from-[#D68C2D] to-[#12A2AC]">
          <MousePointer2 className="h-3.5 w-3.5 text-white" />
        </div>
        <FileText className="h-4 w-4 text-[#D68C2D]" />
        <div className="h-4 w-4 rounded border-2 border-[#12A2AC]" />
        <div className="h-4 w-4 rounded-full border-2 border-[#10B981]" />
        <div className="h-0.5 w-4 bg-[#6B7280]" />
        <QrCode className="h-4 w-4 text-[#6B7280]" />
      </div>
      {/* Canvas area */}
      <div className="flex flex-1 flex-col bg-[#EFEFEA]">
        {/* Toolbar */}
        <div className="flex items-center justify-between border-b border-[#E5E7EB] bg-white px-4 py-2">
          <div className="text-xs font-semibold text-[#1E1E1E]">Studio de création</div>
          <div className="flex items-center gap-2">
            <div className="rounded-lg bg-[#D68C2D] px-3 py-1 text-[10px] font-semibold text-white">Générer</div>
          </div>
        </div>
        {/* Canvas */}
        <div className="flex flex-1 items-center justify-center p-4">
          <div className="relative aspect-[1.414/1] w-full max-w-md rounded-lg bg-white shadow-xl ring-1 ring-black/5">
            {/* Certificate mockup */}
            <div className="absolute inset-0 flex flex-col items-center justify-center p-6">
              <div className="mb-2 h-1 w-16 rounded-full bg-[#D68C2D]" />
              <div className="text-[10px] font-bold uppercase tracking-widest text-[#6B7280]">Certificat de Réussite</div>
              <div className="my-3 text-base font-bold text-[#1E1E1E]">Formation React Avancé</div>
              {/* Drag handle box */}
              <div className="relative rounded-lg border-2 border-dashed border-[#D68C2D] bg-[#D68C2D]/5 px-6 py-2">
                <div className="text-sm font-bold text-[#1E1E1E]">KOUADIO JEAN-MARC</div>
                {/* Selection handles */}
                <div className="absolute -left-1 -top-1 h-2 w-2 rounded-full border border-[#D68C2D] bg-white" />
                <div className="absolute -right-1 -top-1 h-2 w-2 rounded-full border border-[#D68C2D] bg-white" />
                <div className="absolute -bottom-1 -left-1 h-2 w-2 rounded-full border border-[#D68C2D] bg-white" />
                <div className="absolute -bottom-1 -right-1 h-2 w-2 rounded-full border border-[#D68C2D] bg-white" />
              </div>
              <div className="mt-3 text-[8px] text-[#6B7280]">A décerné ce certificat à</div>
              <div className="mt-4 flex items-center gap-4">
                <div className="text-[8px] text-[#6B7280]">Date: 15/06/2025</div>
                <div className="h-8 w-8 rounded bg-[#1E1E1E]/10" />
                <div className="text-[8px] text-[#6B7280]">Lieu: Abidjan</div>
              </div>
              <div className="mt-3 h-0.5 w-32 rounded-full bg-gradient-to-r from-[#D68C2D] to-[#12A2AC]" />
            </div>
          </div>
        </div>
      </div>
      {/* Right panel */}
      <div className="w-44 border-l border-[#E5E7EB] bg-white p-3">
        <div className="mb-3 text-[10px] font-bold uppercase text-[#6B7280]">Propriétés</div>
        <div className="space-y-2">
          <div>
            <div className="mb-1 text-[9px] text-[#6B7280]">Police</div>
            <div className="rounded border border-[#E5E7EB] px-2 py-1 text-[10px] text-[#1E1E1E]">Montserrat</div>
          </div>
          <div>
            <div className="mb-1 text-[9px] text-[#6B7280]">Taille</div>
            <div className="rounded border border-[#E5E7EB] px-2 py-1 text-[10px] text-[#1E1E1E]">32 px</div>
          </div>
          <div>
            <div className="mb-1 text-[9px] text-[#6B7280]">Couleur</div>
            <div className="flex items-center gap-2">
              <div className="h-5 w-5 rounded border border-[#E5E7EB] bg-[#1E1E1E]" />
              <div className="text-[10px] text-[#1E1E1E]">#1E1E1E</div>
            </div>
          </div>
          <div>
            <div className="mb-1 text-[9px] text-[#6B7280]">Position X / Y</div>
            <div className="flex gap-1">
              <div className="flex-1 rounded border border-[#E5E7EB] px-2 py-1 text-[10px] text-[#1E1E1E]">291</div>
              <div className="flex-1 rounded border border-[#E5E7EB] px-2 py-1 text-[10px] text-[#1E1E1E]">276</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function VerificationMockup() {
  return (
    <div className="flex h-[420px] items-center justify-center bg-gradient-to-b from-[#FAFAFA] to-white p-6">
      <div className="w-full max-w-md">
        {/* Search bar */}
        <div className="mb-4 flex items-center gap-2 rounded-xl border border-[#E5E7EB] bg-white px-4 py-3 shadow-sm">
          <Search className="h-4 w-4 text-[#6B7280]" />
          <div className="flex-1 text-xs text-[#6B7280]">Saisissez l'ID ou le QR code du certificat...</div>
          <div className="rounded-lg bg-[#D68C2D] px-3 py-1 text-[10px] font-semibold text-white">Vérifier</div>
        </div>
        {/* Verified certificate card */}
        <div className="rounded-2xl border border-[#E5E7EB] bg-white p-5 shadow-lg">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#10B981]/10">
                <ShieldCheck className="h-5 w-5 text-[#10B981]" />
              </div>
              <div>
                <div className="text-sm font-bold text-[#1E1E1E]">Certificat authentique</div>
                <div className="text-[10px] text-[#6B7280]">ID: PRV-2025-0X4F2A</div>
              </div>
            </div>
            <div className="rounded-full bg-[#10B981]/10 px-3 py-1 text-[10px] font-semibold text-[#10B981]">✓ Valide</div>
          </div>
          {/* Certificate preview */}
          <div className="mb-4 rounded-xl border border-[#E5E7EB] bg-[#FAFAFA] p-4">
            <div className="mb-2 h-1 w-12 rounded-full bg-[#D68C2D]" />
            <div className="text-[8px] font-bold uppercase tracking-widest text-[#6B7280]">Certificat de Réussite</div>
            <div className="my-2 text-sm font-bold text-[#1E1E1E]">Formation React Avancé</div>
            <div className="text-xs font-semibold text-[#1E1E1E]">KOUADIO JEAN-MARC</div>
            <div className="mt-2 flex items-center justify-between text-[8px] text-[#6B7280]">
              <span>Émis le 15/06/2025</span>
              <span>Abidjan, Côte d'Ivoire</span>
            </div>
          </div>
          {/* Details */}
          <div className="space-y-2">
            {[
              { label: "Émetteur", value: "PROUV Academy" },
              { label: "Organisme", value: "TechCorp Côte d'Ivoire" },
              { label: "Durée", value: "48 heures" },
            ].map((detail) => (
              <div key={detail.label} className="flex items-center justify-between text-xs">
                <span className="text-[#6B7280]">{detail.label}</span>
                <span className="font-medium text-[#1E1E1E]">{detail.value}</span>
              </div>
            ))}
          </div>
          <div className="mt-4 flex items-center gap-2 border-t border-[#E5E7EB] pt-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#1E1E1E]">
              <QrCode className="h-4 w-4 text-white" />
            </div>
            <div className="text-[10px] text-[#6B7280]">Scanner le QR code pour vérifier l'authenticité</div>
          </div>
        </div>
      </div>
    </div>
  )
}

function WalletMockup() {
  return (
    <div className="flex h-[420px] flex-col bg-[#FAFAFA] p-5">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <div className="text-sm font-bold text-[#1E1E1E]">Mes certificats</div>
          <div className="text-[10px] text-[#6B7280]">Espace bénéficiaire</div>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#D68C2D]/10">
            <Bell className="h-3.5 w-3.5 text-[#D68C2D]" />
          </div>
          <div className="h-7 w-7 rounded-full bg-gradient-to-br from-[#D68C2D] to-[#12A2AC]" />
        </div>
      </div>
      {/* Certificate cards */}
      <div className="grid flex-1 grid-cols-2 gap-3 overflow-hidden">
        {[
          { title: "Formation React Avancé", issuer: "PROUV Academy", date: "15/06/2025", color: "from-[#D68C2D] to-[#D68C2D]/70" },
          { title: "Certificat en UX Design", issuer: "EduPlus", date: "22/05/2025", color: "from-[#12A2AC] to-[#12A2AC]/70" },
          { title: "Séminaire Leadership", issuer: "InnovateCo", date: "10/04/2025", color: "from-[#10B981] to-[#10B981]/70" },
          { title: "Atelier DevOps", issuer: "TechCorp", date: "03/03/2025", color: "from-[#8B5CF6] to-[#8B5CF6]/70" },
        ].map((cert, i) => (
          <div key={i} className="overflow-hidden rounded-xl border border-[#E5E7EB] bg-white shadow-sm">
            <div className={cn("h-16 bg-gradient-to-br p-3", cert.color)}>
              <div className="text-[8px] font-bold uppercase tracking-wider text-white/80">Certificat</div>
              <div className="truncate text-[10px] font-bold text-white">{cert.title}</div>
            </div>
            <div className="p-2.5">
              <div className="mb-1 flex items-center justify-between">
                <div className="text-[9px] text-[#6B7280]">{cert.issuer}</div>
                <div className="flex items-center gap-1">
                  <CheckCircle2 className="h-3 w-3 text-[#10B981]" />
                  <span className="text-[8px] font-medium text-[#10B981]">Vérifié</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[8px] text-[#6B7280]">{cert.date}</span>
                <div className="flex gap-1">
                  <Download className="h-3 w-3 text-[#6B7280]" />
                  <Mail className="h-3 w-3 text-[#6B7280]" />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      {/* Bottom bar */}
      <div className="mt-3 flex items-center justify-between rounded-xl border border-[#E5E7EB] bg-white p-3">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-[#D68C2D] to-[#12A2AC]">
            <Wallet className="h-4 w-4 text-white" />
          </div>
          <div>
            <div className="text-[10px] font-semibold text-[#1E1E1E]">4 certificats vérifiés</div>
            <div className="text-[9px] text-[#6B7280]">Partagez en un clic</div>
          </div>
        </div>
        <ChevronRight className="h-4 w-4 text-[#6B7280]" />
      </div>
    </div>
  )
}

export function ProductMockup({ view, className }: ProductMockupProps) {
  return (
    <BrowserFrame className={className}>
      {view === "dashboard" && <DashboardMockup />}
      {view === "editor" && <EditorMockup />}
      {view === "verification" && <VerificationMockup />}
      {view === "wallet" && <WalletMockup />}
    </BrowserFrame>
  )
}

export function ProductMockupTabs({ className }: { className?: string }) {
  const [activeView, setActiveView] = useState<MockupView>("dashboard")

  const tabs = [
    { id: "dashboard" as const, label: "Tableau de bord", icon: LayoutDashboard },
    { id: "editor" as const, label: "Éditeur", icon: MousePointer2 },
    { id: "verification" as const, label: "Vérification", icon: ShieldCheck },
    { id: "wallet" as const, label: "Wallet", icon: Wallet },
  ]

  return (
    <div className={className}>
      {/* Tabs */}
      <div className="mb-6 flex flex-wrap items-center justify-center gap-2">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveView(tab.id)}
            className={cn(
              "inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition-all",
              activeView === tab.id
                ? "bg-[#D68C2D] text-white shadow-lg shadow-[#D68C2D]/25"
                : "border border-[#E5E7EB] bg-white text-[#6B7280] hover:border-[#D68C2D]/30 hover:text-[#D68C2D]"
            )}
          >
            <tab.icon className="h-4 w-4" />
            {tab.label}
          </button>
        ))}
      </div>
      {/* Mockup */}
      <ProductMockup view={activeView} />
    </div>
  )
}
