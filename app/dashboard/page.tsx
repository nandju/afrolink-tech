"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { PDFDocument, rgb } from "pdf-lib";
import fontkit from "@pdf-lib/fontkit";
import * as XLSX from "xlsx";
import Papa from "papaparse";
import JSZip from "jszip";
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
import {
  Upload,
  FileText,
  Plus,
  Edit2,
  Trash2,
  Download,
  LogOut,
  FileSpreadsheet,
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  Settings,
  GripVertical,
  CheckCircle2,
  Mail,
  Users,
} from "lucide-react";
import { toast } from "sonner";
import { clearAuthSession } from "@/lib/auth";

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
  isEditing?: boolean;
};

type NameItem = {
  id: string;
  name: string;
  fieldValues?: Record<string, string>;
  email?: string;
  isEditing?: boolean;
};

type WizardStep = 1 | 2 | 3 | 4 | 5;
type ParticipantMode = "manual" | "excel";

const wizardSteps: { id: WizardStep; label: string; shortLabel: string }[] = [
  { id: 1, label: "PDF Upload", shortLabel: "PDF" },
  { id: 2, label: "Field Configuration", shortLabel: "Fields" },
  { id: 3, label: "Participant Import", shortLabel: "Participants" },
  { id: 4, label: "Email Configuration", shortLabel: "Emails" },
  { id: 5, label: "Final Generation", shortLabel: "Generation" },
];

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
  const [manualFieldValues, setManualFieldValues] = useState<Record<string, string>>({});
  const [textFields, setTextFields] = useState<TextField[]>([]);
  const [selectedFieldId, setSelectedFieldId] = useState<string | null>(null);
  const [moveStep, setMoveStep] = useState(1);
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentStep, setCurrentStep] = useState<WizardStep>(1);
  const [maxValidatedStep, setMaxValidatedStep] = useState<WizardStep>(1);
  const [participantMode, setParticipantMode] = useState<ParticipantMode | null>(null);
  const [isDraggingPdf, setIsDraggingPdf] = useState(false);
  const [importedColumns, setImportedColumns] = useState<string[]>([]);
  const [detectedEmailColumn, setDetectedEmailColumn] = useState<string | null>(null);
  const [emailEnabled, setEmailEnabled] = useState(false);
  const [emailSubject, setEmailSubject] = useState("Votre certificat AfroCertify");
  const [emailMessage, setEmailMessage] = useState(
    "Bonjour {{first name}} {{last name}},\n\nVeuillez trouver votre certificat en pièce jointe.\n\nMerci."
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

  // Text field management functions
  const addTextField = (name: string = "Nouveau texte") => {
    const newField: TextField = {
      id: Date.now().toString(),
      name,
      dataKey: name,
      x: 300,
      y: 400,
      fontSize: 24,
      color: "#000000",
      fontFamily: "Montserrat",
      fontWeight: "Regular",
    };
    setTextFields([...textFields, newField]);
    setSelectedFieldId(newField.id);
    setManualFieldValues((prev) => ({ ...prev, [newField.id]: "" }));
    toast.success("Champ de texte ajouté");
  };

  const deleteTextField = (id: string) => {
    const nextFields = textFields.filter(f => f.id !== id);
    setTextFields(nextFields);
    if (selectedFieldId === id) {
      setSelectedFieldId(nextFields.length > 0 ? nextFields[0].id : null);
    }
    setManualFieldValues((prev) => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
    toast.success("Champ de texte supprimé");
  };

  const updateTextField = (id: string, updates: Partial<TextField>) => {
    setTextFields((prev) => prev.map((f) => (f.id === id ? { ...f, ...updates } : f)));
  };

  const moveTextField = (id: string, dx: number, dy: number) => {
    setTextFields((prev) =>
      prev.map((field) => {
        if (field.id !== id) return field;
        const nextX = Math.max(0, Math.round(field.x + dx));
        const nextY = Math.max(0, Math.round(field.y + dy));
        return { ...field, x: nextX, y: nextY };
      })
    );
  };

  const selectedField = textFields.find(f => f.id === selectedFieldId);

  // Initialize with one text field if none exist
  useEffect(() => {
    if (textFields.length === 0) {
      addTextField("Nom du participant");
    }
  }, []);
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
      toast.error("Veuillez sélectionner un fichier PDF valide");
      return;
    }

    setPdfFile(file);
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setPdfPreview(result);
    };
    reader.readAsDataURL(file);
    toast.success("PDF modèle chargé avec succès");
  };

  const handlePdfDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDraggingPdf(false);
    await handlePdfFile(e.dataTransfer.files?.[0]);
  };

  const handleAddName = () => {
    const trimmedByField = textFields.map((field) => ({
      field,
      value: (manualFieldValues[field.id] || "").trim(),
    }));

    if (trimmedByField.length === 0) {
      toast.error("Veuillez ajouter au moins un champ de texte");
      return;
    }

    if (trimmedByField.every((entry) => !entry.value)) {
      toast.error("Veuillez remplir au moins un champ");
      return;
    }

    const fieldValues: Record<string, string> = {};
    for (const entry of trimmedByField) {
      fieldValues[entry.field.dataKey] = entry.value;
    }

    const fullName = trimmedByField
      .map((entry) => entry.value)
      .filter(Boolean)
      .join(" ");

    const newItem: NameItem = {
      id: Date.now().toString(),
      name: fullName || "Sans nom",
      fieldValues,
    };
    setNames((prev) => [...prev, newItem]);
    setManualFieldValues((prev) => {
      const cleared: Record<string, string> = {};
      for (const field of textFields) {
        cleared[field.id] = "";
      }
      return { ...prev, ...cleared };
    });
    toast.success("Nom ajouté");
  };

  const handleDeleteName = (id: string) => {
    setNames(names.filter((n) => n.id !== id));
    toast.success("Nom supprimé");
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
            toast.error(`Erreur lors de l'import CSV: ${error.message}`);
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
      toast.error("Erreur lors de l'import du fichier");
      console.error(error);
    }
  };

  const processExcelData = (data: any[]) => {
    if (data.length === 0) {
      toast.error("Le fichier est vide");
      return;
    }

    const firstRow = data[0];
    const columns = Object.keys(firstRow);
    const emailColumn = columns.find(isEmailColumn) || null;
    setImportedColumns(columns);
    setDetectedEmailColumn(emailColumn);
    
    if (columns.length === 1) {
      // Single column - treat as names (existing behavior)
      const importedNames: NameItem[] = [];
      data.forEach((row: any, index: number) => {
        const name = Object.values(row)[0] as string;
        if (name && typeof name === "string" && name.trim()) {
          importedNames.push({
            id: `excel-${Date.now()}-${index}`,
            name: name.trim(),
          });
        }
      });
      setNames((prev) => [...prev, ...importedNames]);
      toast.success(`${importedNames.length} nom(s) importé(s)`);
    } else {
      // Multiple columns - create text fields for each column
      const newFields: TextField[] = [];
      const columnNames = Object.keys(firstRow);
      const pdfColumnNames = columnNames.filter((columnName) => columnName !== emailColumn);
      
      pdfColumnNames.forEach((columnName, index) => {
        const newField: TextField = {
          id: `field-${Date.now()}-${index}`,
          name: columnName || `Champ ${index + 1}`,
          dataKey: columnName || `Champ ${index + 1}`,
          x: 300 + (index * 50), // Offset fields horizontally
          y: 400 + (index * 30), // Offset fields vertically
          fontSize: 24,
          color: "#000000",
          fontFamily: "Montserrat",
          fontWeight: "Regular",
        };
        newFields.push(newField);
      });
      
      setTextFields((prev) => [...prev, ...newFields]);
      
      // Process the data rows as names
      const importedNames: NameItem[] = [];
      data.forEach((row: any, index: number) => {
        // Create a combined name from all columns for display
        const fieldValues = pdfColumnNames.reduce<Record<string, string>>((acc, col) => {
          const value = row[col];
          acc[col] = value == null ? "" : String(value).trim();
          return acc;
        }, {});
        const combinedName = pdfColumnNames
          .map(col => fieldValues[col])
          .filter(Boolean)
          .join(" ");
        if (combinedName && combinedName.trim()) {
          importedNames.push({
            id: `excel-${Date.now()}-${index}`,
            name: combinedName.trim(),
            fieldValues,
            email: emailColumn && row[emailColumn] ? String(row[emailColumn]).trim() : undefined,
          });
        }
      });
      
      setNames((prev) => [...prev, ...importedNames]);
      toast.success(`${pdfColumnNames.length} champ(s) de texte créé(s) et ${importedNames.length} participant(s) importé(s)`);
    }
  };

  const getFieldTextForRow = (field: TextField, nameItem: NameItem): string => {
    if (nameItem.fieldValues) {
      return nameItem.fieldValues[field.dataKey] || "";
    }
    return nameItem.name;
  };

  const getEmbeddedFontsForDocument = async (
    pdfDoc: PDFDocument
  ): Promise<Map<string, any>> => {
    pdfDoc.registerFontkit(fontkit);
    const fontMap = new Map<string, any>();
    const uniqueFontKeys = new Set(textFields.map((field) => resolveFieldFontFile(field)));

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
      toast.error("Veuillez d'abord uploader un PDF modèle");
      return;
    }

    if (names.length === 0) {
      toast.error("Veuillez ajouter au moins un nom");
      return;
    }

    if (textFields.length === 0) {
      toast.error("Veuillez ajouter au moins un champ de texte");
      return;
    }

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

        // Draw each text field
        for (const field of textFields) {
          const colorRgb = hexToRgb(field.color);
          const fontFile = resolveFieldFontFile(field);
          const font = embeddedFonts.get(fontFile);
          if (!font) {
            console.warn(`Font not loaded for field ${field.name}, using fallback`);
            continue;
          }

          const fieldText = getFieldTextForRow(field, nameItem) || field.name;

          firstPage.drawText(fieldText, {
            x: field.x,
            y: height - field.y, // Inverser Y car pdf-lib utilise le bas comme origine
            size: field.fontSize,
            font: font,
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

      toast.success(`${names.length} certificat(s) généré(s) avec succès !`);
      setIsGenerating(false);
    } catch (error) {
      console.error(error);
      toast.error("Erreur lors de la génération des certificats");
      setIsGenerating(false);
    }
  };

  const renderLivePdfPreview = async () => {
    if (!pdfFile || textFields.length === 0) {
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

      // Draw each text field with sample or first row values
      for (const field of textFields) {
        const colorRgb = hexToRgb(field.color);
        const fontFile = resolveFieldFontFile(field);
        const font = embeddedFonts.get(fontFile);
        if (!font) {
          console.warn(`Font not loaded for field ${field.name}, using fallback`);
          continue;
        }

        const previewText =
          (activeName && getFieldTextForRow(field, activeName)) ||
          (manualFieldValues[field.id] || "").trim() ||
          field.name;

        firstPage.drawText(previewText, {
          x: field.x,
          y: height - field.y,
          size: field.fontSize,
          font: font,
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
  }, [pdfFile, textFields, names, manualFieldValues]);

  useEffect(() => {
    return () => {
      if (previewUrlRef.current) {
        URL.revokeObjectURL(previewUrlRef.current);
      }
    };
  }, []);

  const handleLogout = () => {
    clearAuthSession();
    document.cookie = "authenticated=; path=/; max-age=0";
    router.push("/login");
  };

  const canValidateStep = (step: WizardStep) => {
    if (step === 1) return Boolean(pdfFile);
    if (step === 2) return Boolean(pdfFile && textFields.length > 0);
    if (step === 3) return names.length > 0;
    if (step === 4) return !emailEnabled || names.some((item) => item.email);
    return Boolean(pdfFile && textFields.length > 0 && names.length > 0);
  };

  const goToStep = (step: WizardStep) => {
    if (step <= maxValidatedStep) setCurrentStep(step);
  };

  const continueToStep = (nextStep: WizardStep) => {
    if (!canValidateStep(currentStep)) {
      toast.error("Complétez cette étape avant de continuer");
      return;
    }
    setMaxValidatedStep((prev) => Math.max(prev, nextStep) as WizardStep);
    setCurrentStep(nextStep);
  };

  const renderEmailPreview = () => {
    const sample = names[0];
    const values = sample?.fieldValues || {};
    return emailMessage
      .replaceAll("{{first name}}", values["First Name"] || values["Prénom"] || values["Prenom"] || "")
      .replaceAll("{{last name}}", values["Last Name"] || values["Nom"] || "")
      .replaceAll("{{job title}}", values["Job Title"] || values["Fonction"] || values["Poste"] || "")
      .replaceAll("{{email}}", sample?.email || "");
  };

  const generateAndMaybeSendCertificates = async () => {
    if (emailEnabled) {
      toast.info("Envoi email Resend à connecter côté serveur. Le ZIP reste généré normalement.");
    }
    await generateCertificates();
  };

  return (
    <main className="min-h-screen bg-[#000000] px-4 py-6 text-[#ffffff] sm:px-6">
      <div className="mx-auto max-w-7xl">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-display text-4xl font-bold text-[#ffffff] mb-2">
              AfroCertify Studio
            </h1>
            <p className="text-[#ffffff]/70">
              Un assistant simple pour configurer, importer et générer vos certificats.
            </p>
          </div>
          <Button
            variant="outline"
            onClick={handleLogout}
            className="border-[#ffa51f] text-[#ffffff] hover:bg-[#000000]/70"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Déconnexion
          </Button>
        </div>
        <Card className="mb-6 border-[#ffffff]/10 bg-[#080808]/80 p-4">
          <div className="mb-4 flex items-center justify-between text-sm text-[#ffffff]/60">
            <span>Step {currentStep} of 5</span>
            <span>{Math.round((currentStep / 5) * 100)}%</span>
          </div>
          <div className="mb-5 h-2 overflow-hidden rounded-full bg-[#ffffff]/10">
            <div className="h-full rounded-full bg-[#ffa51f] transition-all duration-500" style={{ width: `${(currentStep / 5) * 100}%` }} />
          </div>
          <div className="grid gap-2 md:grid-cols-5">
            {wizardSteps.map((step) => {
              const isDone = step.id < currentStep || step.id < maxValidatedStep;
              const isActive = step.id === currentStep;
              const isClickable = step.id <= maxValidatedStep;
              return (
                <button
                  key={step.id}
                  type="button"
                  onClick={() => goToStep(step.id)}
                  disabled={!isClickable}
                  className={`rounded-2xl border p-3 text-left transition-all ${
                    isActive
                      ? "border-[#ffa51f] bg-[#ffa51f]/15"
                      : isDone
                        ? "border-[#ffa51f]/35 bg-[#ffffff]/5"
                        : "border-[#ffffff]/10 bg-[#ffffff]/3 opacity-60"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-[#ffffff]/55">{step.label}</span>
                    {isDone && <CheckCircle2 className="size-4 text-[#ffa51f]" />}
                  </div>
                  <p className="mt-1 font-semibold text-[#ffffff]">{step.shortLabel}</p>
                </button>
              );
            })}
          </div>
        </Card>

        {currentStep === 1 && (
          <Card className="border-[#ffffff]/10 bg-[#080808]/80">
            <CardHeader>
              <CardTitle className="text-[#ffffff]">1. Importez votre PDF</CardTitle>
              <CardDescription className="text-[#ffffff]/60">Déposez votre modèle PDF vierge. La prévisualisation restera active pendant tout le processus.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              <div
                onDrop={handlePdfDrop}
                onDragOver={(e) => e.preventDefault()}
                onDragEnter={() => setIsDraggingPdf(true)}
                onDragLeave={() => setIsDraggingPdf(false)}
                className={`rounded-[2rem] border-2 border-dashed p-8 text-center transition-all ${isDraggingPdf ? "border-[#ffa51f] bg-[#ffa51f]/10" : "border-[#ffa51f]/35 bg-[#ffffff]/4"}`}
              >
                <FileText className="mx-auto mb-4 size-14 text-[#ffa51f]" />
                <h2 className="text-2xl font-semibold text-[#ffffff]">{pdfFile ? pdfFile.name : "Glissez votre PDF ici"}</h2>
                <p className="mt-2 text-sm text-[#ffffff]/60">Format accepté : PDF uniquement</p>
                <Button onClick={() => fileInputRef.current?.click()} className="mt-6 bg-[#ffa51f] text-[#000000] hover:bg-[#ffa51f]/90">
                  <Upload className="mr-2 size-4" />
                  Choisir un fichier PDF
                </Button>
                <input ref={fileInputRef} type="file" accept="application/pdf" onChange={handlePdfUpload} className="hidden" />
              </div>
              {pdfPreview && <iframe src={pdfPreview} className="h-[620px] w-full rounded-2xl border border-[#ffffff]/10 bg-white" title="PDF Preview" />}
              <div className="flex justify-end">
                <Button onClick={() => continueToStep(2)} disabled={!pdfFile} className="bg-[#ffa51f] text-[#000000] hover:bg-[#ffa51f]/90">
                  Continuer <ArrowRight className="ml-2 size-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {currentStep === 2 && (
          <div className="grid gap-6 lg:grid-cols-[1fr_420px]">
            <Card className="border-[#ffffff]/10 bg-[#080808]/80">
              <CardHeader>
                <CardTitle className="text-[#ffffff]">2. Configurez les champs</CardTitle>
                <CardDescription className="text-[#ffffff]/60">La prévisualisation PDF reste en direct pendant vos ajustements.</CardDescription>
              </CardHeader>
              <CardContent>
                {pdfPreview ? (
                  <iframe src={pdfPreview} className="h-[760px] w-full rounded-2xl border border-[#ffffff]/10 bg-white" title="PDF Preview" />
                ) : (
                  <div className="flex h-[760px] items-center justify-center rounded-2xl border border-[#ffffff]/10 bg-[#ffffff]/4 text-[#ffffff]/50">Aucun PDF chargé</div>
                )}
              </CardContent>
            </Card>

            <div className="space-y-4">
              <Card className="border-[#ffffff]/10 bg-[#080808]/80">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-[#ffffff]">
                    <Settings className="size-5 text-[#ffa51f]" />
                    Champs dynamiques
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button onClick={() => addTextField()} className="w-full bg-[#ffa51f] text-[#000000] hover:bg-[#ffa51f]/90">
                    <Plus className="mr-2 size-4" />
                    Ajouter un champ
                  </Button>
                  <div className="max-h-56 space-y-2 overflow-y-auto pr-1">
                    {textFields.map((field) => (
                      <div
                        key={field.id}
                        onClick={() => setSelectedFieldId(field.id)}
                        className={`cursor-pointer rounded-2xl border p-3 transition-all ${selectedFieldId === field.id ? "border-[#ffa51f] bg-[#ffa51f]/12" : "border-[#ffffff]/10 bg-[#ffffff]/5 hover:border-[#ffa51f]/45"}`}
                      >
                        <div className="flex items-center gap-2">
                          <GripVertical className="size-4 text-[#ffa51f]/70" />
                          <div className="flex-1">
                            <p className="text-sm font-semibold text-[#ffffff]">{field.name}</p>
                            <p className="text-xs text-[#ffffff]/45">X {field.x} • Y {field.y} • {field.fontFamily}</p>
                          </div>
                          <Button size="icon" variant="ghost" onClick={(e) => { e.stopPropagation(); deleteTextField(field.id); }} disabled={textFields.length === 1} className="size-8 text-[#ffffff]/50 hover:text-red-400">
                            <Trash2 className="size-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {selectedField && (
                <Card className="border-[#ffffff]/10 bg-[#080808]/80">
                  <CardHeader>
                    <CardTitle className="text-[#ffffff]">{selectedField.name}</CardTitle>
                    <CardDescription className="text-[#ffffff]/60">Position, police, couleur et clé de données.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label className="text-[#ffffff]/70">X</Label>
                        <Input type="number" value={selectedField.x} onChange={(e) => updateTextField(selectedField.id, { x: parseInt(e.target.value) || 0 })} className="bg-[#000000]/70 border-[#ffffff]/10 text-[#ffffff]" />
                      </div>
                      <div>
                        <Label className="text-[#ffffff]/70">Y</Label>
                        <Input type="number" value={selectedField.y} onChange={(e) => updateTextField(selectedField.id, { y: parseInt(e.target.value) || 0 })} className="bg-[#000000]/70 border-[#ffffff]/10 text-[#ffffff]" />
                      </div>
                    </div>
                    <div>
                      <Label className="text-[#ffffff]/70">Pas de déplacement</Label>
                      <Input type="number" value={moveStep} onChange={(e) => setMoveStep(Math.max(1, parseInt(e.target.value) || 1))} min="1" className="bg-[#000000]/70 border-[#ffffff]/10 text-[#ffffff]" />
                    </div>
                    <div className="mx-auto grid w-36 grid-cols-3 gap-2">
                      <div />
                      <Button size="icon" variant="outline" onClick={() => moveTextField(selectedField.id, 0, -moveStep)} className="border-[#ffa51f]/40 text-[#ffffff]"><ArrowUp className="size-4" /></Button>
                      <div />
                      <Button size="icon" variant="outline" onClick={() => moveTextField(selectedField.id, -moveStep, 0)} className="border-[#ffa51f]/40 text-[#ffffff]"><ArrowLeft className="size-4" /></Button>
                      <Button size="icon" variant="outline" onClick={() => moveTextField(selectedField.id, 0, moveStep)} className="border-[#ffa51f]/40 text-[#ffffff]"><ArrowDown className="size-4" /></Button>
                      <Button size="icon" variant="outline" onClick={() => moveTextField(selectedField.id, moveStep, 0)} className="border-[#ffa51f]/40 text-[#ffffff]"><ArrowRight className="size-4" /></Button>
                    </div>
                    <Input value={selectedField.dataKey} onChange={(e) => updateTextField(selectedField.id, { dataKey: e.target.value })} placeholder="Clé Excel/CSV" className="bg-[#000000]/70 border-[#ffffff]/10 text-[#ffffff]" />
                    <Input type="number" value={selectedField.fontSize} onChange={(e) => updateTextField(selectedField.id, { fontSize: parseInt(e.target.value) || 12 })} min="8" max="72" className="bg-[#000000]/70 border-[#ffffff]/10 text-[#ffffff]" />
                    <div className="flex gap-2">
                      <Input type="color" value={selectedField.color} onChange={(e) => updateTextField(selectedField.id, { color: e.target.value })} className="h-10 w-16 bg-[#000000]/70 border-[#ffffff]/10" />
                      <Input value={selectedField.color} onChange={(e) => updateTextField(selectedField.id, { color: e.target.value })} className="bg-[#000000]/70 border-[#ffffff]/10 text-[#ffffff]" />
                    </div>
                    <select value={selectedField.fontFamily} onChange={(e) => updateTextField(selectedField.id, { fontFamily: e.target.value as FontFamily, fontWeight: "Regular" })} className="h-10 w-full rounded-md border border-[#ffffff]/10 bg-[#000000]/70 px-3 text-[#ffffff]">
                      <option value="Montserrat">Montserrat</option>
                      <option value="Poppins">Poppins</option>
                      <option value="Roboto">Roboto</option>
                      <option value="Great Vibes">Great Vibes</option>
                    </select>
                    <select value={selectedField.fontWeight} onChange={(e) => updateTextField(selectedField.id, { fontWeight: e.target.value as FontWeight })} disabled={selectedField.fontFamily === "Great Vibes"} className="h-10 w-full rounded-md border border-[#ffffff]/10 bg-[#000000]/70 px-3 text-[#ffffff]">
                      {getAvailableWeights(selectedField.fontFamily).map((weight) => <option key={weight} value={weight}>{weight}</option>)}
                    </select>
                    <Button onClick={() => continueToStep(3)} className="w-full bg-[#ffa51f] text-[#000000] hover:bg-[#ffa51f]/90">Continuer</Button>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        )}

        {currentStep === 3 && (
          <Card className="border-[#ffffff]/10 bg-[#080808]/80">
            <CardHeader>
              <CardTitle className="text-[#ffffff]">3. Ajoutez les participants</CardTitle>
              <CardDescription className="text-[#ffffff]/60">Choisissez une saisie manuelle ou un import Excel/CSV intelligent.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <button type="button" onClick={() => setParticipantMode("manual")} className={`rounded-3xl border p-6 text-left ${participantMode === "manual" ? "border-[#ffa51f] bg-[#ffa51f]/10" : "border-[#ffffff]/10 bg-[#ffffff]/5"}`}>
                  <Users className="mb-4 size-8 text-[#ffa51f]" />
                  <h3 className="text-xl font-semibold">Manual Entry</h3>
                  <p className="mt-2 text-sm text-[#ffffff]/60">Ajoutez les participants ligne par ligne.</p>
                </button>
                <button type="button" onClick={() => setParticipantMode("excel")} className={`rounded-3xl border p-6 text-left ${participantMode === "excel" ? "border-[#ffa51f] bg-[#ffa51f]/10" : "border-[#ffffff]/10 bg-[#ffffff]/5"}`}>
                  <FileSpreadsheet className="mb-4 size-8 text-[#ffa51f]" />
                  <h3 className="text-xl font-semibold">Excel/CSV Import</h3>
                  <p className="mt-2 text-sm text-[#ffffff]/60">Détecte les colonnes, crée les champs et identifie les emails.</p>
                </button>
              </div>
              {participantMode === "manual" && (
                <div className="rounded-3xl border border-[#ffffff]/10 bg-[#ffffff]/5 p-5">
                  <div className="grid gap-3 md:grid-cols-2">
                    {textFields.map((field) => (
                      <div key={field.id}>
                        <Label className="text-[#ffffff]/70">{field.name}</Label>
                        <Input value={manualFieldValues[field.id] || ""} onChange={(e) => setManualFieldValues((prev) => ({ ...prev, [field.id]: e.target.value }))} onKeyDown={(e) => e.key === "Enter" && handleAddName()} className="bg-[#000000]/70 border-[#ffffff]/10 text-[#ffffff]" />
                      </div>
                    ))}
                  </div>
                  <Button onClick={handleAddName} className="mt-4 bg-[#ffa51f] text-[#000000] hover:bg-[#ffa51f]/90"><Plus className="mr-2 size-4" />Ajouter une ligne</Button>
                </div>
              )}
              {participantMode === "excel" && (
                <div className="rounded-3xl border border-dashed border-[#ffa51f]/35 bg-[#ffffff]/5 p-6 text-center">
                  <FileSpreadsheet className="mx-auto mb-4 size-12 text-[#ffa51f]" />
                  <p className="mb-4 text-[#ffffff]/60">La colonne Email/Mail/E-mail est utilisée pour l'envoi et n'est pas créée comme champ PDF.</p>
                  <Button onClick={() => excelInputRef.current?.click()} className="bg-[#ffa51f] text-[#000000] hover:bg-[#ffa51f]/90"><Upload className="mr-2 size-4" />Importer un fichier</Button>
                  <input ref={excelInputRef} type="file" accept=".xlsx,.csv" onChange={handleExcelUpload} className="hidden" />
                </div>
              )}
              {importedColumns.length > 0 && <div className="flex flex-wrap gap-2">{importedColumns.map((col) => <span key={col} className={`rounded-full px-3 py-1 text-xs ${col === detectedEmailColumn ? "bg-[#ffa51f] text-black" : "bg-[#ffffff]/10 text-[#ffffff]/70"}`}>{col}</span>)}</div>}
              {names.length > 0 && <div className="max-h-72 space-y-2 overflow-y-auto">{names.map((item) => <NameItemComponent key={item.id} item={item} onDelete={handleDeleteName} onEdit={handleEditName} />)}</div>}
              <div className="flex justify-end"><Button onClick={() => continueToStep(4)} disabled={names.length === 0} className="bg-[#ffa51f] text-[#000000] hover:bg-[#ffa51f]/90">Continuer</Button></div>
            </CardContent>
          </Card>
        )}

        {currentStep === 4 && (
          <Card className="border-[#ffffff]/10 bg-[#080808]/80">
            <CardHeader><CardTitle className="text-[#ffffff]">4. Emails optionnels</CardTitle><CardDescription className="text-[#ffffff]/60">Laissez désactivé pour conserver la génération ZIP classique.</CardDescription></CardHeader>
            <CardContent className="space-y-5">
              <button type="button" onClick={() => setEmailEnabled(!emailEnabled)} className={`flex w-full items-center justify-between rounded-3xl border p-5 ${emailEnabled ? "border-[#ffa51f] bg-[#ffa51f]/10" : "border-[#ffffff]/10 bg-[#ffffff]/5"}`}>
                <span className="flex items-center gap-3"><Mail className="size-5 text-[#ffa51f]" />Enable automatic sending of certificates by email</span>
                <span className={`h-6 w-11 rounded-full p-1 ${emailEnabled ? "bg-[#ffa51f]" : "bg-[#ffffff]/20"}`}><span className={`block size-4 rounded-full bg-black transition-transform ${emailEnabled ? "translate-x-5" : ""}`} /></span>
              </button>
              {emailEnabled && (
                <div className="grid gap-5 lg:grid-cols-2">
                  <div className="space-y-4">
                    <Input value={emailSubject} onChange={(e) => setEmailSubject(e.target.value)} className="bg-[#000000]/70 border-[#ffffff]/10 text-[#ffffff]" />
                    <textarea value={emailMessage} onChange={(e) => setEmailMessage(e.target.value)} rows={9} className="w-full rounded-md border border-[#ffffff]/10 bg-[#000000]/70 p-3 text-sm text-[#ffffff]" />
                    <p className="text-xs text-[#ffffff]/50">Variables: {"{{last name}}"} {"{{first name}}"} {"{{email}}"} {"{{job title}}"}</p>
                  </div>
                  <div className="rounded-3xl border border-[#ffffff]/10 bg-[#ffffff]/5 p-5">
                    <p className="mb-2 text-sm text-[#ffffff]/50">Message Preview</p>
                    <h3 className="font-semibold text-[#ffffff]">{emailSubject}</h3>
                    <pre className="mt-4 whitespace-pre-wrap text-sm text-[#ffffff]/70">{renderEmailPreview()}</pre>
                  </div>
                </div>
              )}
              <div className="flex justify-end"><Button onClick={() => continueToStep(5)} className="bg-[#ffa51f] text-[#000000] hover:bg-[#ffa51f]/90">Continuer</Button></div>
            </CardContent>
          </Card>
        )}

        {currentStep === 5 && (
          <Card className="border-[#ffffff]/10 bg-[#080808]/80">
            <CardHeader><CardTitle className="text-[#ffffff]">5. Génération finale</CardTitle><CardDescription className="text-[#ffffff]/60">Vérifiez le résumé avant de générer.</CardDescription></CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 md:grid-cols-4">
                <div className="rounded-3xl border border-[#ffffff]/10 bg-[#ffffff]/5 p-5"><p className="text-sm text-[#ffffff]/50">PDF</p><p className="mt-2 font-semibold">{pdfFile?.name || "Aucun"}</p></div>
                <div className="rounded-3xl border border-[#ffffff]/10 bg-[#ffffff]/5 p-5"><p className="text-sm text-[#ffffff]/50">Participants</p><p className="mt-2 text-2xl font-bold">{names.length}</p></div>
                <div className="rounded-3xl border border-[#ffffff]/10 bg-[#ffffff]/5 p-5"><p className="text-sm text-[#ffffff]/50">Champs</p><p className="mt-2 text-2xl font-bold">{textFields.length}</p></div>
                <div className="rounded-3xl border border-[#ffffff]/10 bg-[#ffffff]/5 p-5"><p className="text-sm text-[#ffffff]/50">Emails</p><p className="mt-2 font-semibold">{emailEnabled ? "Activé" : "Désactivé"}</p></div>
              </div>
              <Button onClick={generateAndMaybeSendCertificates} disabled={!pdfFile || names.length === 0 || textFields.length === 0 || isGenerating} className="h-14 w-full bg-[#ffa51f] text-base font-semibold text-[#000000] hover:bg-[#ffa51f]/90">
                {isGenerating ? <><span className="mr-2 animate-spin">⏳</span>Génération en cours...</> : <><Download className="mr-2 size-5" />{emailEnabled ? "Generate and send certificates" : "Generate certificates"}</>}
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </main>
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
    <div className="flex items-center gap-2 p-3 bg-[#000000]/70 rounded-lg border border-[#ffa51f]/40">
      {isEditing ? (
        <>
          <Input
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSave()}
            className="flex-1 bg-[#000000]/70 border-[#ffa51f]/40 text-[#ffffff] text-sm"
            autoFocus
          />
          <Button
            size="icon"
            variant="ghost"
            onClick={handleSave}
            className="h-8 w-8 text-[#ffffff] hover:text-[#ffa51f]"
          >
            <span className="text-sm">✓</span>
          </Button>
        </>
      ) : (
        <>
          <span className="flex-1 text-[#ffffff]/80 text-sm">{item.name}</span>
          <Button
            size="icon"
            variant="ghost"
            onClick={() => setIsEditing(true)}
            className="h-8 w-8 text-[#ffffff]/60 hover:text-[#ffa51f]"
          >
            <Edit2 className="w-4 h-4" />
          </Button>
          <Button
            size="icon"
            variant="ghost"
            onClick={() => onDelete(item.id)}
            className="h-8 w-8 text-[#ffffff]/60 hover:text-red-400"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </>
      )}
    </div>
  );
}
