"use client";

import { useState } from "react";
import {
  Link2,
  QrCode,
  CalendarClock,
  Hash,
  Camera,
  ListChecks,
  UserCheck,
  MailCheck,
  Stamp,
  Copy,
  Plus,
  Trash2,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
}

export interface CampaignOptions {
  collectLinkEnabled: boolean;
  qrCodeEnabled: boolean;
  availabilityEnabled: boolean;
  availabilityStart: string;
  availabilityEnd: string;
  maxCertificatesEnabled: boolean;
  maxCertificates: number;
  photoValidationEnabled: boolean;
  quizEnabled: boolean;
  quizQuestions: QuizQuestion[];
  quizMinScore: number;
  manualValidationEnabled: boolean;
  emailValidationEnabled: boolean;
  digitalSignatureEnabled: boolean;
}

export const DEFAULT_CAMPAIGN_OPTIONS: CampaignOptions = {
  collectLinkEnabled: false,
  qrCodeEnabled: false,
  availabilityEnabled: false,
  availabilityStart: "",
  availabilityEnd: "",
  maxCertificatesEnabled: false,
  maxCertificates: 200,
  photoValidationEnabled: false,
  quizEnabled: false,
  quizQuestions: [],
  quizMinScore: 7,
  manualValidationEnabled: false,
  emailValidationEnabled: false,
  digitalSignatureEnabled: false,
};

interface OptionToggleProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  enabled: boolean;
  onToggle: () => void;
  children?: React.ReactNode;
}

function OptionCard({ icon, title, description, enabled, onToggle, children }: OptionToggleProps) {
  return (
    <div className={`rounded-2xl border-2 p-5 transition-all ${enabled ? "border-[#D68C2D] bg-[#D68C2D]/5" : "border-[#E5E7EB] bg-white"}`}>
      <button type="button" onClick={onToggle} className="flex w-full items-start justify-between gap-4 text-left">
        <div className="flex gap-3">
          <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${enabled ? "bg-[#D68C2D] text-white" : "bg-[#EFEFEA] text-[#6B7280]"}`}>{icon}</div>
          <div>
            <p className="font-semibold text-[#1E1E1E]">{title}</p>
            <p className="mt-0.5 text-sm text-[#6B7280]">{description}</p>
          </div>
        </div>
        <span className={`h-7 w-12 shrink-0 rounded-full p-1 transition-colors ${enabled ? "bg-[#D68C2D]" : "bg-[#E5E7EB]"}`}>
          <span className={`block size-5 rounded-full bg-white shadow-sm transition-transform ${enabled ? "translate-x-5" : ""}`} />
        </span>
      </button>
      {enabled && children && <div className="mt-4 border-t border-[#E5E7EB] pt-4">{children}</div>}
    </div>
  );
}

interface CampaignOptionsPanelProps {
  options: CampaignOptions;
  onChange: (options: CampaignOptions) => void;
  campaignId: string;
}

export function CampaignOptionsPanel({ options, onChange, campaignId }: CampaignOptionsPanelProps) {
  const [newQuestion, setNewQuestion] = useState("");

  const update = (updates: Partial<CampaignOptions>) => onChange({ ...options, ...updates });

  const collectLink = `https://prouv.app/collect/${campaignId}`;
  const verifyLink = `https://prouv.app/verify/${campaignId}`;
  const qrImageSrc = `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(verifyLink)}`;

  const copyToClipboard = (text: string) => {
    navigator.clipboard?.writeText(text);
    toast.success("Lien copié dans le presse-papiers");
  };

  const addQuestion = () => {
    if (!newQuestion.trim()) return;
    const q: QuizQuestion = { id: `q-${Date.now()}`, question: newQuestion.trim(), options: ["Réponse A", "Réponse B", "Réponse C", "Réponse D"], correctIndex: 0 };
    update({ quizQuestions: [...options.quizQuestions, q] });
    setNewQuestion("");
  };

  const removeQuestion = (id: string) => update({ quizQuestions: options.quizQuestions.filter((q) => q.id !== id) });

  const updateQuestionOption = (id: string, optIndex: number, value: string) => {
    update({
      quizQuestions: options.quizQuestions.map((q) => (q.id === id ? { ...q, options: q.options.map((o, i) => (i === optIndex ? value : o)) } : q)),
    });
  };

  const setCorrectIndex = (id: string, idx: number) => {
    update({ quizQuestions: options.quizQuestions.map((q) => (q.id === id ? { ...q, correctIndex: idx } : q)) });
  };

  return (
    <div className="space-y-4">
      <OptionCard
        icon={<Link2 className="size-5" />}
        title="Lien de récupération"
        description="Au lieu d'envoyer directement, générez un lien sécurisé que chaque participant utilise pour récupérer son certificat."
        enabled={options.collectLinkEnabled}
        onToggle={() => update({ collectLinkEnabled: !options.collectLinkEnabled })}
      >
        <div className="flex items-center gap-2 rounded-xl border border-[#E5E7EB] bg-[#FAFAFA] p-3">
          <code className="flex-1 truncate text-sm text-[#1E1E1E]">{collectLink}</code>
          <Button type="button" size="icon" variant="outline" className="h-8 w-8 shrink-0 rounded-lg" onClick={() => copyToClipboard(collectLink)}><Copy className="size-3.5" /></Button>
        </div>
      </OptionCard>

      <OptionCard
        icon={<QrCode className="size-5" />}
        title="QR Code de campagne"
        description="Générez un QR Code que les participants scannent pour récupérer leur certificat ou vérifier son authenticité."
        enabled={options.qrCodeEnabled}
        onToggle={() => update({ qrCodeEnabled: !options.qrCodeEnabled })}
      >
        <div className="flex items-center gap-4">
          <img src={qrImageSrc} alt="QR Code de la campagne" className="h-24 w-24 rounded-lg border border-[#E5E7EB]" />
          <p className="text-sm text-[#6B7280]">Ce QR Code pointe vers la page de vérification publique de la campagne.</p>
        </div>
      </OptionCard>

      <OptionCard
        icon={<CalendarClock className="size-5" />}
        title="Fenêtre de disponibilité"
        description="Définissez une période durant laquelle les certificats peuvent être récupérés. En dehors, l'accès est bloqué."
        enabled={options.availabilityEnabled}
        onToggle={() => update({ availabilityEnabled: !options.availabilityEnabled })}
      >
        <div className="grid grid-cols-2 gap-3">
          <div><Label className="text-xs text-[#6B7280]">Début</Label><Input type="datetime-local" value={options.availabilityStart} onChange={(e) => update({ availabilityStart: e.target.value })} className="mt-1 h-10 rounded-lg border-[#E5E7EB]" /></div>
          <div><Label className="text-xs text-[#6B7280]">Fin</Label><Input type="datetime-local" value={options.availabilityEnd} onChange={(e) => update({ availabilityEnd: e.target.value })} className="mt-1 h-10 rounded-lg border-[#E5E7EB]" /></div>
        </div>
      </OptionCard>

      <OptionCard
        icon={<Hash className="size-5" />}
        title="Nombre maximal de certificats"
        description="Fermez automatiquement la campagne une fois le quota de certificats récupérés atteint."
        enabled={options.maxCertificatesEnabled}
        onToggle={() => update({ maxCertificatesEnabled: !options.maxCertificatesEnabled })}
      >
        <Label className="text-xs text-[#6B7280]">Quota maximum</Label>
        <Input type="number" min={1} value={options.maxCertificates} onChange={(e) => update({ maxCertificates: Math.max(1, parseInt(e.target.value) || 1) })} className="mt-1 h-10 w-40 rounded-lg border-[#E5E7EB]" />
      </OptionCard>

      <OptionCard
        icon={<Camera className="size-5" />}
        title="Validation par photo"
        description="Le participant doit prendre ou importer une photo avant de récupérer son certificat."
        enabled={options.photoValidationEnabled}
        onToggle={() => update({ photoValidationEnabled: !options.photoValidationEnabled })}
      />

      <OptionCard
        icon={<ListChecks className="size-5" />}
        title="Quiz de validation"
        description="Le participant doit répondre correctement à un quiz avant d'obtenir son certificat."
        enabled={options.quizEnabled}
        onToggle={() => update({ quizEnabled: !options.quizEnabled })}
      >
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <Label className="text-xs text-[#6B7280] whitespace-nowrap">Score minimum</Label>
            <Input type="number" min={0} value={options.quizMinScore} onChange={(e) => update({ quizMinScore: Math.max(0, parseInt(e.target.value) || 0) })} className="h-9 w-24 rounded-lg border-[#E5E7EB]" />
            <span className="text-xs text-[#6B7280]">/ {options.quizQuestions.length} question(s)</span>
          </div>
          <div className="space-y-2">
            {options.quizQuestions.map((q, qi) => (
              <div key={q.id} className="rounded-xl border border-[#E5E7EB] bg-[#FAFAFA] p-3">
                <div className="mb-2 flex items-center justify-between">
                  <p className="text-sm font-semibold text-[#1E1E1E]">Q{qi + 1}. {q.question}</p>
                  <button type="button" onClick={() => removeQuestion(q.id)} className="text-red-400 hover:text-red-600"><Trash2 className="size-4" /></button>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {q.options.map((opt, oi) => (
                    <div key={oi} className="flex items-center gap-1.5">
                      <button type="button" onClick={() => setCorrectIndex(q.id, oi)} className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 ${q.correctIndex === oi ? "border-[#12A2AC] bg-[#12A2AC] text-white" : "border-[#E5E7EB]"}`}>{q.correctIndex === oi && <Check className="size-3" />}</button>
                      <Input value={opt} onChange={(e) => updateQuestionOption(q.id, oi, e.target.value)} className="h-8 rounded-lg border-[#E5E7EB] text-xs" />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div className="flex gap-2">
            <Input value={newQuestion} onChange={(e) => setNewQuestion(e.target.value)} onKeyDown={(e) => e.key === "Enter" && addQuestion()} placeholder="Nouvelle question" className="h-9 rounded-lg border-[#E5E7EB]" />
            <Button type="button" size="sm" onClick={addQuestion} className="rounded-lg bg-[#D68C2D] text-white hover:bg-[#D68C2D]/90"><Plus className="mr-1 size-4" />Ajouter</Button>
          </div>
        </div>
      </OptionCard>

      <OptionCard
        icon={<UserCheck className="size-5" />}
        title="Validation manuelle"
        description="Chaque certificat doit être validé manuellement par l'organisateur avant d'être téléchargeable."
        enabled={options.manualValidationEnabled}
        onToggle={() => update({ manualValidationEnabled: !options.manualValidationEnabled })}
      />

      <OptionCard
        icon={<MailCheck className="size-5" />}
        title="Validation par email"
        description="Le participant reçoit un code de confirmation par email avant de pouvoir télécharger son certificat."
        enabled={options.emailValidationEnabled}
        onToggle={() => update({ emailValidationEnabled: !options.emailValidationEnabled })}
      />

      <OptionCard
        icon={<Stamp className="size-5" />}
        title="Signature numérique"
        description="Ajoute automatiquement une signature, un cachet, une date, un QR Code et un identifiant unique à chaque certificat."
        enabled={options.digitalSignatureEnabled}
        onToggle={() => update({ digitalSignatureEnabled: !options.digitalSignatureEnabled })}
      />
    </div>
  );
}
