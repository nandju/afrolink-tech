"use client";

import { useParams } from "next/navigation";
import {
  ShieldCheck,
  ShieldAlert,
  ShieldX,
  Calendar,
  Building2,
  User,
  Award,
  Hash,
  Download,
  Share2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

type CertificateStatus = "valid" | "expired" | "revoked";

// Deterministic mock status based on the certificate id, since no backend exists yet.
function getMockStatus(id: string): CertificateStatus {
  const sum = id.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0);
  const mod = sum % 10;
  if (mod === 0) return "revoked";
  if (mod === 1) return "expired";
  return "valid";
}

function getMockCertificate(id: string) {
  const status = getMockStatus(id);
  return {
    id,
    status,
    participant: "KOUADIO JEAN-MARC",
    formation: "Formation Certifiante en Gestion de Projet",
    issuer: "PROUV Academy",
    issueDate: "15 janvier 2026",
    expiryDate: status === "expired" ? "15 janvier 2027" : undefined,
  };
}

const statusConfig: Record<CertificateStatus, { label: string; color: string; bg: string; icon: typeof ShieldCheck }> = {
  valid: { label: "Certificat valide", color: "text-[#12A2AC]", bg: "bg-[#12A2AC]/10", icon: ShieldCheck },
  expired: { label: "Certificat expiré", color: "text-[#D68C2D]", bg: "bg-[#D68C2D]/10", icon: ShieldAlert },
  revoked: { label: "Certificat révoqué", color: "text-red-600", bg: "bg-red-50", icon: ShieldX },
};

export default function VerifyCertificatePage() {
  const params = useParams();
  const id = (params?.id as string) || "unknown";
  const certificate = getMockCertificate(id);
  const config = statusConfig[certificate.status];
  const StatusIcon = config.icon;

  const handleShare = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard?.writeText(window.location.href);
    }
    toast.success("Lien de vérification copié");
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#EFEFEA] px-4 py-12">
      <div className="mb-8 flex items-center gap-2">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#D68C2D] to-[#12A2AC] text-lg font-bold text-white">P</div>
        <span className="font-heading text-2xl font-bold text-[#1E1E1E]">PROUV</span>
      </div>

      <div className="w-full max-w-xl rounded-3xl border border-[#E5E7EB] bg-white p-8 shadow-xl">
        <div className={`flex items-center gap-4 rounded-2xl p-5 ${config.bg}`}>
          <StatusIcon className={`size-10 ${config.color}`} />
          <div>
            <p className={`text-lg font-bold ${config.color}`}>{config.label}</p>
            <p className="text-sm text-[#6B7280]">Identifiant : {certificate.id}</p>
          </div>
        </div>

        <div className="mt-6 space-y-4">
          <div className="flex items-center gap-3 border-b border-[#E5E7EB] pb-4">
            <User className="size-5 text-[#D68C2D]" />
            <div><p className="text-xs text-[#6B7280]">Participant</p><p className="font-semibold text-[#1E1E1E]">{certificate.participant}</p></div>
          </div>
          <div className="flex items-center gap-3 border-b border-[#E5E7EB] pb-4">
            <Award className="size-5 text-[#D68C2D]" />
            <div><p className="text-xs text-[#6B7280]">Formation / Certification</p><p className="font-semibold text-[#1E1E1E]">{certificate.formation}</p></div>
          </div>
          <div className="flex items-center gap-3 border-b border-[#E5E7EB] pb-4">
            <Building2 className="size-5 text-[#D68C2D]" />
            <div><p className="text-xs text-[#6B7280]">Émetteur</p><p className="font-semibold text-[#1E1E1E]">{certificate.issuer}</p></div>
          </div>
          <div className="flex items-center gap-3 border-b border-[#E5E7EB] pb-4">
            <Calendar className="size-5 text-[#D68C2D]" />
            <div><p className="text-xs text-[#6B7280]">Date d'émission</p><p className="font-semibold text-[#1E1E1E]">{certificate.issueDate}</p></div>
          </div>
          {certificate.expiryDate && (
            <div className="flex items-center gap-3 border-b border-[#E5E7EB] pb-4">
              <Calendar className="size-5 text-[#D68C2D]" />
              <div><p className="text-xs text-[#6B7280]">Date d'expiration</p><p className="font-semibold text-[#1E1E1E]">{certificate.expiryDate}</p></div>
            </div>
          )}
          <div className="flex items-center gap-3">
            <Hash className="size-5 text-[#D68C2D]" />
            <div><p className="text-xs text-[#6B7280]">ID unique de vérification</p><p className="font-mono text-sm font-semibold text-[#1E1E1E]">{certificate.id}</p></div>
          </div>
        </div>

        <div className="mt-8 flex gap-3">
          <Button variant="outline" className="flex-1 rounded-xl border-[#E5E7EB]" onClick={handleShare}><Share2 className="mr-2 size-4" />Partager</Button>
          <Button className="flex-1 rounded-xl bg-[#D68C2D] text-white hover:bg-[#D68C2D]/90"><Download className="mr-2 size-4" />Télécharger</Button>
        </div>
      </div>

      <p className="mt-6 text-xs text-[#6B7280]">Vérification propulsée par PROUV &bull; Ce document a été authentifié en temps réel</p>
    </div>
  );
}
