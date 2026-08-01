"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { PDFDocument, rgb, degrees } from "pdf-lib";
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
  ArrowRight,
  CheckCircle2,
  Info,
  MousePointer2,
  Mail,
  Users,
  AlertCircle,
  Image as ImageIcon,
} from "lucide-react";
import { toast } from "sonner";
import { ClientSidebar } from "@/components/ui/client-sidebar";
import { CertificateCanvasEditor, type CanvasObject } from "@/components/ui/certificate-canvas-editor";
import { CampaignOptionsPanel, DEFAULT_CAMPAIGN_OPTIONS, type CampaignOptions } from "@/components/ui/campaign-options-panel";
import { FONT_CONFIGS, type FontFamily, type FontWeight, getFontFile, normalizeWeightForFamily, hexToRgb01 } from "@/lib/fonts";

type NameItem = {
  id: string;
  name: string;
  email?: string;
  record: Record<string, string>;
};

const DEFAULT_NAME_DATA_KEY = "Nom";

type WizardStep = 1 | 2 | 3 | 4 | 5;
type ParticipantMode = "manual" | "excel";
type AppModule = "generate" | "campaign";
type BackgroundType = "blank" | "image" | "pdf";

const generateSteps: { id: WizardStep; label: string; shortLabel: string }[] = [
  { id: 1, label: "Fond du certificat", shortLabel: "Fond" },
  { id: 2, label: "Éditeur visuel", shortLabel: "Éditeur" },
  { id: 3, label: "Envoi email", shortLabel: "Email" },
  { id: 4, label: "Participants", shortLabel: "Participants" },
  { id: 5, label: "Validation", shortLabel: "Valider" },
];

const campaignSteps: { id: WizardStep; label: string; shortLabel: string }[] = [
  { id: 1, label: "Créer la campagne", shortLabel: "Campagne" },
  { id: 2, label: "Certificat", shortLabel: "Éditeur" },
  { id: 3, label: "Conditions", shortLabel: "Conditions" },
  { id: 4, label: "Quiz", shortLabel: "Quiz" },
  { id: 5, label: "Publication", shortLabel: "Publier" },
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
  const bgImageInputRef = useRef<HTMLInputElement>(null);
  const campaignImageInputRef = useRef<HTMLInputElement>(null);
  const [activeModule, setActiveModule] = useState<AppModule | null>(null);
  const [backgroundType, setBackgroundType] = useState<BackgroundType>("blank");
  const [backgroundImage, setBackgroundImage] = useState<string | null>(null);
  const [backgroundImageName, setBackgroundImageName] = useState<string | null>(null);
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [pdfPreview, setPdfPreview] = useState<string | null>(null);
  const [campaignName, setCampaignName] = useState("");
  const [campaignDesc, setCampaignDesc] = useState("");
  const [campaignOrganizer, setCampaignOrganizer] = useState("");
  const [campaignLocation, setCampaignLocation] = useState("");
  const [campaignDate, setCampaignDate] = useState("");
  const [campaignTime, setCampaignTime] = useState("");
  const [campaignImage, setCampaignImage] = useState<string | null>(null);
  const [quizQuestions, setQuizQuestions] = useState<{ id: string; question: string; answers: string[]; correctIndex: number }[]>([]);
  const [names, setNames] = useState<NameItem[]>([]);
  const [manualName, setManualName] = useState("");
  const [canvasObjects, setCanvasObjects] = useState<CanvasObject[]>([
    {
      id: "name-field", type: "text", name: "Nom du participant", dataKey: DEFAULT_NAME_DATA_KEY, fallbackText: "KOUADIO JEAN-MARC",
      x: 300, y: 400, width: 260, height: 42, rotation: 0, opacity: 1, zIndex: 1, visible: true, locked: false,
      fontSize: 32, color: "#000000", fontFamily: "Montserrat", fontWeight: "Bold", textAlign: "left",
    },
  ]);
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
  const [campaignId] = useState(() => Math.random().toString(36).slice(2, 10));
  const [campaignOptions, setCampaignOptions] = useState<CampaignOptions>(DEFAULT_CAMPAIGN_OPTIONS);
  const fontBytesCacheRef = useRef<Map<string, Uint8Array>>(new Map());
  const previewUrlRef = useRef<string | null>(null);

  const resolveFieldFontFile = (fontFamily: FontFamily, fontWeight: FontWeight): string => {
    const normalizedWeight = normalizeWeightForFamily(fontFamily, fontWeight);
    return getFontFile(fontFamily, normalizedWeight);
  };

  const textObjects = canvasObjects.filter((o): o is CanvasObject & { type: "text" } => o.type === "text");
  const availableDataKeys = Array.from(
    new Set([DEFAULT_NAME_DATA_KEY, ...importedColumns])
  );

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
    setBackgroundType("pdf");
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setPdfPreview(result);
    };
    reader.readAsDataURL(file);
    prouvToast.success("PDF modèle chargé avec succès");
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!["image/png", "image/jpeg", "image/jpg", "image/webp"].includes(file.type)) {
      prouvToast.error("Formats acceptés : PNG, JPG, WEBP");
      return;
    }
    const reader = new FileReader();
    reader.onload = (ev) => {
      setBackgroundImage(ev.target?.result as string);
      setBackgroundImageName(file.name);
      setBackgroundType("image");
      setPdfFile(null);
      setPdfPreview(null);
      prouvToast.success("Image de fond chargée");
    };
    reader.readAsDataURL(file);
  };

  const handleCampaignImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setCampaignImage(ev.target?.result as string);
    reader.readAsDataURL(file);
  };

  const selectBlankBackground = () => {
    setBackgroundType("blank");
    setBackgroundImage(null);
    setBackgroundImageName(null);
    setPdfFile(null);
    setPdfPreview(null);
    prouvToast.info("Certificat vierge sélectionné");
  };

  const handlePdfDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDraggingPdf(false);
    await handlePdfFile(e.dataTransfer.files?.[0]);
  };

  const handleAddName = () => {
    const trimmed = manualName.trim();
    if (!trimmed) { prouvToast.error("Veuillez entrer un nom"); return; }
    const newItem: NameItem = { id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`, name: trimmed, record: { [DEFAULT_NAME_DATA_KEY]: trimmed } };
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
        const record: Record<string, string> = { [DEFAULT_NAME_DATA_KEY]: name.trim() };
        columns.forEach((col) => {
          if (row[col] !== undefined && row[col] !== null) record[col] = String(row[col]).trim();
        });
        importedNames.push({ id: `excel-${Date.now()}-${index}`, name: name.trim(), email: emailColumn && row[emailColumn] ? String(row[emailColumn]).trim() : undefined, record });
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
    const uniqueFontKeys = new Set(textObjects.map((o) => resolveFieldFontFile(o.fontFamily as FontFamily, o.fontWeight as FontWeight)));

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
  const dataUrlToBytes = (dataUrl: string): { bytes: Uint8Array; isPng: boolean } => {
    const [header, base64] = dataUrl.split(",");
    const isPng = header.includes("image/png");
    const binary = atob(base64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
    return { bytes, isPng };
  };

  const embedImagesForDocument = async (pdfDoc: PDFDocument): Promise<Map<string, any>> => {
    const map = new Map<string, any>();
    const imageObjects = canvasObjects.filter((o) => o.type === "image" && o.src);
    for (const obj of imageObjects) {
      if (!obj.src || map.has(obj.src)) continue;
      try {
        const { bytes, isPng } = dataUrlToBytes(obj.src);
        const embedded = isPng ? await pdfDoc.embedPng(bytes) : await pdfDoc.embedJpg(bytes);
        map.set(obj.src, embedded);
      } catch (error) {
        console.error("Impossible d'intégrer l'image", error);
      }
    }
    return map;
  };

  const drawCanvasObjectsOnPage = (
    page: any,
    pageHeight: number,
    embeddedFonts: Map<string, any>,
    embeddedImages: Map<string, any>,
    record: Record<string, string> | undefined
  ) => {
    const sorted = [...canvasObjects].filter((o) => o.visible).sort((a, b) => a.zIndex - b.zIndex);
    for (const obj of sorted) {
      if (obj.type === "text") {
        const value = (obj.dataKey && record && record[obj.dataKey]) || obj.fallbackText || "";
        if (!value) continue;
        const colorRgb = hexToRgb01(obj.color || "#000000");
        const fontFile = resolveFieldFontFile(obj.fontFamily as FontFamily, obj.fontWeight as FontWeight);
        const font = embeddedFonts.get(fontFile);
        if (font) {
          page.drawText(value, {
            x: obj.x,
            y: pageHeight - obj.y,
            size: obj.fontSize || 24,
            font,
            color: rgb(colorRgb.r, colorRgb.g, colorRgb.b),
            rotate: degrees(obj.rotation || 0),
            opacity: obj.opacity,
          });
        }
      } else if (obj.type === "image" && obj.src) {
        const embedded = embeddedImages.get(obj.src);
        if (embedded) {
          page.drawImage(embedded, {
            x: obj.x,
            y: pageHeight - obj.y - obj.height,
            width: obj.width,
            height: obj.height,
            rotate: degrees(obj.rotation || 0),
            opacity: obj.opacity,
          });
        }
      } else if (obj.type === "rect") {
        const fillRgb = hexToRgb01((obj.fill || "#D68C2D").slice(0, 7));
        const strokeRgb = hexToRgb01(obj.stroke || "#D68C2D");
        page.drawRectangle({
          x: obj.x,
          y: pageHeight - obj.y - obj.height,
          width: obj.width,
          height: obj.height,
          color: rgb(fillRgb.r, fillRgb.g, fillRgb.b),
          borderColor: rgb(strokeRgb.r, strokeRgb.g, strokeRgb.b),
          borderWidth: obj.strokeWidth || 1,
          rotate: degrees(obj.rotation || 0),
          opacity: obj.opacity,
        });
      } else if (obj.type === "ellipse") {
        const fillRgb = hexToRgb01((obj.fill || "#12A2AC").slice(0, 7));
        const strokeRgb = hexToRgb01(obj.stroke || "#12A2AC");
        page.drawEllipse({
          x: obj.x + obj.width / 2,
          y: pageHeight - obj.y - obj.height / 2,
          xScale: obj.width / 2,
          yScale: obj.height / 2,
          color: rgb(fillRgb.r, fillRgb.g, fillRgb.b),
          borderColor: rgb(strokeRgb.r, strokeRgb.g, strokeRgb.b),
          borderWidth: obj.strokeWidth || 1,
          opacity: obj.opacity,
        });
      } else if (obj.type === "line") {
        const strokeRgb = hexToRgb01(obj.stroke || "#1E1E1E");
        page.drawLine({
          start: { x: obj.x, y: pageHeight - obj.y },
          end: { x: obj.x + obj.width, y: pageHeight - obj.y },
          thickness: obj.strokeWidth || 1,
          color: rgb(strokeRgb.r, strokeRgb.g, strokeRgb.b),
          opacity: obj.opacity,
        });
      } else if (obj.type === "qr") {
        // Placeholder visuel : le QR unique sera généré lors du lancement de la campagne (backend)
        page.drawRectangle({
          x: obj.x,
          y: pageHeight - obj.y - obj.height,
          width: obj.width,
          height: obj.height,
          borderColor: rgb(0.12, 0.12, 0.12),
          borderWidth: 1,
          opacity: obj.opacity,
        });
      }
    }
  };

  const generateCertificates = async () => {
    if (names.length === 0) {
      prouvToast.error("Veuillez ajouter au moins un nom");
      return;
    }

    setIsGenerating(true);

    try {
      const zip = new JSZip();
      let templateBytes: ArrayBuffer | null = null;

      if (pdfFile) {
        templateBytes = await pdfFile.arrayBuffer();
      }

      for (const nameItem of names) {
        let pdfDoc: PDFDocument;
        if (templateBytes) {
          pdfDoc = await PDFDocument.load(templateBytes);
        } else {
          pdfDoc = await PDFDocument.create();
          pdfDoc.addPage([842, 595]); // A4 landscape
        }
        const pages = pdfDoc.getPages();
        const firstPage = pages[0];
        const { height } = firstPage.getSize();
        const embeddedFonts = await getEmbeddedFontsForDocument(pdfDoc);
        const embeddedImages = await embedImagesForDocument(pdfDoc);

        // If image background, embed it and draw it as full-page background
        if (backgroundImage && !pdfFile) {
          try {
            const { bytes, isPng } = dataUrlToBytes(backgroundImage);
            const bgImg = isPng ? await pdfDoc.embedPng(bytes) : await pdfDoc.embedJpg(bytes);
            firstPage.drawImage(bgImg, { x: 0, y: 0, width: 842, height: 595 });
          } catch (e) {
            console.error("Impossible d'intégrer l'image de fond", e);
          }
        }

        drawCanvasObjectsOnPage(firstPage, height, embeddedFonts, embeddedImages, nameItem.record);

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
    if (!pdfFile && !backgroundImage) {
      return;
    }

    try {
      let pdfDoc: PDFDocument;
      if (pdfFile) {
        const pdfBytes = await pdfFile.arrayBuffer();
        pdfDoc = await PDFDocument.load(pdfBytes);
      } else {
        pdfDoc = await PDFDocument.create();
        pdfDoc.addPage([842, 595]);
      }
      const pages = pdfDoc.getPages();
      const firstPage = pages[0];
      const { height } = firstPage.getSize();

      const embeddedFonts = await getEmbeddedFontsForDocument(pdfDoc);
      const embeddedImages = await embedImagesForDocument(pdfDoc);

      if (backgroundImage && !pdfFile) {
        try {
          const { bytes, isPng } = dataUrlToBytes(backgroundImage);
          const bgImg = isPng ? await pdfDoc.embedPng(bytes) : await pdfDoc.embedJpg(bytes);
          firstPage.drawImage(bgImg, { x: 0, y: 0, width: 842, height: 595 });
        } catch (e) {
          console.error("Impossible d'intégrer l'image de fond", e);
        }
      }

      const activeName = names[0];
      drawCanvasObjectsOnPage(firstPage, height, embeddedFonts, embeddedImages, activeName?.record);

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
  }, [pdfFile, backgroundImage, canvasObjects, names]);

  useEffect(() => {
    return () => {
      if (previewUrlRef.current) {
        URL.revokeObjectURL(previewUrlRef.current);
      }
    };
  }, []);


  const wizardSteps = activeModule === "campaign" ? campaignSteps : generateSteps;

  const canValidateStep = (step: WizardStep) => {
    if (activeModule === "campaign") {
      if (step === 1) return Boolean(campaignName.trim());
      if (step === 2) return canvasObjects.length > 0;
      return true;
    }
    if (step === 1) return backgroundType !== "blank" || true;
    if (step === 2) return canvasObjects.length > 0;
    if (step === 3) return !emailEnabled || names.some((item) => item.email);
    if (step === 4) return names.length > 0;
    return Boolean(names.length > 0);
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
          {/* Module selection screen */}
          {!activeModule && (
            <div>
              <div className="mb-10 text-center">
                <h1 className="font-heading text-4xl font-bold text-[#1E1E1E]">Que souhaitez-vous faire ?</h1>
                <p className="mt-3 text-lg text-[#6B7280]">Choisissez le mode qui correspond à votre besoin.</p>
              </div>
              <div className="mx-auto grid max-w-4xl gap-8 md:grid-cols-2">
                <button type="button" onClick={() => { setActiveModule("generate"); setCurrentStep(1); }} className="group relative overflow-hidden rounded-3xl border-2 border-[#E5E7EB] bg-white p-10 text-left shadow-sm transition-all duration-300 hover:border-[#D68C2D] hover:shadow-xl">
                  <div className="absolute right-0 top-0 h-40 w-40 rounded-bl-full bg-gradient-to-br from-[#D68C2D]/10 to-transparent transition-all group-hover:from-[#D68C2D]/20" />
                  <div className="relative">
                    <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-[#D68C2D] to-[#f0b35c] text-white shadow-lg"><FileText className="size-8" /></div>
                    <h2 className="font-heading text-2xl font-bold text-[#1E1E1E]">Générer un certificat</h2>
                    <p className="mt-3 text-sm leading-relaxed text-[#6B7280]">Créez et produisez immédiatement vos certificats. Importez vos participants, personnalisez le design et téléchargez en ZIP.</p>
                    <div className="mt-6 flex flex-wrap gap-2">
                      <span className="rounded-full bg-[#D68C2D]/10 px-3 py-1 text-xs font-medium text-[#D68C2D]">Rapide</span>
                      <span className="rounded-full bg-[#D68C2D]/10 px-3 py-1 text-xs font-medium text-[#D68C2D]">Liste manuelle</span>
                      <span className="rounded-full bg-[#D68C2D]/10 px-3 py-1 text-xs font-medium text-[#D68C2D]">Import Excel</span>
                    </div>
                    <div className="mt-8 flex items-center gap-2 font-semibold text-[#D68C2D] transition-all group-hover:gap-3">Commencer<ArrowRight className="size-5" /></div>
                  </div>
                </button>
                <button type="button" onClick={() => { setActiveModule("campaign"); setCurrentStep(1); }} className="group relative overflow-hidden rounded-3xl border-2 border-[#E5E7EB] bg-white p-10 text-left shadow-sm transition-all duration-300 hover:border-[#12A2AC] hover:shadow-xl">
                  <div className="absolute right-0 top-0 h-40 w-40 rounded-bl-full bg-gradient-to-br from-[#12A2AC]/10 to-transparent transition-all group-hover:from-[#12A2AC]/20" />
                  <div className="relative">
                    <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-[#12A2AC] to-[#5fd6dc] text-white shadow-lg"><Users className="size-8" /></div>
                    <h2 className="font-heading text-2xl font-bold text-[#1E1E1E]">Créer une campagne</h2>
                    <p className="mt-3 text-sm leading-relaxed text-[#6B7280]">Les participants remplissent eux-mêmes leurs informations. Lancez une campagne autonome avec quiz, validations et lien sécurisé.</p>
                    <div className="mt-6 flex flex-wrap gap-2">
                      <span className="rounded-full bg-[#12A2AC]/10 px-3 py-1 text-xs font-medium text-[#12A2AC]">Autonome</span>
                      <span className="rounded-full bg-[#12A2AC]/10 px-3 py-1 text-xs font-medium text-[#12A2AC]">Quiz</span>
                      <span className="rounded-full bg-[#12A2AC]/10 px-3 py-1 text-xs font-medium text-[#12A2AC]">Lien sécurisé</span>
                    </div>
                    <div className="mt-8 flex items-center gap-2 font-semibold text-[#12A2AC] transition-all group-hover:gap-3">Commencer<ArrowRight className="size-5" /></div>
                  </div>
                </button>
              </div>
            </div>
          )}

          {/* Generate module workflow */}
          {activeModule === "generate" && (
            <>
              <div className="mb-8">
                <div className="flex items-center gap-3 mb-2">
                  <button onClick={() => { setActiveModule(null); setCurrentStep(1); setMaxValidatedStep(1); }} className="text-sm text-[#6B7280] hover:text-[#D68C2D] transition-colors">← Retour</button>
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#D68C2D]/10"><FileText className="h-5 w-5 text-[#D68C2D]" /></div>
                  <h1 className="font-heading text-3xl font-bold text-[#1E1E1E]">Générer un certificat</h1>
                </div>
                <p className="text-base text-[#6B7280]">Créez votre certificat, ajoutez vos participants et générez en quelques clics.</p>
              </div>
              <StepProgressBar steps={wizardSteps} currentStep={currentStep} maxValidatedStep={maxValidatedStep} onStepClick={goToStep} />

              {/* Step 1: Background selection */}
              {currentStep === 1 && (
                <Card className="border-[#E5E7EB] bg-white shadow-sm rounded-2xl overflow-hidden">
                  <CardHeader className="pb-2">
                    <CardTitle className="font-heading text-2xl font-bold text-[#1E1E1E]">1. Choisir un fond</CardTitle>
                    <CardDescription className="text-[#6B7280] text-base">Démarrez avec un certificat vierge, une image ou un PDF (option avancée).</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6 pb-8">
                    <div className="grid gap-5 md:grid-cols-3">
                      <button type="button" onClick={selectBlankBackground} className={`group rounded-2xl border-2 p-8 text-center transition-all ${backgroundType === "blank" ? "border-[#D68C2D] bg-[#D68C2D]/5 shadow-md" : "border-[#E5E7EB] bg-white hover:border-[#D68C2D]/30 hover:shadow-sm"}`}>
                        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#D68C2D]/10"><Plus className="size-8 text-[#D68C2D]" /></div>
                        <h3 className="font-heading text-lg font-bold text-[#1E1E1E]">Vierge</h3>
                        <p className="mt-1 text-xs text-[#6B7280]">Canvas blanc</p>
                      </button>
                      <button type="button" onClick={() => bgImageInputRef.current?.click()} className={`group rounded-2xl border-2 p-8 text-center transition-all ${backgroundType === "image" ? "border-[#D68C2D] bg-[#D68C2D]/5 shadow-md" : "border-[#E5E7EB] bg-white hover:border-[#D68C2D]/30 hover:shadow-sm"}`}>
                        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#12A2AC]/10"><ImageIcon className="size-8 text-[#12A2AC]" /></div>
                        <h3 className="font-heading text-lg font-bold text-[#1E1E1E]">Importer une image</h3>
                        <p className="mt-1 text-xs text-[#6B7280]">PNG, JPG, WEBP</p>
                        {backgroundImageName && <p className="mt-2 text-xs font-medium text-[#D68C2D] truncate">{backgroundImageName}</p>}
                      </button>
                      <input ref={bgImageInputRef} type="file" accept="image/png,image/jpeg,image/jpg,image/webp" onChange={handleImageUpload} className="hidden" />
                      <button type="button" onClick={() => fileInputRef.current?.click()} className={`group rounded-2xl border-2 p-8 text-center transition-all ${backgroundType === "pdf" ? "border-[#D68C2D] bg-[#D68C2D]/5 shadow-md" : "border-[#E5E7EB] bg-white hover:border-[#D68C2D]/30 hover:shadow-sm"}`}>
                        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#1E1E1E]/10"><FileText className="size-8 text-[#1E1E1E]" /></div>
                        <h3 className="font-heading text-lg font-bold text-[#1E1E1E]">Importer un PDF</h3>
                        <p className="mt-1 text-xs text-[#6B7280]">Option avancée</p>
                        {pdfFile && <p className="mt-2 text-xs font-medium text-[#D68C2D] truncate">{pdfFile.name}</p>}
                      </button>
                      <input ref={fileInputRef} type="file" accept="application/pdf" onChange={handlePdfUpload} className="hidden" />
                    </div>
                    {(backgroundImage || pdfPreview) && (
                      <div className="rounded-3xl border border-[#E5E7EB] bg-white p-4 shadow-sm">
                        {backgroundImage ? <img src={backgroundImage} alt="Aperçu" className="mx-auto max-h-[400px] rounded-2xl object-contain" /> : <iframe src={pdfPreview || ""} className="h-[400px] w-full rounded-2xl" title="PDF Preview" />}
                      </div>
                    )}
                    <div className="flex justify-end"><Button onClick={() => continueToStep(2)} size="lg" className="rounded-xl bg-[#D68C2D] text-white hover:bg-[#D68C2D]/90 h-12 px-8">Continuer<ArrowRight className="ml-2 h-5 w-5" /></Button></div>
                  </CardContent>
                </Card>
              )}

              {/* Step 2: Editor */}
              {currentStep === 2 && (
                <Card className="border-[#E5E7EB] bg-white shadow-sm rounded-2xl overflow-hidden">
                  <CardHeader className="pb-4">
                    <CardTitle className="font-heading text-xl font-bold text-[#1E1E1E] flex items-center gap-2"><MousePointer2 className="size-5 text-[#D68C2D]" />2. Éditeur visuel</CardTitle>
                    <CardDescription className="text-[#6B7280]">Ajoutez et positionnez vos éléments librement sur le certificat.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-5">
                    <CertificateCanvasEditor
                      pdfUrl={pdfPreview}
                      backgroundImageUrl={backgroundImage}
                      objects={canvasObjects}
                      onObjectsChange={setCanvasObjects}
                      availableDataKeys={availableDataKeys}
                      previewRecord={names[0]?.record}
                    />
                    <div className="flex justify-end"><Button onClick={() => continueToStep(3)} className="h-12 rounded-xl bg-gradient-to-r from-[#D68C2D] to-[#12A2AC] text-white hover:shadow-lg transition-all px-8">Continuer<ArrowRight className="ml-2 h-5 w-5" /></Button></div>
                  </CardContent>
                </Card>
              )}

              {/* Step 3: Email config */}
              {currentStep === 3 && (
                <Card className="border-[#E5E7EB] bg-white shadow-sm">
                  <CardHeader><CardTitle className="font-heading text-2xl font-bold text-[#1E1E1E]">3. Envoi par email</CardTitle><CardDescription className="text-[#6B7280]">Souhaitez-vous envoyer les certificats par email ?</CardDescription></CardHeader>
                  <CardContent className="space-y-5">
                    <div className="grid gap-4 md:grid-cols-2">
                      <button type="button" onClick={() => setEmailEnabled(false)} className={`rounded-2xl border-2 p-8 text-center transition-all ${!emailEnabled ? "border-[#D68C2D] bg-[#D68C2D]/5 shadow-md" : "border-[#E5E7EB] bg-white hover:border-[#D68C2D]/30"}`}>
                        <Download className="mx-auto mb-3 size-10 text-[#6B7280]" /><h3 className="font-heading text-lg font-bold text-[#1E1E1E]">Non</h3><p className="mt-1 text-sm text-[#6B7280]">Téléchargement ZIP uniquement</p>
                      </button>
                      <button type="button" onClick={() => setEmailEnabled(true)} className={`rounded-2xl border-2 p-8 text-center transition-all ${emailEnabled ? "border-[#D68C2D] bg-[#D68C2D]/5 shadow-md" : "border-[#E5E7EB] bg-white hover:border-[#D68C2D]/30"}`}>
                        <Mail className="mx-auto mb-3 size-10 text-[#D68C2D]" /><h3 className="font-heading text-lg font-bold text-[#1E1E1E]">Oui</h3><p className="mt-1 text-sm text-[#6B7280]">Envoi automatique aux participants</p>
                      </button>
                    </div>
                    {emailEnabled && (
                      <div className="grid gap-5 lg:grid-cols-2">
                        <div className="space-y-4">
                          <FieldTooltip label="Sujet" description="Le sujet de l'email."><Input value={emailSubject} onChange={(e) => setEmailSubject(e.target.value)} className="border-[#E5E7EB] focus:border-[#D68C2D] focus:ring-[#D68C2D]" placeholder="Sujet de l'email" /></FieldTooltip>
                          <FieldTooltip label="Message" description="Corps de l'email avec variables."><textarea value={emailMessage} onChange={(e) => setEmailMessage(e.target.value)} rows={9} className="w-full rounded-xl border border-[#E5E7EB] bg-white p-3 text-sm text-[#1E1E1E] focus:border-[#D68C2D] focus:outline-none focus:ring-2 focus:ring-[#D68C2D]/20" placeholder="Message de l'email" /></FieldTooltip>
                          <p className="text-xs text-[#6B7280]">Variables: {"{{nom}}"} {"{{prénom}}"} {"{{email}}"} {"{{formation}}"} {"{{date}}"}</p>
                        </div>
                        <div className="rounded-2xl border border-[#E5E7EB] bg-[#FAFAFA] p-6">
                          <p className="mb-2 text-sm font-medium text-[#6B7280]">Aperçu</p>
                          <h3 className="font-semibold text-[#1E1E1E]">{emailSubject}</h3>
                          <pre className="mt-4 whitespace-pre-wrap text-sm text-[#6B7280]">{renderEmailPreview()}</pre>
                        </div>
                      </div>
                    )}
                    <div className="flex justify-end"><Button onClick={() => continueToStep(4)} size="lg" className="bg-[#D68C2D] text-white hover:bg-[#D68C2D]/90">Continuer<ArrowRight className="ml-2 h-5 w-5" /></Button></div>
                  </CardContent>
                </Card>
              )}

              {/* Step 4: Participants */}
              {currentStep === 4 && (
                <Card className="border-[#E5E7EB] bg-white shadow-sm">
                  <CardHeader>
                    <CardTitle className="font-heading text-2xl font-bold text-[#1E1E1E]">4. Ajoutez les participants</CardTitle>
                    <CardDescription className="text-[#6B7280]">Saisie manuelle ou import automatique.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid gap-4 md:grid-cols-2">
                      <button type="button" onClick={() => setParticipantMode("manual")} className={`group rounded-2xl border-2 p-8 text-left transition-all ${participantMode === "manual" ? "border-[#D68C2D] bg-[#D68C2D]/5 shadow-md" : "border-[#E5E7EB] bg-white hover:border-[#D68C2D]/30 hover:shadow-sm"}`}>
                        <Users className="mb-4 h-12 w-12 text-[#D68C2D]" /><h3 className="font-heading text-xl font-bold text-[#1E1E1E]">Saisie manuelle</h3><p className="mt-2 text-sm text-[#6B7280]">Ajoutez les participants un par un.</p>
                      </button>
                      <button type="button" onClick={() => setParticipantMode("excel")} className={`group rounded-2xl border-2 p-8 text-left transition-all ${participantMode === "excel" ? "border-[#D68C2D] bg-[#D68C2D]/5 shadow-md" : "border-[#E5E7EB] bg-white hover:border-[#D68C2D]/30 hover:shadow-sm"}`}>
                        <FileSpreadsheet className="mb-4 h-12 w-12 text-[#D68C2D]" /><h3 className="font-heading text-xl font-bold text-[#1E1E1E]">Import Excel/CSV</h3><p className="mt-2 text-sm text-[#6B7280]">Importez depuis un fichier.</p>
                      </button>
                    </div>
                    {participantMode === "manual" && (
                      <div className="rounded-2xl border border-[#E5E7EB] bg-[#FAFAFA] p-6">
                        <FieldTooltip label="Nom du participant" description="Saisissez le nom complet."><Label className="text-sm font-medium text-[#1E1E1E]">Nom du participant</Label></FieldTooltip>
                        <Input value={manualName} onChange={(e) => setManualName(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleAddName()} className="mt-2 border-[#E5E7EB] focus:border-[#D68C2D] focus:ring-[#D68C2D]" placeholder="Entrez le nom du participant" />
                        {emailEnabled && (<><Label className="mt-4 text-sm font-medium text-[#1E1E1E]">Email (optionnel)</Label><Input className="mt-2 border-[#E5E7EB] focus:border-[#D68C2D] focus:ring-[#D68C2D]" placeholder="email@exemple.com" /></>)}
                        <Button onClick={handleAddName} className="mt-6 bg-[#D68C2D] text-white hover:bg-[#D68C2D]/90"><Plus className="mr-2 h-5 w-5" />Ajouter le participant</Button>
                      </div>
                    )}
                    {participantMode === "excel" && (
                      <div className="rounded-2xl border-2 border-dashed border-[#E5E7EB] bg-[#FAFAFA] p-12 text-center">
                        <FileSpreadsheet className="mx-auto mb-4 h-16 w-16 text-[#D68C2D]" />
                        <p className="mb-6 text-[#6B7280]">Les colonnes Email/Mail sont automatiquement détectées.</p>
                        <Button onClick={() => excelInputRef.current?.click()} size="lg" className="bg-[#D68C2D] text-white hover:bg-[#D68C2D]/90"><Upload className="mr-2 h-5 w-5" />Importer Excel ou CSV</Button>
                        <input ref={excelInputRef} type="file" accept=".xlsx,.csv" onChange={handleExcelUpload} className="hidden" />
                      </div>
                    )}
                    {importedColumns.length > 0 && <div className="flex flex-wrap gap-2">{importedColumns.map((col) => <span key={col} className={`rounded-full px-4 py-1.5 text-sm font-medium ${col === detectedEmailColumn ? "bg-[#12A2AC] text-white" : "bg-[#E5E7EB] text-[#1E1E1E]"}`}>{col}</span>)}</div>}
                    {names.length > 0 && (
                      <div className="max-h-96 space-y-2 overflow-y-auto rounded-xl border border-[#E5E7EB] bg-white p-4">
                        <p className="mb-3 text-sm font-medium text-[#6B7280]">{names.length} participant(s)</p>
                        {names.map((item) => <NameItemComponent key={item.id} item={item} onDelete={handleDeleteName} onEdit={handleEditName} />)}
                      </div>
                    )}
                    <div className="flex justify-end"><Button onClick={() => continueToStep(5)} disabled={names.length === 0} size="lg" className="bg-[#D68C2D] text-white hover:bg-[#D68C2D]/90">Continuer<ArrowRight className="ml-2 h-5 w-5" /></Button></div>
                  </CardContent>
                </Card>
              )}

              {/* Step 5: Validation */}
              {currentStep === 5 && (
                <div className="space-y-6">
                  <Card className="border-[#E5E7EB] bg-white shadow-sm">
                    <CardHeader><CardTitle className="font-heading text-2xl font-bold text-[#1E1E1E]">5. Résumé</CardTitle><CardDescription className="text-[#6B7280]">Vérifiez avant de générer.</CardDescription></CardHeader>
                    <CardContent className="space-y-6">
                      <div className="grid gap-4 md:grid-cols-4">
                        <div className="rounded-2xl border border-[#E5E7EB] bg-[#FAFAFA] p-6"><p className="text-sm font-medium text-[#6B7280]">Fond</p><p className="mt-2 font-semibold text-[#1E1E1E]">{backgroundType === "image" ? backgroundImageName : backgroundType === "pdf" ? pdfFile?.name : "Vierge"}</p></div>
                        <div className="rounded-2xl border border-[#E5E7EB] bg-[#FAFAFA] p-6"><p className="text-sm font-medium text-[#6B7280]">Participants</p><p className="mt-2 text-3xl font-bold text-[#D68C2D]">{names.length}</p></div>
                        <div className="rounded-2xl border border-[#E5E7EB] bg-[#FAFAFA] p-6"><p className="text-sm font-medium text-[#6B7280]">Éléments</p><p className="mt-2 text-3xl font-bold text-[#D68C2D]">{canvasObjects.length}</p></div>
                        <div className="rounded-2xl border border-[#E5E7EB] bg-[#FAFAFA] p-6"><p className="text-sm font-medium text-[#6B7280]">Email</p><p className="mt-2 font-semibold text-[#1E1E1E]">{emailEnabled ? "Activé" : "Désactivé"}</p></div>
                      </div>
                    </CardContent>
                  </Card>
                  <Button onClick={generateAndMaybeSendCertificates} disabled={names.length === 0 || isGenerating} className="h-16 w-full bg-gradient-to-r from-[#D68C2D] to-[#12A2AC] text-lg font-bold text-white shadow-lg hover:shadow-xl transition-all">
                    {isGenerating ? <><span className="mr-2 animate-spin">⏳</span>Génération...</> : <><Download className="mr-2 h-6 w-6" />{emailEnabled ? "Générer et envoyer" : "Générer les certificats"}</>}
                  </Button>
                </div>
              )}
            </>
          )}

          {/* Campaign module workflow */}
          {activeModule === "campaign" && (
            <>
              <div className="mb-8">
                <div className="flex items-center gap-3 mb-2">
                  <button onClick={() => { setActiveModule(null); setCurrentStep(1); setMaxValidatedStep(1); }} className="text-sm text-[#6B7280] hover:text-[#12A2AC] transition-colors">← Retour</button>
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#12A2AC]/10"><Users className="h-5 w-5 text-[#12A2AC]" /></div>
                  <h1 className="font-heading text-3xl font-bold text-[#1E1E1E]">Créer une campagne</h1>
                </div>
                <p className="text-base text-[#6B7280]">Les participants rempliront eux-mêmes leurs informations et recevront leur certificat automatiquement.</p>
              </div>
              <StepProgressBar steps={wizardSteps} currentStep={currentStep} maxValidatedStep={maxValidatedStep} onStepClick={goToStep} />

              {/* Campaign Step 1: Campaign info */}
              {currentStep === 1 && (
                <Card className="border-[#E5E7EB] bg-white shadow-sm rounded-2xl overflow-hidden">
                  <CardHeader className="pb-2">
                    <CardTitle className="font-heading text-2xl font-bold text-[#1E1E1E]">1. Créer la campagne</CardTitle>
                    <CardDescription className="text-[#6B7280] text-base">Renseignez les informations de votre campagne.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-5 pb-8">
                    <div className="grid gap-5 md:grid-cols-2">
                      <div><Label className="text-sm font-medium text-[#1E1E1E]">Nom de la campagne *</Label><Input value={campaignName} onChange={(e) => setCampaignName(e.target.value)} className="mt-2 border-[#E5E7EB] focus:border-[#12A2AC] focus:ring-[#12A2AC]" placeholder="Ex: Formation React 2026" /></div>
                      <div><Label className="text-sm font-medium text-[#1E1E1E]">Organisateur</Label><Input value={campaignOrganizer} onChange={(e) => setCampaignOrganizer(e.target.value)} className="mt-2 border-[#E5E7EB] focus:border-[#12A2AC] focus:ring-[#12A2AC]" placeholder="Ex: PROUV Academy" /></div>
                      <div><Label className="text-sm font-medium text-[#1E1E1E]">Lieu</Label><Input value={campaignLocation} onChange={(e) => setCampaignLocation(e.target.value)} className="mt-2 border-[#E5E7EB] focus:border-[#12A2AC] focus:ring-[#12A2AC]" placeholder="Ex: Abidjan, Côte d'Ivoire" /></div>
                      <div className="grid grid-cols-2 gap-3">
                        <div><Label className="text-sm font-medium text-[#1E1E1E]">Date</Label><Input type="date" value={campaignDate} onChange={(e) => setCampaignDate(e.target.value)} className="mt-2 border-[#E5E7EB] focus:border-[#12A2AC] focus:ring-[#12A2AC]" /></div>
                        <div><Label className="text-sm font-medium text-[#1E1E1E]">Heure</Label><Input type="time" value={campaignTime} onChange={(e) => setCampaignTime(e.target.value)} className="mt-2 border-[#E5E7EB] focus:border-[#12A2AC] focus:ring-[#12A2AC]" /></div>
                      </div>
                    </div>
                    <div><Label className="text-sm font-medium text-[#1E1E1E]">Description</Label><textarea value={campaignDesc} onChange={(e) => setCampaignDesc(e.target.value)} rows={3} className="mt-2 w-full rounded-xl border border-[#E5E7EB] bg-white p-3 text-sm text-[#1E1E1E] focus:border-[#12A2AC] focus:outline-none focus:ring-2 focus:ring-[#12A2AC]/20" placeholder="Décrivez votre campagne..." /></div>
                    <div>
                      <Label className="text-sm font-medium text-[#1E1E1E]">Image de couverture</Label>
                      <div className="mt-2 flex items-center gap-4">
                        {campaignImage && <img src={campaignImage} alt="Couverture" className="h-20 w-32 rounded-xl object-cover border border-[#E5E7EB]" />}
                        <Button type="button" variant="outline" onClick={() => campaignImageInputRef.current?.click()} className="rounded-xl border-[#E5E7EB]"><Upload className="mr-2 size-4" />Choisir une image</Button>
                        <input ref={campaignImageInputRef} type="file" accept="image/png,image/jpeg,image/webp" onChange={handleCampaignImageUpload} className="hidden" />
                      </div>
                    </div>
                    <div className="flex justify-end"><Button onClick={() => continueToStep(2)} disabled={!campaignName.trim()} size="lg" className="rounded-xl bg-[#12A2AC] text-white hover:bg-[#12A2AC]/90 h-12 px-8">Continuer<ArrowRight className="ml-2 h-5 w-5" /></Button></div>
                  </CardContent>
                </Card>
              )}

              {/* Campaign Step 2: Certificate editor */}
              {currentStep === 2 && (
                <Card className="border-[#E5E7EB] bg-white shadow-sm rounded-2xl overflow-hidden">
                  <CardHeader className="pb-4">
                    <CardTitle className="font-heading text-xl font-bold text-[#1E1E1E] flex items-center gap-2"><MousePointer2 className="size-5 text-[#12A2AC]" />2. Créer le certificat</CardTitle>
                    <CardDescription className="text-[#6B7280]">Utilisez le même éditeur graphique pour designer votre certificat.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-5">
                    <CertificateCanvasEditor
                      pdfUrl={pdfPreview}
                      backgroundImageUrl={backgroundImage}
                      objects={canvasObjects}
                      onObjectsChange={setCanvasObjects}
                      availableDataKeys={availableDataKeys}
                    />
                    <div className="flex justify-end"><Button onClick={() => continueToStep(3)} className="h-12 rounded-xl bg-[#12A2AC] text-white hover:bg-[#12A2AC]/90 px-8">Continuer<ArrowRight className="ml-2 h-5 w-5" /></Button></div>
                  </CardContent>
                </Card>
              )}

              {/* Campaign Step 3: Conditions */}
              {currentStep === 3 && (
                <Card className="border-[#E5E7EB] bg-white shadow-sm rounded-2xl overflow-hidden">
                  <CardHeader className="pb-2">
                    <CardTitle className="font-heading text-2xl font-bold text-[#1E1E1E]">3. Conditions de récupération</CardTitle>
                    <CardDescription className="text-[#6B7280] text-base">Toutes les options sont facultatives. Activez celles dont vous avez besoin.</CardDescription>
                  </CardHeader>
                  <CardContent className="pb-8">
                    <CampaignOptionsPanel options={campaignOptions} onChange={setCampaignOptions} campaignId={campaignId} />
                    <div className="mt-6 flex justify-end"><Button onClick={() => continueToStep(4)} size="lg" className="rounded-xl bg-[#12A2AC] text-white hover:bg-[#12A2AC]/90 h-12 px-8">Continuer<ArrowRight className="ml-2 h-5 w-5" /></Button></div>
                  </CardContent>
                </Card>
              )}

              {/* Campaign Step 4: Quiz */}
              {currentStep === 4 && (
                <Card className="border-[#E5E7EB] bg-white shadow-sm rounded-2xl overflow-hidden">
                  <CardHeader className="pb-2">
                    <CardTitle className="font-heading text-2xl font-bold text-[#1E1E1E]">4. Quiz (optionnel)</CardTitle>
                    <CardDescription className="text-[#6B7280] text-base">Créez un quiz que les participants doivent réussir pour obtenir leur certificat.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-5 pb-8">
                    <div className="flex items-center justify-between rounded-2xl border-2 border-[#E5E7EB] bg-[#FAFAFA] p-5">
                      <span className="font-semibold text-[#1E1E1E]">Activer le quiz</span>
                      <button type="button" onClick={() => setCampaignOptions((prev) => ({ ...prev, quizEnabled: !prev.quizEnabled }))} className={`h-7 w-12 rounded-full p-1 transition-colors ${campaignOptions.quizEnabled ? "bg-[#12A2AC]" : "bg-[#E5E7EB]"}`}><span className={`block size-5 rounded-full bg-white shadow-sm transition-transform ${campaignOptions.quizEnabled ? "translate-x-5" : ""}`} /></button>
                    </div>
                    {campaignOptions.quizEnabled && (
                      <div className="space-y-4">
                        {quizQuestions.map((q, qi) => (
                          <div key={q.id} className="rounded-2xl border border-[#E5E7EB] bg-[#FAFAFA] p-5">
                            <div className="flex items-center gap-3">
                              <Input value={q.question} onChange={(e) => setQuizQuestions((prev) => prev.map((p, i) => i === qi ? { ...p, question: e.target.value } : p))} className="flex-1 border-[#E5E7EB] focus:border-[#12A2AC]" placeholder={`Question ${qi + 1}`} />
                              <Button type="button" size="icon" variant="ghost" className="text-red-500 hover:bg-red-50" onClick={() => setQuizQuestions((prev) => prev.filter((_, i) => i !== qi))}><Trash2 className="size-4" /></Button>
                            </div>
                            <div className="mt-3 space-y-2">
                              {q.answers.map((a, ai) => (
                                <div key={ai} className="flex items-center gap-2">
                                  <button type="button" onClick={() => setQuizQuestions((prev) => prev.map((p, i) => i === qi ? { ...p, correctIndex: ai } : p))} className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 transition-colors ${q.correctIndex === ai ? "border-[#12A2AC] bg-[#12A2AC] text-white" : "border-[#E5E7EB] text-transparent"}`}><CheckCircle2 className="size-3" /></button>
                                  <Input value={a} onChange={(e) => setQuizQuestions((prev) => prev.map((p, i) => i === qi ? { ...p, answers: p.answers.map((val, j) => j === ai ? e.target.value : val) } : p))} className="flex-1 border-[#E5E7EB] focus:border-[#12A2AC] text-sm" placeholder={`Réponse ${ai + 1}`} />
                                </div>
                              ))}
                              <Button type="button" size="sm" variant="ghost" className="text-[#12A2AC]" onClick={() => setQuizQuestions((prev) => prev.map((p, i) => i === qi ? { ...p, answers: [...p.answers, ""] } : p))}><Plus className="mr-1 size-3" />Ajouter une réponse</Button>
                            </div>
                          </div>
                        ))}
                        <Button type="button" variant="outline" className="rounded-xl border-[#12A2AC] text-[#12A2AC] hover:bg-[#12A2AC]/10" onClick={() => setQuizQuestions((prev) => [...prev, { id: `q-${Date.now()}`, question: "", answers: ["", ""], correctIndex: 0 }])}><Plus className="mr-2 size-4" />Ajouter une question</Button>
                      </div>
                    )}
                    <div className="flex justify-end"><Button onClick={() => continueToStep(5)} size="lg" className="rounded-xl bg-[#12A2AC] text-white hover:bg-[#12A2AC]/90 h-12 px-8">Continuer<ArrowRight className="ml-2 h-5 w-5" /></Button></div>
                  </CardContent>
                </Card>
              )}

              {/* Campaign Step 5: Publication */}
              {currentStep === 5 && (
                <div className="space-y-6">
                  <Card className="border-[#E5E7EB] bg-white shadow-sm rounded-2xl overflow-hidden">
                    <CardHeader><CardTitle className="font-heading text-2xl font-bold text-[#1E1E1E]">5. Publication</CardTitle><CardDescription className="text-[#6B7280]">PROUV génère automatiquement un lien sécurisé, un QR Code et une page publique.</CardDescription></CardHeader>
                    <CardContent className="space-y-6">
                      <div className="grid gap-4 md:grid-cols-3">
                        <div className="rounded-2xl border border-[#E5E7EB] bg-[#FAFAFA] p-6 text-center"><div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-[#12A2AC]/10"><FileText className="size-6 text-[#12A2AC]" /></div><p className="text-sm font-medium text-[#6B7280]">Campagne</p><p className="mt-1 font-semibold text-[#1E1E1E]">{campaignName || "Sans nom"}</p></div>
                        <div className="rounded-2xl border border-[#E5E7EB] bg-[#FAFAFA] p-6 text-center"><div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-[#D68C2D]/10"><Users className="size-6 text-[#D68C2D]" /></div><p className="text-sm font-medium text-[#6B7280]">Éléments</p><p className="mt-1 text-3xl font-bold text-[#D68C2D]">{canvasObjects.length}</p></div>
                        <div className="rounded-2xl border border-[#E5E7EB] bg-[#FAFAFA] p-6 text-center"><div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-[#12A2AC]/10"><CheckCircle2 className="size-6 text-[#12A2AC]" /></div><p className="text-sm font-medium text-[#6B7280]">Conditions</p><p className="mt-1 font-semibold text-[#1E1E1E]">{[campaignOptions.photoValidationEnabled, campaignOptions.quizEnabled, campaignOptions.manualValidationEnabled, campaignOptions.emailValidationEnabled].filter(Boolean).length} activée(s)</p></div>
                      </div>
                      <div className="rounded-2xl border border-[#12A2AC]/30 bg-[#12A2AC]/5 p-6">
                        <p className="text-sm font-semibold text-[#12A2AC]">Lien sécurisé de la campagne</p>
                        <div className="mt-3 flex items-center gap-3 rounded-xl border border-[#E5E7EB] bg-white p-3">
                          <code className="flex-1 truncate text-sm text-[#1E1E1E]">https://prouv.app/c/{campaignId}</code>
                          <Button type="button" size="sm" variant="outline" className="shrink-0 rounded-lg border-[#E5E7EB]" onClick={() => { if (typeof window !== "undefined") navigator.clipboard?.writeText(`https://prouv.app/c/${campaignId}`); prouvToast.success("Lien copié"); }}>Copier</Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  <Button onClick={() => prouvToast.success("Campagne publiée ! (simulation)")} className="h-16 w-full bg-gradient-to-r from-[#12A2AC] to-[#D68C2D] text-lg font-bold text-white shadow-lg hover:shadow-xl transition-all">
                    <CheckCircle2 className="mr-2 h-6 w-6" />Publier la campagne
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  );
}

function StepProgressBar({
  steps,
  currentStep,
  maxValidatedStep,
  onStepClick,
}: {
  steps: { id: WizardStep; label: string; shortLabel: string }[];
  currentStep: WizardStep;
  maxValidatedStep: WizardStep;
  onStepClick: (step: WizardStep) => void;
}) {
  return (
    <Card className="mb-6 border-[#E5E7EB] bg-white shadow-sm p-5 rounded-2xl">
      <div className="mb-3 flex items-center justify-between text-sm text-[#6B7280]">
        <span>Étape {currentStep} sur 5</span>
        <span className="font-medium text-[#D68C2D]">{Math.round((currentStep / 5) * 100)}%</span>
      </div>
      <div className="mb-5 h-2 overflow-hidden rounded-full bg-[#E5E7EB]">
        <motion.div className="h-full rounded-full bg-gradient-to-r from-[#D68C2D] to-[#12A2AC]" initial={{ width: 0 }} animate={{ width: `${(currentStep / 5) * 100}%` }} transition={{ duration: 0.5, ease: "easeInOut" }} />
      </div>
      <div className="grid gap-3 md:grid-cols-5">
        {steps.map((step) => {
          const isDone = step.id < currentStep || step.id < maxValidatedStep;
          const isActive = step.id === currentStep;
          const isClickable = step.id <= maxValidatedStep;
          return (
            <button key={step.id} type="button" onClick={() => onStepClick(step.id)} disabled={!isClickable}
              className={`rounded-xl border p-4 text-left transition-all duration-300 ${isActive ? "border-[#D68C2D] bg-[#D68C2D]/10 shadow-sm" : isDone ? "border-[#12A2AC]/30 bg-[#12A2AC]/5" : "border-[#E5E7EB] bg-white opacity-60"}`}>
              <div className="flex items-center justify-between"><span className="text-xs font-medium text-[#6B7280]">{step.label}</span>{isDone && <CheckCircle2 className="size-4 text-[#12A2AC]" />}</div>
              <p className="mt-1 font-semibold text-[#1E1E1E]">{step.shortLabel}</p>
            </button>
          );
        })}
      </div>
    </Card>
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
