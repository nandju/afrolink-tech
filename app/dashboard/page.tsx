"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { PDFDocument, rgb } from "pdf-lib";
import fontkit from "@pdf-lib/fontkit";
import * as XLSX from "xlsx";
import Papa from "papaparse";
import JSZip from "jszip";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import {
  Upload,
  FileText,
  Plus,
  Edit2,
  Trash2,
  Download,
  FileSpreadsheet,
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  Settings,
  CheckCircle2,
  Info,
  MousePointer2,
  Mail,
  Users,
  AlertCircle,
} from "lucide-react";
import { toast } from "sonner";
import { ClientSidebar } from "@/components/ui/client-sidebar";
import { InteractivePdfPreview } from "@/components/ui/interactive-pdf-preview";

// Font configuration
type FontWeight = "Regular" | "SemiBold" | "Bold";
type FontFamily = "Montserrat" | "Poppins" | "Roboto" | "Great Vibes";

interface FontConfig {
  family: FontFamily;
  weight: FontWeight;
  file: string;
}

const FONT_CONFIGS: FontConfig[] = [
  { family: "Montserrat", weight: "Regular", file: "Montserrat-Regular.ttf" },
  { family: "Montserrat", weight: "SemiBold", file: "Montserrat-SemiBold.ttf" },
  { family: "Montserrat", weight: "Bold", file: "Montserrat-Bold.ttf" },
  { family: "Poppins", weight: "Regular", file: "Poppins-Regular.ttf" },
  { family: "Poppins", weight: "SemiBold", file: "Poppins-SemiBold.ttf" },
  { family: "Poppins", weight: "Bold", file: "Poppins-Bold.ttf" },
  { family: "Roboto", weight: "Regular", file: "Roboto-Regular.ttf" },
  { family: "Roboto", weight: "SemiBold", file: "Roboto-SemiBold.ttf" },
  { family: "Roboto", weight: "Bold", file: "Roboto-Bold.ttf" },
  { family: "Great Vibes", weight: "Regular", file: "GreatVibes-Regular.ttf" },
];

const getAvailableWeights = (fontFamily: FontFamily): FontWeight[] => {
  if (fontFamily === "Great Vibes") return ["Regular"];
  return ["Regular", "SemiBold", "Bold"];
};

const getFontFile = (fontFamily: FontFamily, weight: FontWeight): string => {
  const config = FONT_CONFIGS.find(f => f.family === fontFamily && f.weight === weight);
  return config?.file || "Montserrat-Regular.ttf";
};

type TextField = {
  id: string;
  name: string;
  dataKey: string;
  x: number;
  y: number;
  fontSize: number;
  color: string;
  fontFamily: FontFamily;
  fontWeight: FontWeight;
};

type NameItem = {
  id: string;
  name: string;
  email?: string;
};

type WizardStep = 1 | 2 | 3 | 4 | 5;
type ParticipantMode = "manual" | "excel";

const wizardSteps: { id: WizardStep; label: string; shortLabel: string }[] = [
  { id: 1, label: "Modèle PDF", shortLabel: "PDF" },
  { id: 2, label: "Placement du nom", shortLabel: "Placement" },
  { id: 3, label: "Participants", shortLabel: "Participants" },
  { id: 4, label: "Email (optionnel)", shortLabel: "Email" },
  { id: 5, label: "Génération", shortLabel: "Générer" },
];

function FieldTooltip({ label, description, children }: { label: string; description: string; children: React.ReactNode }) {
  return (
    <TooltipProvider delayDuration={150}>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="flex items-center gap-1.5 cursor-help group">{children}<Info className="h-4 w-4 text-[#9CA3AF] group-hover:text-[#D68C2D] transition-colors" /></div>
        </TooltipTrigger>
        <TooltipContent side="top" className="max-w-xs bg-white text-[#1E1E1E] border border-[#D68C2D]/30 shadow-xl rounded-xl px-4 py-3">
          <p className="text-xs font-bold text-[#D68C2D]">{label}</p>
          <p className="text-[11px] text-[#6B7280] mt-1 leading-relaxed">{description}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

const prouvToast = {
  success: (msg: string) => toast.success(msg, {
    style: { borderLeft: "4px solid #12A2AC", backgroundColor: "#F0FDFD", color: "#1E1E1E", borderColor: "#12A2AC" },
    icon: <CheckCircle2 className="h-4 w-4 text-[#12A2AC]" />,
  }),
  error: (msg: string) => toast.error(msg, {
    style: { borderLeft: "4px solid #EF4444", backgroundColor: "#FEF2F2", color: "#1E1E1E", borderColor: "#EF4444" },
    icon: <AlertCircle className="h-4 w-4 text-red-500" />,
  }),
  info: (msg: string) => toast.info(msg, {
    style: { borderLeft: "4px solid #D68C2D", backgroundColor: "#FFFBEB", color: "#1E1E1E", borderColor: "#D68C2D" },
    icon: <Info className="h-4 w-4 text-[#D68C2D]" />,
  }),
};

const isEmailColumn = (columnName: string) => {
  const normalized = columnName.toLowerCase().replace(/[\s_-]+/g, "");
  return ["email", "mail", "e-mail", "emailaddress", "adresseemail", "adressemail"].some((keyword) =>
    normalized.includes(keyword.replace(/[\s_-]+/g, ""))
  );
};

export default function DashboardPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const excelInputRef = useRef<HTMLInputElement>(null);
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [pdfPreview, setPdfPreview] = useState<string | null>(null);
  const [names, setNames] = useState<NameItem[]>([]);
  const [manualName, setManualName] = useState("");
  const [textField, setTextField] = useState<TextField>({
    id: "name-field", name: "Nom du participant", dataKey: "Nom", x: 300, y: 400, fontSize: 32, color: "#000000", fontFamily: "Montserrat", fontWeight: "Bold",
  });
  const [moveStep, setMoveStep] = useState(10);
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentStep, setCurrentStep] = useState<WizardStep>(1);
  const [maxValidatedStep, setMaxValidatedStep] = useState<WizardStep>(1);
  const [participantMode, setParticipantMode] = useState<ParticipantMode | null>(null);
  const [isDraggingPdf, setIsDraggingPdf] = useState(false);
  const [importedColumns, setImportedColumns] = useState<string[]>([]);
  const [detectedEmailColumn, setDetectedEmailColumn] = useState<string | null>(null);
  const [emailEnabled, setEmailEnabled] = useState(false);
  const [emailSubject, setEmailSubject] = useState("Votre certificat PROUV");
  const [emailMessage, setEmailMessage] = useState(
    "Bonjour {{nom}} {{prénom}},\n\nVeuillez trouver votre certificat en pièce jointe.\n\nCordialement,\nL'équipe PROUV"
  );
  const fontBytesCacheRef = useRef<Map<string, Uint8Array>>(new Map());
  const previewUrlRef = useRef<string | null>(null);

  const normalizeWeightForFamily = (
    family: FontFamily,
    weight: FontWeight
  ): FontWeight => {
    if (family === "Great Vibes") return "Regular";
    return weight;
  };

  const resolveFieldFontFile = (field: TextField): string => {
    const normalizedWeight = normalizeWeightForFamily(field.fontFamily, field.fontWeight);
    return getFontFile(field.fontFamily, normalizedWeight);
  };

  // Load font bytes once and reuse for each PDF document.
  const loadFontBytes = async (fontFamily: FontFamily, weight: FontWeight): Promise<Uint8Array | null> => {
    const fontFile = getFontFile(fontFamily, weight);
    const fontKey = `${fontFamily}-${weight}`;

    if (fontBytesCacheRef.current.has(fontKey)) {
      return fontBytesCacheRef.current.get(fontKey) || null;
    }

    try {
      const response = await fetch(`/fonts/${fontFile}`);
      if (!response.ok) {
        throw new Error(`Failed to load font: ${fontFile}`);
      }
      const fontBytes = new Uint8Array(await response.arrayBuffer());
      fontBytesCacheRef.current.set(fontKey, fontBytes);
      return fontBytes;
    } catch (error) {
      console.error("Error loading font:", error);
      return null;
    }
  };

  const updateTextField = (updates: Partial<TextField>) => setTextField((prev) => ({ ...prev, ...updates }));
  const moveTextField = (dx: number, dy: number) => setTextField((prev) => ({ ...prev, x: Math.max(0, Math.round(prev.x + dx)), y: Math.max(0, Math.round(prev.y + dy)) }));
  useEffect(() => {
    if (typeof window !== "undefined") {
      const authenticated = sessionStorage.getItem("authenticated") === "true";
      if (!authenticated) {
        router.push("/login");
      }
    }
  }, [router]);

  const handlePdfUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    await handlePdfFile(file);
  };

  const handlePdfFile = async (file?: File) => {
    if (!file || file.type !== "application/pdf") {
      prouvToast.error("Veuillez sélectionner un fichier PDF valide");
      return;
    }

    setPdfFile(file);
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setPdfPreview(result);
    };
    reader.readAsDataURL(file);
    prouvToast.success("PDF modèle chargé avec succès");
  };

  const handlePdfDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDraggingPdf(false);
    await handlePdfFile(e.dataTransfer.files?.[0]);
  };

  const handleAddName = () => {
    const trimmed = manualName.trim();
    if (!trimmed) { prouvToast.error("Veuillez entrer un nom"); return; }
    const newItem: NameItem = { id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`, name: trimmed };
    setNames((prev) => [newItem, ...prev]);
    setManualName("");
    prouvToast.success("Participant ajouté");
  };

  const handleDeleteName = (id: string) => {
    setNames(names.filter((n) => n.id !== id));
    prouvToast.success("Nom supprimé");
  };

  const handleEditName = (id: string, newName: string) => {
    setNames(names.map((n) => (n.id === id ? { ...n, name: newName } : n)));
  };

  const handleExcelUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      let data: any[] = [];
      
      if (file.name.endsWith(".csv")) {
        // Traitement CSV
        Papa.parse(file, {
          header: true,
          complete: (results: any) => {
            data = results.data as any[];
            processExcelData(data);
          },
          error: (error: any) => {
            prouvToast.error(`Erreur lors de l'import CSV: ${error.message}`);
          },
        });
      } else {
        // Traitement Excel
        const arrayBuffer = await file.arrayBuffer();
        const workbook = XLSX.read(arrayBuffer, { type: "array" });
        const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
        data = XLSX.utils.sheet_to_json(firstSheet);
        processExcelData(data);
      }
    } catch (error) {
      prouvToast.error("Erreur lors de l'import du fichier");
      console.error(error);
    }
  };

  const processExcelData = (data: any[]) => {
    if (data.length === 0) { prouvToast.error("Le fichier est vide"); return; }
    const firstRow = data[0];
    const columns = Object.keys(firstRow);
    const emailColumn = columns.find(isEmailColumn) || null;
    setImportedColumns(columns); setDetectedEmailColumn(emailColumn);
    const nameColumn = columns[0];
    const importedNames: NameItem[] = [];
    data.forEach((row: any, index: number) => {
      const name = row[nameColumn];
      if (name && typeof name === "string" && name.trim()) {
        importedNames.push({ id: `excel-${Date.now()}-${index}`, name: name.trim(), email: emailColumn && row[emailColumn] ? String(row[emailColumn]).trim() : undefined });
      }
    });
    setNames((prev) => [...importedNames, ...prev]);
    prouvToast.success(`${importedNames.length} participants importés`);
  };

  const getEmbeddedFontsForDocument = async (
    pdfDoc: PDFDocument
  ): Promise<Map<string, any>> => {
    pdfDoc.registerFontkit(fontkit);
    const fontMap = new Map<string, any>();
    const uniqueFontKeys = new Set([resolveFieldFontFile(textField)]);

    for (const fontFile of uniqueFontKeys) {
      const config = FONT_CONFIGS.find((f) => f.file === fontFile);
      if (!config) continue;
      const normalizedWeight = normalizeWeightForFamily(config.family, config.weight);
      const fontBytes = await loadFontBytes(config.family, normalizedWeight);
      if (!fontBytes) continue;
      const embedded = await pdfDoc.embedFont(fontBytes);
      fontMap.set(fontFile, embedded);
    }

    return fontMap;
  };

  const sanitizeFileName = (name: string): string => {
    return name
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "_")
      .trim();
  };
  const generateCertificates = async () => {
    if (!pdfFile) {
      prouvToast.error("Veuillez d'abord uploader un PDF modèle");
      return;
    }

    if (names.length === 0) {
      prouvToast.error("Veuillez ajouter au moins un nom");
      return;
    }

    // Single text field always present

    setIsGenerating(true);

    try {
      const zip = new JSZip();
      const pdfBytes = await pdfFile.arrayBuffer();

      for (const nameItem of names) {
        const pdfDoc = await PDFDocument.load(pdfBytes);
        const pages = pdfDoc.getPages();
        const firstPage = pages[0];
        const { height } = firstPage.getSize();
        const embeddedFonts = await getEmbeddedFontsForDocument(pdfDoc);

        // Convert hex color to RGB
        const hexToRgb = (hex: string) => {
          const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
          return result
            ? {
                r: parseInt(result[1], 16) / 255,
                g: parseInt(result[2], 16) / 255,
                b: parseInt(result[3], 16) / 255,
              }
            : { r: 0, g: 0, b: 0 };
        };

        // Draw single name field
        const colorRgb = hexToRgb(textField.color);
        const fontFile = resolveFieldFontFile(textField);
        const font = embeddedFonts.get(fontFile);
        if (font) {
          firstPage.drawText(nameItem.name, {
            x: textField.x,
            y: height - textField.y,
            size: textField.fontSize,
            font,
            color: rgb(colorRgb.r, colorRgb.g, colorRgb.b),
          });
        }

        const pdfBytesModified = await pdfDoc.save();
        const fileName = `${sanitizeFileName(nameItem.name)}.pdf`;
        zip.file(fileName, pdfBytesModified);
      }

      const zipBlob = await zip.generateAsync({ type: "blob" });
      const url = URL.createObjectURL(zipBlob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "certificats.zip";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      prouvToast.success(`${names.length} certificat(s) généré(s) avec succès !`);
      setIsGenerating(false);
    } catch (error) {
      console.error(error);
      prouvToast.error("Erreur lors de la génération des certificats");
      setIsGenerating(false);
    }
  };

  const renderLivePdfPreview = async () => {
    if (!pdfFile) {
      if (pdfFile && !pdfPreview) {
        const reader = new FileReader();
        reader.onload = (e) => setPdfPreview(e.target?.result as string);
        reader.readAsDataURL(pdfFile);
      }
      return;
    }

    try {
      const pdfBytes = await pdfFile.arrayBuffer();
      const pdfDoc = await PDFDocument.load(pdfBytes);
      const pages = pdfDoc.getPages();
      const firstPage = pages[0];
      const { height } = firstPage.getSize();

      // Convert hex color to RGB
      const hexToRgb = (hex: string) => {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result
          ? {
              r: parseInt(result[1], 16) / 255,
              g: parseInt(result[2], 16) / 255,
              b: parseInt(result[3], 16) / 255,
            }
          : { r: 0, g: 0, b: 0 };
      };

      const embeddedFonts = await getEmbeddedFontsForDocument(pdfDoc);

      const activeName = names[0];

      // Draw single name field with sample
      const colorRgb = hexToRgb(textField.color);
      const fontFile = resolveFieldFontFile(textField);
      const font = embeddedFonts.get(fontFile);
      const previewText = activeName?.name || "KOUADIO JEAN-MARC";
      if (font) {
        firstPage.drawText(previewText, {
          x: textField.x,
          y: height - textField.y,
          size: textField.fontSize,
          font,
          color: rgb(colorRgb.r, colorRgb.g, colorRgb.b),
        });
      }

      const pdfBytesModified = await pdfDoc.save();
      const pdfBuffer = Uint8Array.from(pdfBytesModified).buffer;
      const blob = new Blob([pdfBuffer], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      if (previewUrlRef.current) {
        URL.revokeObjectURL(previewUrlRef.current);
      }
      previewUrlRef.current = url;
      setPdfPreview(url);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const timeout = setTimeout(() => {
      void renderLivePdfPreview();
    }, 120);
    return () => clearTimeout(timeout);
  }, [pdfFile, textField, names]);

  useEffect(() => {
    return () => {
      if (previewUrlRef.current) {
        URL.revokeObjectURL(previewUrlRef.current);
      }
    };
  }, []);


  const canValidateStep = (step: WizardStep) => {
    if (step === 1) return Boolean(pdfFile);
    if (step === 2) return Boolean(pdfFile);
    if (step === 3) return names.length > 0;
    if (step === 4) return !emailEnabled || names.some((item) => item.email);
    return Boolean(pdfFile && names.length > 0);
  };

  const goToStep = (step: WizardStep) => {
    if (step <= maxValidatedStep) setCurrentStep(step);
  };

  const continueToStep = (nextStep: WizardStep) => {
    if (!canValidateStep(currentStep)) {
      prouvToast.error("Complétez cette étape avant de continuer");
      return;
    }
    setMaxValidatedStep((prev) => Math.max(prev, nextStep) as WizardStep);
    setCurrentStep(nextStep);
  };

  const renderEmailPreview = () => {
    const sample = names[0];
    return emailMessage
      .replaceAll("{{prénom}}", sample?.name.split(" ").slice(1).join(" ") || "")
      .replaceAll("{{nom}}", sample?.name.split(" ")[0] || sample?.name || "")
      .replaceAll("{{poste}}", "")
      .replaceAll("{{email}}", sample?.email || "");
  };

  const generateAndMaybeSendCertificates = async () => {
    // Email sending would be handled server-side when backend is connected
    await generateCertificates();
  };

  return (
    <div className="flex min-h-screen bg-[#EFEFEA]">
      <ClientSidebar />
      <main className="ml-64 flex-1 px-8 py-8">
        <div className="mx-auto w-full">
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#D68C2D]/10"><FileText className="h-5 w-5 text-[#D68C2D]" /></div>
              <h1 className="font-heading text-3xl font-bold text-[#1E1E1E]">Création de certificats</h1>
            </div>
            <p className="text-base text-[#6B7280]">Importez votre modèle PDF, placez le nom, ajoutez les participants et générez.</p>
          </div>
          <Card className="mb-6 border-[#E5E7EB] bg-white shadow-sm p-5 rounded-2xl">
            <div className="mb-3 flex items-center justify-between text-sm text-[#6B7280]">
              <span>Étape {currentStep} sur 5</span>
              <span className="font-medium text-[#D68C2D]">{Math.round((currentStep / 5) * 100)}%</span>
            </div>
            <div className="mb-5 h-2 overflow-hidden rounded-full bg-[#E5E7EB]">
              <motion.div className="h-full rounded-full bg-gradient-to-r from-[#D68C2D] to-[#12A2AC]" initial={{ width: 0 }} animate={{ width: `${(currentStep / 5) * 100}%` }} transition={{ duration: 0.5, ease: "easeInOut" }} />
            </div>
            <div className="grid gap-3 md:grid-cols-5">
              {wizardSteps.map((step) => {
                const isDone = step.id < currentStep || step.id < maxValidatedStep;
                const isActive = step.id === currentStep;
                const isClickable = step.id <= maxValidatedStep;
                return (
                  <button key={step.id} type="button" onClick={() => goToStep(step.id)} disabled={!isClickable}
                    className={`rounded-xl border p-4 text-left transition-all duration-300 ${isActive ? "border-[#D68C2D] bg-[#D68C2D]/10 shadow-sm" : isDone ? "border-[#12A2AC]/30 bg-[#12A2AC]/5" : "border-[#E5E7EB] bg-white opacity-60"}`}>
                    <div className="flex items-center justify-between"><span className="text-xs font-medium text-[#6B7280]">{step.label}</span>{isDone && <CheckCircle2 className="size-4 text-[#12A2AC]" />}</div>
                    <p className="mt-1 font-semibold text-[#1E1E1E]">{step.shortLabel}</p>
                  </button>
                );
              })}
            </div>
          </Card>

        {currentStep === 1 && (
          <Card className="border-[#E5E7EB] bg-white shadow-sm rounded-2xl overflow-hidden">
            <CardHeader className="pb-2">
              <CardTitle className="font-heading text-2xl font-bold text-[#1E1E1E]">1. Téléversez votre modèle PDF</CardTitle>
              <CardDescription className="text-[#6B7280] text-base">Glissez-déposez ou sélectionnez votre certificat vierge au format PDF.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 pb-8">
              <div onDrop={handlePdfDrop} onDragOver={(e) => e.preventDefault()} onDragEnter={() => setIsDraggingPdf(true)} onDragLeave={() => setIsDraggingPdf(false)}
                className={`rounded-3xl border-2 border-dashed p-14 text-center transition-all duration-300 ${isDraggingPdf ? "border-[#D68C2D] bg-[#D68C2D]/5 scale-[1.01]" : "border-[#E5E7EB] bg-[#FAFAFA] hover:border-[#D68C2D]/50"}`}>
                <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-[#D68C2D]/10"><Upload className="h-10 w-10 text-[#D68C2D]" /></div>
                <h2 className="text-xl font-semibold text-[#1E1E1E]">{pdfFile ? pdfFile.name : "Glissez votre PDF ici"}</h2>
                <p className="mt-2 text-sm text-[#6B7280]">Format accepté : PDF uniquement &bull; Taille max : 10 MB</p>
                <FieldTooltip label="Modèle PDF" description="Sélectionnez le certificat vierge (sans nom) au format PDF. Taille maximale : 10 Mo."><Button onClick={() => fileInputRef.current?.click()} size="lg" className="mt-6 rounded-xl bg-[#D68C2D] text-white hover:bg-[#D68C2D]/90 px-8 h-12"><FileText className="mr-2 h-5 w-5" />Choisir un fichier PDF</Button></FieldTooltip>
                <input ref={fileInputRef} type="file" accept="application/pdf" onChange={handlePdfUpload} className="hidden" />
              </div>
              {pdfPreview && <div className="rounded-3xl border border-[#E5E7EB] bg-white p-4 shadow-sm"><iframe src={pdfPreview} className="h-[500px] w-full rounded-2xl" title="PDF Preview" /></div>}
              <div className="flex justify-end"><FieldTooltip label="Continuer" description="Passez à l'étape de positionnement du nom sur le certificat."><Button onClick={() => continueToStep(2)} disabled={!pdfFile} size="lg" className="rounded-xl bg-[#D68C2D] text-white hover:bg-[#D68C2D]/90 h-12 px-8">Continuer<ArrowRight className="ml-2 h-5 w-5" /></Button></FieldTooltip></div>
            </CardContent>
          </Card>
        )}

        {currentStep === 2 && (
          <div className="grid gap-6 lg:grid-cols-[1fr_420px]">
            <Card className="border-[#E5E7EB] bg-white shadow-sm rounded-2xl overflow-hidden">
              <CardHeader className="pb-4">
                <CardTitle className="font-heading text-xl font-bold text-[#1E1E1E] flex items-center gap-2"><MousePointer2 className="size-5 text-[#D68C2D]" />Aperçu interactif</CardTitle>
                <CardDescription className="text-[#6B7280]">Cliquez et glissez le nom directement sur le PDF pour le positionner.</CardDescription>
              </CardHeader>
              <CardContent>
                <InteractivePdfPreview pdfUrl={pdfPreview} textFields={[textField]} selectedFieldId={textField.id} onFieldMove={(_, x, y) => updateTextField({ x, y })} onFieldSelect={() => {}} className="w-full" />
              </CardContent>
            </Card>
            <div className="space-y-5">
              <Card className="border-[#E5E7EB] bg-white shadow-sm rounded-2xl">
                <CardHeader className="pb-4"><CardTitle className="flex items-center gap-2 font-heading text-lg font-bold text-[#1E1E1E]"><Settings className="size-5 text-[#D68C2D]" />2. Personnalisation du nom</CardTitle></CardHeader>
                <CardContent className="space-y-5">
                  <div className="rounded-xl border border-[#E5E7EB] bg-[#FAFAFA] p-5 space-y-4">
                    <FieldTooltip label="Position X" description="Déplace le nom horizontalement."><p className="text-sm font-semibold text-[#1E1E1E]">Position précise</p></FieldTooltip>
                    <div className="grid grid-cols-2 gap-4">
                      <div><Label className="text-xs font-medium text-[#6B7280]">X (px)</Label><Input type="number" value={textField.x} onChange={(e) => updateTextField({ x: parseInt(e.target.value) || 0 })} className="mt-1.5 h-11 border-[#E5E7EB] focus:border-[#D68C2D] focus:ring-[#D68C2D] rounded-xl" /></div>
                      <div><Label className="text-xs font-medium text-[#6B7280]">Y (px)</Label><Input type="number" value={textField.y} onChange={(e) => updateTextField({ y: parseInt(e.target.value) || 0 })} className="mt-1.5 h-11 border-[#E5E7EB] focus:border-[#D68C2D] focus:ring-[#D68C2D] rounded-xl" /></div>
                    </div>
                  </div>
                  <div className="rounded-xl border border-[#E5E7EB] bg-[#FAFAFA] p-5 space-y-4">
                    <p className="text-sm font-semibold text-[#1E1E1E]">Déplacement rapide</p>
                    <div className="mb-3"><FieldTooltip label="Pas de déplacement" description="Nombre de pixels dont le nom se déplace à chaque clic sur les flèches."><Label className="text-xs font-medium text-[#6B7280]">Pas (px)</Label></FieldTooltip><Input type="number" value={moveStep} onChange={(e) => setMoveStep(Math.max(1, parseInt(e.target.value) || 1))} min="1" className="mt-1.5 h-11 border-[#E5E7EB] focus:border-[#D68C2D] focus:ring-[#D68C2D] rounded-xl" /></div>
                    <div className="mx-auto grid w-40 grid-cols-3 gap-2">
                      <div /><Button size="icon" variant="outline" onClick={() => moveTextField(0, -moveStep)} className="h-11 w-11 rounded-xl border-[#E5E7EB] text-[#1E1E1E] hover:border-[#D68C2D] hover:bg-[#D68C2D]/10"><ArrowUp className="size-5" /></Button><div />
                      <Button size="icon" variant="outline" onClick={() => moveTextField(-moveStep, 0)} className="h-11 w-11 rounded-xl border-[#E5E7EB] text-[#1E1E1E] hover:border-[#D68C2D] hover:bg-[#D68C2D]/10"><ArrowLeft className="size-5" /></Button>
                      <Button size="icon" variant="outline" onClick={() => moveTextField(0, moveStep)} className="h-11 w-11 rounded-xl border-[#E5E7EB] text-[#1E1E1E] hover:border-[#D68C2D] hover:bg-[#D68C2D]/10"><ArrowDown className="size-5" /></Button>
                      <Button size="icon" variant="outline" onClick={() => moveTextField(moveStep, 0)} className="h-11 w-11 rounded-xl border-[#E5E7EB] text-[#1E1E1E] hover:border-[#D68C2D] hover:bg-[#D68C2D]/10"><ArrowRight className="size-5" /></Button>
                    </div>
                  </div>
                  <div className="rounded-xl border border-[#E5E7EB] bg-[#FAFAFA] p-5 space-y-4">
                    <p className="text-sm font-semibold text-[#1E1E1E]">Style du texte</p>
                    <div className="grid grid-cols-2 gap-4">
                      <div><FieldTooltip label="Taille du texte" description="Détermine la taille du nom sur le certificat."><Label className="text-xs font-medium text-[#6B7280]">Taille (px)</Label></FieldTooltip><Input type="number" value={textField.fontSize} onChange={(e) => updateTextField({ fontSize: parseInt(e.target.value) || 12 })} min="8" max="72" className="mt-1.5 h-11 border-[#E5E7EB] focus:border-[#D68C2D] focus:ring-[#D68C2D] rounded-xl" /></div>
                      <div><FieldTooltip label="Couleur" description="Couleur du texte imprimé sur le certificat."><Label className="text-xs font-medium text-[#6B7280]">Couleur</Label></FieldTooltip><div className="mt-1.5 flex gap-2"><Input type="color" value={textField.color} onChange={(e) => updateTextField({ color: e.target.value })} className="h-11 w-16 cursor-pointer border-[#E5E7EB] rounded-xl" /><Input value={textField.color} onChange={(e) => updateTextField({ color: e.target.value })} className="h-11 border-[#E5E7EB] focus:border-[#D68C2D] focus:ring-[#D68C2D] rounded-xl" /></div></div>
                    </div>
                    <div><FieldTooltip label="Police" description="Choisissez le style d'écriture utilisé pour le nom."><Label className="text-xs font-medium text-[#6B7280]">Famille de police</Label></FieldTooltip><select value={textField.fontFamily} onChange={(e) => updateTextField({ fontFamily: e.target.value as FontFamily, fontWeight: "Regular" })} className="mt-1.5 h-11 w-full rounded-xl border border-[#E5E7EB] bg-white px-3 text-[#1E1E1E] focus:border-[#D68C2D] focus:outline-none focus:ring-2 focus:ring-[#D68C2D]/20"><option value="Montserrat">Montserrat</option><option value="Poppins">Poppins</option><option value="Roboto">Roboto</option><option value="Great Vibes">Great Vibes</option></select></div>
                    <div><FieldTooltip label="Style de police" description="Gras ou normal. Great Vibes ne supporte que le style Regular."><Label className="text-xs font-medium text-[#6B7280]">Style de police</Label></FieldTooltip><select value={textField.fontWeight} onChange={(e) => updateTextField({ fontWeight: e.target.value as FontWeight })} disabled={textField.fontFamily === "Great Vibes"} className="mt-1.5 h-11 w-full rounded-xl border border-[#E5E7EB] bg-white px-3 text-[#1E1E1E] focus:border-[#D68C2D] focus:outline-none focus:ring-2 focus:ring-[#D68C2D]/20 disabled:opacity-50">{getAvailableWeights(textField.fontFamily).map((w) => <option key={w} value={w}>{w}</option>)}</select></div>
                    <FieldTooltip label="Continuer" description="Passez à l'ajout des participants une fois le nom positionné et stylisé."><Button onClick={() => continueToStep(3)} className="w-full h-12 rounded-xl bg-gradient-to-r from-[#D68C2D] to-[#12A2AC] text-white hover:shadow-lg transition-all">Continuer vers les participants</Button></FieldTooltip>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {currentStep === 3 && (
          <Card className="border-[#E5E7EB] bg-white shadow-sm">
            <CardHeader>
              <CardTitle className="font-heading text-2xl font-bold text-[#1E1E1E]">3. Ajoutez les participants</CardTitle>
              <CardDescription className="text-[#6B7280]">Choisissez entre la saisie manuelle ou l'import automatique.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <button type="button" onClick={() => setParticipantMode("manual")} className={`group rounded-2xl border-2 p-8 text-left transition-all ${participantMode === "manual" ? "border-[#D68C2D] bg-[#D68C2D]/5 shadow-md" : "border-[#E5E7EB] bg-white hover:border-[#D68C2D]/30 hover:shadow-sm"}`}>
                  <Users className="mb-4 h-12 w-12 text-[#D68C2D]" />
                  <h3 className="font-heading text-xl font-bold text-[#1E1E1E]">Saisie manuelle</h3>
                  <p className="mt-2 text-sm text-[#6B7280]">Ajoutez les participants un par un directement dans l'interface.</p>
                </button>
                <button type="button" onClick={() => setParticipantMode("excel")} className={`group rounded-2xl border-2 p-8 text-left transition-all ${participantMode === "excel" ? "border-[#D68C2D] bg-[#D68C2D]/5 shadow-md" : "border-[#E5E7EB] bg-white hover:border-[#D68C2D]/30 hover:shadow-sm"}`}>
                  <FileSpreadsheet className="mb-4 h-12 w-12 text-[#D68C2D]" />
                  <h3 className="font-heading text-xl font-bold text-[#1E1E1E]">Import Excel/CSV</h3>
                  <p className="mt-2 text-sm text-[#6B7280]">Importez automatiquement depuis un fichier Excel ou CSV.</p>
                </button>
              </div>
              {participantMode === "manual" && (
                <div className="rounded-2xl border border-[#E5E7EB] bg-[#FAFAFA] p-6">
                  <div className="grid gap-3">
                    <div>
                      <FieldTooltip label="Nom du participant" description="Saisissez le nom complet tel qu'il apparaîtra sur le certificat."><Label className="text-sm font-medium text-[#1E1E1E]">Nom du participant</Label></FieldTooltip>
                      <Input value={manualName} onChange={(e) => setManualName(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleAddName()} className="mt-2 border-[#E5E7EB] focus:border-[#D68C2D] focus:ring-[#D68C2D]" placeholder="Entrez le nom du participant" />
                    </div>
                  </div>
                  <FieldTooltip label="Ajouter" description="Ajoute ce nom à la liste des participants qui recevront un certificat."><Button onClick={handleAddName} className="mt-6 bg-[#D68C2D] text-white hover:bg-[#D68C2D]/90"><Plus className="mr-2 h-5 w-5" />Ajouter le participant</Button></FieldTooltip>
                </div>
              )}
              {participantMode === "excel" && (
                <div className="rounded-2xl border-2 border-dashed border-[#E5E7EB] bg-[#FAFAFA] p-12 text-center">
                  <FileSpreadsheet className="mx-auto mb-4 h-16 w-16 text-[#D68C2D]" />
                  <p className="mb-6 text-[#6B7280]">Les colonnes Email/Mail sont automatiquement détectées pour l'envoi.</p>
                  <FieldTooltip label="Importer" description="Chargez un fichier Excel ou CSV contenant une colonne de noms. Une colonne Email/Mail est automatiquement détectée."><Button onClick={() => excelInputRef.current?.click()} size="lg" className="bg-[#D68C2D] text-white hover:bg-[#D68C2D]/90"><Upload className="mr-2 h-5 w-5" />Importer Excel ou CSV</Button></FieldTooltip>
                  <input ref={excelInputRef} type="file" accept=".xlsx,.csv" onChange={handleExcelUpload} className="hidden" />
                </div>
              )}
              {importedColumns.length > 0 && <div className="flex flex-wrap gap-2">{importedColumns.map((col) => <span key={col} className={`rounded-full px-4 py-1.5 text-sm font-medium ${col === detectedEmailColumn ? "bg-[#12A2AC] text-white" : "bg-[#E5E7EB] text-[#1E1E1E]"}`}>{col}</span>)}</div>}
              {names.length > 0 && (
                <div className="max-h-96 space-y-2 overflow-y-auto rounded-xl border border-[#E5E7EB] bg-white p-4">
                  <p className="mb-3 text-sm font-medium text-[#6B7280]">{names.length} participant(s) ajouté(s)</p>
                  {names.map((item) => <NameItemComponent key={item.id} item={item} onDelete={handleDeleteName} onEdit={handleEditName} />)}
                </div>
              )}
              <div className="flex justify-end"><FieldTooltip label="Continuer" description="Passez à la configuration optionnelle d'envoi par email."><Button onClick={() => continueToStep(4)} disabled={names.length === 0} size="lg" className="bg-[#D68C2D] text-white hover:bg-[#D68C2D]/90">Continuer<ArrowRight className="ml-2 h-5 w-5" /></Button></FieldTooltip></div>
            </CardContent>
          </Card>
        )}

        {currentStep === 4 && (
          <Card className="border-[#E5E7EB] bg-white shadow-sm">
            <CardHeader><CardTitle className="font-heading text-2xl font-bold text-[#1E1E1E]">4. Email (optionnel)</CardTitle><CardDescription className="text-[#6B7280]">Activez l'envoi automatique par email ou conservez la génération ZIP classique.</CardDescription></CardHeader>
            <CardContent className="space-y-5">
              <FieldTooltip label="Envoi par email" description="Activez cette option pour envoyer automatiquement chaque certificat par email au participant correspondant.">
                <button type="button" onClick={() => setEmailEnabled(!emailEnabled)} className={`flex w-full items-center justify-between rounded-2xl border-2 p-6 transition-all ${emailEnabled ? "border-[#D68C2D] bg-[#D68C2D]/5 shadow-md" : "border-[#E5E7EB] bg-white hover:border-[#D68C2D]/30"}`}>
                  <span className="flex items-center gap-3 font-semibold text-[#1E1E1E]"><Mail className="size-6 text-[#D68C2D]" />Activer l'envoi automatique par email</span>
                  <span className={`h-7 w-12 rounded-full p-1 transition-colors ${emailEnabled ? "bg-[#D68C2D]" : "bg-[#E5E7EB]"}`}><span className={`block size-5 rounded-full bg-white shadow-sm transition-transform ${emailEnabled ? "translate-x-5" : ""}`} /></span>
                </button>
              </FieldTooltip>
              {emailEnabled && (
                <div className="grid gap-5 lg:grid-cols-2">
                  <div className="space-y-4">
                    <FieldTooltip label="Sujet" description="Le sujet de l'email que recevront les participants."><Input value={emailSubject} onChange={(e) => setEmailSubject(e.target.value)} className="border-[#E5E7EB] focus:border-[#D68C2D] focus:ring-[#D68C2D]" placeholder="Sujet de l'email" /></FieldTooltip>
                    <FieldTooltip label="Message" description="Corps de l'email. Utilisez les variables entre doubles accolades pour personnaliser le contenu."><textarea value={emailMessage} onChange={(e) => setEmailMessage(e.target.value)} rows={9} className="w-full rounded-xl border border-[#E5E7EB] bg-white p-3 text-sm text-[#1E1E1E] focus:border-[#D68C2D] focus:outline-none focus:ring-2 focus:ring-[#D68C2D]/20" placeholder="Message de l'email" /></FieldTooltip>
                    <p className="text-xs text-[#6B7280]">Variables disponibles: {"{{nom}}"} {"{{prénom}}"} {"{{email}}"} {"{{poste}}"}</p>
                  </div>
                  <div className="rounded-2xl border border-[#E5E7EB] bg-[#FAFAFA] p-6">
                    <p className="mb-2 text-sm font-medium text-[#6B7280]">Aperçu du message</p>
                    <h3 className="font-semibold text-[#1E1E1E]">{emailSubject}</h3>
                    <pre className="mt-4 whitespace-pre-wrap text-sm text-[#6B7280]">{renderEmailPreview()}</pre>
                  </div>
                </div>
              )}
              <div className="flex justify-end"><FieldTooltip label="Continuer" description="Passez à la dernière étape de résumé et de génération."><Button onClick={() => continueToStep(5)} size="lg" className="bg-[#D68C2D] text-white hover:bg-[#D68C2D]/90">Continuer<ArrowRight className="ml-2 h-5 w-5" /></Button></FieldTooltip></div>
            </CardContent>
          </Card>
        )}

        {currentStep === 5 && (
          <Card className="border-[#E5E7EB] bg-white shadow-sm">
            <CardHeader><CardTitle className="font-heading text-2xl font-bold text-[#1E1E1E]">5. Résumé et génération</CardTitle><CardDescription className="text-[#6B7280]">Vérifiez le résumé avant de générer vos certificats.</CardDescription></CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 md:grid-cols-4">
                <div className="rounded-2xl border border-[#E5E7EB] bg-[#FAFAFA] p-6"><p className="text-sm font-medium text-[#6B7280]">PDF</p><p className="mt-2 font-semibold text-[#1E1E1E]">{pdfFile?.name || "Aucun"}</p></div>
                <div className="rounded-2xl border border-[#E5E7EB] bg-[#FAFAFA] p-6"><p className="text-sm font-medium text-[#6B7280]">Participants</p><p className="mt-2 text-3xl font-bold text-[#D68C2D]">{names.length}</p></div>
                <div className="rounded-2xl border border-[#E5E7EB] bg-[#FAFAFA] p-6"><p className="text-sm font-medium text-[#6B7280]">Champs</p><p className="mt-2 text-3xl font-bold text-[#D68C2D]">1</p></div>
                <div className="rounded-2xl border border-[#E5E7EB] bg-[#FAFAFA] p-6"><p className="text-sm font-medium text-[#6B7280]">Emails</p><p className="mt-2 font-semibold text-[#1E1E1E]">{emailEnabled ? "Activé" : "Désactivé"}</p></div>
              </div>
              <FieldTooltip label="Générer les certificats" description="Lance la création de tous les certificats PDF et télécharge le fichier ZIP."><Button onClick={generateAndMaybeSendCertificates} disabled={!pdfFile || names.length === 0 || isGenerating} className="h-16 w-full bg-gradient-to-r from-[#D68C2D] to-[#12A2AC] text-lg font-bold text-white shadow-lg hover:shadow-xl transition-all">
                {isGenerating ? <><span className="mr-2 animate-spin">⏳</span>Génération en cours...</> : <><Download className="mr-2 h-6 w-6" />{emailEnabled ? "Générer et envoyer les certificats" : "Générer les certificats"}</>}
              </Button></FieldTooltip>
            </CardContent>
          </Card>
        )}
      </div>
      </main>
      {/* <FooterSection /> */}
    </div>
  );
}

// Composant pour afficher et éditer un nom
function NameItemComponent({
  item,
  onDelete,
  onEdit,
}: {
  item: NameItem;
  onDelete: (id: string) => void;
  onEdit: (id: string, name: string) => void;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(item.name);

  const handleSave = () => {
    if (editValue.trim()) {
      onEdit(item.id, editValue.trim());
      setIsEditing(false);
    }
  };

  return (
    <motion.div layout initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.25 }}
      className="flex items-center gap-3 rounded-xl border border-[#E5E7EB] bg-white p-3 shadow-sm transition-all hover:border-[#D68C2D]/30 hover:shadow-md">
      {isEditing ? (
        <>
          <Input value={editValue} onChange={(e) => setEditValue(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleSave()} className="flex-1 border-[#E5E7EB] text-sm focus:border-[#D68C2D] focus:ring-[#D68C2D]" autoFocus />
          <Button size="icon" variant="ghost" onClick={handleSave} className="h-8 w-8 text-[#12A2AC] hover:bg-[#12A2AC]/10"><CheckCircle2 className="h-4 w-4" /></Button>
        </>
      ) : (
        <>
          <span className="flex-1 text-sm font-medium text-[#1E1E1E]">{item.name}</span>
          {item.email && <span className="text-xs text-[#12A2AC] bg-[#12A2AC]/10 px-2 py-0.5 rounded-full">{item.email}</span>}
          <Button size="icon" variant="ghost" onClick={() => setIsEditing(true)} className="h-8 w-8 text-[#6B7280] hover:bg-[#D68C2D]/10 hover:text-[#D68C2D]"><Edit2 className="h-4 w-4" /></Button>
          <Button size="icon" variant="ghost" onClick={() => onDelete(item.id)} className="h-8 w-8 text-[#6B7280] hover:bg-red-50 hover:text-red-600"><Trash2 className="h-4 w-4" /></Button>
        </>
      )}
    </motion.div>
  );
}
