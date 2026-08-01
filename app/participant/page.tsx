"use client";

import Link from "next/link";
import {
  Award,
  Download,
  Share2,
  ShieldCheck,
  Wallet,
  Sparkles,
  History,
  GraduationCap,
  Bell,
  LogOut,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

type Certificate = {
  id: string;
  title: string;
  issuer: string;
  date: string;
  color: string;
};

const mockCertificates: Certificate[] = [
  { id: "cert-a1b2c3", title: "Formation React Avancé", issuer: "PROUV Academy", date: "15 janv. 2026", color: "from-[#D68C2D] to-[#f0b35c]" },
  { id: "cert-d4e5f6", title: "Atelier Design Thinking", issuer: "Institut Créatif", date: "02 déc. 2025", color: "from-[#12A2AC] to-[#5fd6dc]" },
  { id: "cert-g7h8i9", title: "Séminaire Leadership", issuer: "Business School CI", date: "20 oct. 2025", color: "from-[#1E1E1E] to-[#4B5563]" },
];

const mockBadges = [
  { id: "b1", label: "Premier certificat", icon: Sparkles },
  { id: "b2", label: "3 formations complétées", icon: GraduationCap },
  { id: "b3", label: "Certifié vérifié", icon: ShieldCheck },
];

const mockHistory = [
  { id: "h1", label: "Téléchargement — Formation React Avancé", date: "16 janv. 2026" },
  { id: "h2", label: "Partage — Atelier Design Thinking", date: "03 déc. 2025" },
  { id: "h3", label: "Certificat reçu — Séminaire Leadership", date: "20 oct. 2025" },
];

function StatCard({ label, value, icon: Icon, color }: { label: string; value: number; icon: typeof Award; color: string }) {
  return (
    <Card className="border-[#E5E7EB] bg-white shadow-sm">
      <CardContent className="flex items-center justify-between p-6">
        <div>
          <p className="text-sm font-medium text-[#6B7280]">{label}</p>
          <p className="mt-1 text-3xl font-bold text-[#1E1E1E]">{value}</p>
        </div>
        <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${color}`}><Icon className="size-6" /></div>
      </CardContent>
    </Card>
  );
}

export default function ParticipantPortalPage() {
  return (
    <div className="min-h-screen bg-[#EFEFEA]">
      <header className="sticky top-0 z-10 border-b border-[#E5E7EB] bg-white/90 backdrop-blur-sm">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-[#D68C2D] to-[#12A2AC] text-sm font-bold text-white">P</div>
            <span className="font-heading text-xl font-bold text-[#1E1E1E]">PROUV</span>
            <span className="ml-2 rounded-full bg-[#EFEFEA] px-3 py-1 text-xs font-medium text-[#6B7280]">Mon espace</span>
          </div>
          <div className="flex items-center gap-3">
            <button type="button" className="rounded-full p-2 text-[#6B7280] hover:bg-[#EFEFEA]"><Bell className="size-5" /></button>
            <div className="flex items-center gap-2 rounded-full border border-[#E5E7EB] py-1 pl-1 pr-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#D68C2D]/10 text-sm font-bold text-[#D68C2D]">KJ</div>
              <span className="text-sm font-medium text-[#1E1E1E]">Kouadio Jean-Marc</span>
            </div>
            <button type="button" className="rounded-full p-2 text-[#6B7280] hover:bg-[#EFEFEA]"><LogOut className="size-5" /></button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl space-y-10 px-6 py-10">
        <div>
          <h1 className="font-heading text-3xl font-bold text-[#1E1E1E]">Bienvenue, Jean-Marc 👋</h1>
          <p className="mt-1 text-[#6B7280]">Retrouvez tous vos certificats, badges et formations en un seul endroit.</p>
        </div>

        <div className="grid gap-5 md:grid-cols-4">
          <StatCard label="Certificats" value={mockCertificates.length} icon={Award} color="bg-[#D68C2D]/10 text-[#D68C2D]" />
          <StatCard label="Badges" value={mockBadges.length} icon={Sparkles} color="bg-[#12A2AC]/10 text-[#12A2AC]" />
          <StatCard label="Formations suivies" value={3} icon={GraduationCap} color="bg-[#1E1E1E]/10 text-[#1E1E1E]" />
          <StatCard label="Téléchargements" value={7} icon={Download} color="bg-[#D68C2D]/10 text-[#D68C2D]" />
        </div>

        <section>
          <div className="mb-4 flex items-center gap-2"><Wallet className="size-5 text-[#D68C2D]" /><h2 className="font-heading text-xl font-bold text-[#1E1E1E]">Mon wallet numérique</h2></div>
          <div className="grid gap-5 md:grid-cols-3">
            {mockCertificates.map((cert) => (
              <div key={cert.id} className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${cert.color} p-6 text-white shadow-lg`}>
                <ShieldCheck className="mb-8 size-8 opacity-90" />
                <p className="text-sm opacity-80">Certificat vérifié</p>
                <p className="mt-1 font-heading text-lg font-bold leading-snug">{cert.title}</p>
                <p className="mt-3 text-xs opacity-80">{cert.issuer} &bull; {cert.date}</p>
              </div>
            ))}
          </div>
        </section>

        <section>
          <div className="mb-4 flex items-center gap-2"><Award className="size-5 text-[#D68C2D]" /><h2 className="font-heading text-xl font-bold text-[#1E1E1E]">Mes certificats</h2></div>
          <div className="space-y-3">
            {mockCertificates.map((cert) => (
              <Card key={cert.id} className="border-[#E5E7EB] bg-white shadow-sm">
                <CardContent className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="font-semibold text-[#1E1E1E]">{cert.title}</p>
                    <p className="text-sm text-[#6B7280]">{cert.issuer} &bull; {cert.date}</p>
                  </div>
                  <div className="flex gap-2">
                    <Link href={`/verify/${cert.id}`}><Button variant="outline" size="sm" className="rounded-lg border-[#E5E7EB]"><ShieldCheck className="mr-1.5 size-4" />Vérifier</Button></Link>
                    <Button variant="outline" size="sm" className="rounded-lg border-[#E5E7EB]"><Share2 className="mr-1.5 size-4" />Partager</Button>
                    <Button size="sm" className="rounded-lg bg-[#D68C2D] text-white hover:bg-[#D68C2D]/90"><Download className="mr-1.5 size-4" />Télécharger</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section>
          <div className="mb-4 flex items-center gap-2"><Sparkles className="size-5 text-[#D68C2D]" /><h2 className="font-heading text-xl font-bold text-[#1E1E1E]">Mes badges</h2></div>
          <div className="grid gap-5 md:grid-cols-3">
            {mockBadges.map((badge) => {
              const Icon = badge.icon;
              return (
                <Card key={badge.id} className="border-[#E5E7EB] bg-white shadow-sm">
                  <CardContent className="flex items-center gap-4 p-5">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-[#D68C2D] to-[#12A2AC] text-white"><Icon className="size-6" /></div>
                    <p className="font-semibold text-[#1E1E1E]">{badge.label}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>

        <section>
          <div className="mb-4 flex items-center gap-2"><History className="size-5 text-[#D68C2D]" /><h2 className="font-heading text-xl font-bold text-[#1E1E1E]">Historique</h2></div>
          <Card className="border-[#E5E7EB] bg-white shadow-sm">
            <CardContent className="divide-y divide-[#E5E7EB] p-0">
              {mockHistory.map((item) => (
                <div key={item.id} className="flex items-center justify-between px-5 py-4">
                  <p className="text-sm text-[#1E1E1E]">{item.label}</p>
                  <p className="text-xs text-[#6B7280]">{item.date}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </section>
      </main>
    </div>
  );
}
