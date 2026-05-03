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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Upload,
  FileText,
  Plus,
  X,
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
  isEditing?: boolean;
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
      
      columnNames.forEach((columnName, index) => {
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
        const fieldValues = columnNames.reduce<Record<string, string>>((acc, col) => {
          const value = row[col];
          acc[col] = value == null ? "" : String(value).trim();
          return acc;
        }, {});
        const combinedName = columnNames
          .map(col => fieldValues[col])
          .filter(Boolean)
          .join(" ");
        if (combinedName && combinedName.trim()) {
          importedNames.push({
            id: `excel-${Date.now()}-${index}`,
            name: combinedName.trim(),
            fieldValues,
          });
        }
      });
      
      setNames((prev) => [...prev, ...importedNames]);
      toast.success(`${columnNames.length} champ(s) de texte créé(s) et ${importedNames.length} nom(s) importé(s)`);
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

  return (
    <main className="min-h-screen bg-[#000000] px-6 py-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-display text-4xl font-bold text-[#ffffff] mb-2">
              Génération de certificats
            </h1>
            <p className="text-[#ffffff]/70">
              Générez automatiquement des certificats PDF personnalisés
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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Colonne gauche - Upload PDF et Liste des noms */}
          <div className="lg:col-span-2 space-y-6">
            {/* Étape 1: Upload PDF */}
            <Card className="bg-[#000000]/80 border-[#000000]">
              <CardHeader>
                <CardTitle className="text-[#ffffff]">
                  Étape 1 : Upload du PDF modèle
                </CardTitle>
                <CardDescription className="text-[#ffffff]/70">
                  Téléversez un certificat PDF vierge qui servira de modèle
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="border-2 border-dashed border-[#ffa51f]/60 rounded-lg p-8 text-center">
                  {pdfPreview ? (
                    <div className="space-y-4">
                      <iframe
                        src={pdfPreview}
                        className="w-full h-96 border border-[#000000] rounded bg-white"
                        title="PDF Preview"
                      />
                      <Button
                        variant="outline"
                        onClick={() => {
                          setPdfFile(null);
                          setPdfPreview(null);
                          if (fileInputRef.current)
                            fileInputRef.current.value = "";
                        }}
                        className="border-[#ffa51f] text-[#ffffff] hover:bg-[#000000]/70"
                      >
                        <X className="w-4 h-4 mr-2" />
                        Supprimer le PDF
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <FileText className="w-12 h-12 mx-auto text-[#ffa51f]" />
                      <div>
                        <p className="text-[#ffffff]/70 mb-2">
                          Cliquez pour sélectionner un PDF
                        </p>
                        <Button
                          onClick={() => fileInputRef.current?.click()}
                          className="bg-[#ffa51f] text-[#000000] hover:bg-[#ffa51f]/90"
                        >
                          <Upload className="w-4 h-4 mr-2" />
                          Choisir un fichier PDF
                        </Button>
                      </div>
                    </div>
                  )}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="application/pdf"
                    onChange={handlePdfUpload}
                    className="hidden"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Étape 2: Gestion des champs de texte */}
            <Card className="bg-[#000000]/80 border-[#000000]">
              <CardHeader>
                <CardTitle className="text-[#ffffff]">
                  Étape 2 : Configuration des champs de texte
                </CardTitle>
                <CardDescription className="text-[#ffffff]/70">
                  Ajoutez et configurez les champs de texte pour vos certificats
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Text fields list */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label className="text-[#ffffff]">Champs de texte</Label>
                    <Button
                      onClick={() => addTextField()}
                      size="sm"
                      className="bg-[#ffa51f] text-[#000000] hover:bg-[#ffa51f]/90"
                    >
                      <Plus className="w-4 h-4 mr-1" />
                      Ajouter un champ
                    </Button>
                  </div>
                  
                  {textFields.length > 0 && (
                    <div className="space-y-2 max-h-64 overflow-y-auto">
                      {textFields.map((field, index) => (
                        <div
                          key={field.id}
                          className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                            selectedFieldId === field.id
                              ? "bg-[#ffa51f]/20 border-[#ffa51f]"
                              : "bg-[#000000]/70 border-[#ffa51f]/40 hover:border-[#ffa51f]/60"
                          }`}
                          onClick={() => setSelectedFieldId(field.id)}
                        >
                          <div className="flex items-center gap-2">
                            <GripVertical className="w-4 h-4 text-[#ffa51f]/60" />
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <span className="text-[#ffffff] font-medium">
                                  {field.isEditing ? (
                                    <Input
                                      value={field.name}
                                      onChange={(e) => updateTextField(field.id, { name: e.target.value })}
                                      onBlur={() => updateTextField(field.id, { isEditing: false })}
                                      onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                          updateTextField(field.id, { isEditing: false });
                                        }
                                      }}
                                      className="bg-[#000000]/70 border-[#ffa51f]/40 text-[#ffffff] text-sm h-6"
                                      autoFocus
                                      onClick={(e) => e.stopPropagation()}
                                    />
                                  ) : (
                                    <span
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        updateTextField(field.id, { isEditing: true });
                                      }}
                                      className="cursor-text"
                                    >
                                      {field.name}
                                    </span>
                                  )}
                                </span>
                                <span className="text-[#ffffff]/60 text-xs">
                                  ({field.x}, {field.y})
                                </span>
                              </div>
                              <div className="text-[#ffffff]/60 text-xs mt-1">
                                {field.fontFamily} {field.fontWeight} • {field.fontSize}px • {field.color}
                              </div>
                            </div>
                            <Button
                              size="icon"
                              variant="ghost"
                              onClick={(e) => {
                                e.stopPropagation();
                                deleteTextField(field.id);
                              }}
                              className="h-6 w-6 text-[#ffffff]/60 hover:text-red-400"
                              disabled={textFields.length === 1}
                            >
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Étape 3: Ajout des noms */}
            <Card className="bg-[#000000]/80 border-[#000000]">
              <CardHeader>
                <CardTitle className="text-[#ffffff]">
                  Étape 3 : Choix du mode d'ajout des noms
                </CardTitle>
                <CardDescription className="text-[#ffffff]/70">
                  Ajoutez les noms manuellement ou importez-les depuis un
                  fichier Excel/CSV
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="manual" className="w-full">
                  <TabsList className="bg-[#000000]/80 border-[#ffa51f]/40">
                    <TabsTrigger
                      value="manual"
                      className="data-[state=active]:bg-[#ffa51f] data-[state=active]:text-[#000000]"
                    >
                      Saisie manuelle
                    </TabsTrigger>
                    <TabsTrigger
                      value="excel"
                      className="data-[state=active]:bg-[#ffa51f] data-[state=active]:text-[#000000]"
                    >
                      Import Excel/CSV
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="manual" className="space-y-4 mt-4">
                    <div className="space-y-3">
                      {textFields.map((field) => (
                        <div key={field.id} className="space-y-1">
                          <Label className="text-[#ffffff]/80 text-sm">{field.name}</Label>
                          <Input
                            value={manualFieldValues[field.id] || ""}
                            onChange={(e) =>
                              setManualFieldValues((prev) => ({
                                ...prev,
                                [field.id]: e.target.value,
                              }))
                            }
                            onKeyDown={(e) => e.key === "Enter" && handleAddName()}
                            placeholder={`Texte pour ${field.name}`}
                            className="bg-[#000000]/70 border-[#ffa51f]/40 text-[#ffffff]"
                          />
                        </div>
                      ))}
                      <Button
                        onClick={handleAddName}
                        className="w-full bg-[#ffa51f] text-[#000000] hover:bg-[#ffa51f]/90"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Ajouter une ligne
                      </Button>
                    </div>

                    {names.length > 0 && (
                      <div className="space-y-2 max-h-64 overflow-y-auto">
                        {names.map((item) => (
                          <NameItemComponent
                            key={item.id}
                            item={item}
                            onDelete={handleDeleteName}
                            onEdit={handleEditName}
                          />
                        ))}
                      </div>
                    )}
                  </TabsContent>

                  <TabsContent value="excel" className="space-y-4 mt-4">
                    <div className="border-2 border-dashed border-[#ffa51f]/60 rounded-lg p-6 text-center">
                      <FileSpreadsheet className="w-12 h-12 mx-auto text-[#ffa51f] mb-4" />
                      <p className="text-[#ffffff]/70 mb-4">
                        Format : 1 colonne (mode classique) ou plusieurs colonnes (1 colonne = 1 champ de texte)
                      </p>
                      <Button
                        onClick={() => excelInputRef.current?.click()}
                        className="bg-[#ffa51f] text-[#000000] hover:bg-[#ffa51f]/90"
                      >
                        <Upload className="w-4 h-4 mr-2" />
                        Importer un fichier .xlsx ou .csv
                      </Button>
                      <input
                        ref={excelInputRef}
                        type="file"
                        accept=".xlsx,.csv"
                        onChange={handleExcelUpload}
                        className="hidden"
                      />
                    </div>

                    {names.length > 0 && (
                      <div className="space-y-2 max-h-64 overflow-y-auto">
                        <p className="text-sm text-[#ffffff]/70 mb-2">
                          {names.length} nom(s) importé(s)
                        </p>
                        {names.map((item) => (
                          <NameItemComponent
                            key={item.id}
                            item={item}
                            onDelete={handleDeleteName}
                            onEdit={handleEditName}
                          />
                        ))}
                      </div>
                    )}
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>

          {/* Colonne droite - Configuration de position */}
          <div className="space-y-6">
            <Card className="bg-[#000000]/80 border-[#000000]">
              <CardHeader>
                <CardTitle className="text-[#ffffff] flex items-center gap-2">
                  <Settings className="w-5 h-5 text-[#ffa51f]" />
                  Configuration du champ sélectionné
                </CardTitle>
                <CardDescription className="text-[#ffffff]/70">
                  {selectedField ? `Configurez le champ "${selectedField.name}"` : "Sélectionnez un champ pour le configurer"}
                </CardDescription>
              </CardHeader>
              {selectedField ? (
                <CardContent className="space-y-6">
                  {/* Position Controls */}
                  <div className="space-y-4">
                    <Label className="text-[#ffffff]">Position du texte</Label>
                    <div className="space-y-2">
                      <Label className="text-[#ffffff]/80 text-sm">Pas de deplacement (px)</Label>
                      <Input
                        type="number"
                        value={moveStep}
                        onChange={(e) => setMoveStep(Math.max(1, parseInt(e.target.value) || 1))}
                        min="1"
                        className="bg-[#000000]/70 border-[#ffa51f]/40 text-[#ffffff]"
                      />
                    </div>
                    
                    {/* Arrow Controls */}
                    <div className="flex justify-center">
                      <div className="grid grid-cols-3 gap-2 w-32">
                        <div />
                        <Button
                          size="icon"
                          variant="outline"
                          onClick={() => moveTextField(selectedField.id, 0, -moveStep)}
                          className="border-[#ffa51f]/40 text-[#ffffff] hover:bg-[#ffa51f]/20"
                        >
                          <ArrowUp className="w-4 h-4" />
                        </Button>
                        <div />
                        <Button
                          size="icon"
                          variant="outline"
                          onClick={() => moveTextField(selectedField.id, -moveStep, 0)}
                          className="border-[#ffa51f]/40 text-[#ffffff] hover:bg-[#ffa51f]/20"
                        >
                          <ArrowLeft className="w-4 h-4" />
                        </Button>
                        <Button
                          size="icon"
                          variant="outline"
                          onClick={() => moveTextField(selectedField.id, 0, moveStep)}
                          className="border-[#ffa51f]/40 text-[#ffffff] hover:bg-[#ffa51f]/20"
                        >
                          <ArrowDown className="w-4 h-4" />
                        </Button>
                        <Button
                          size="icon"
                          variant="outline"
                          onClick={() => moveTextField(selectedField.id, moveStep, 0)}
                          className="border-[#ffa51f]/40 text-[#ffffff] hover:bg-[#ffa51f]/20"
                        >
                          <ArrowRight className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                    
                    <p className="text-xs text-[#ffffff]/60 text-center">
                      Utilisez les flèches pour un deplacement precis selon le pas choisi
                    </p>
                  </div>
                    <div className="space-y-2">
                      <Label className="text-[#ffffff]">Cle de colonne (Excel/CSV)</Label>
                      <Input
                        value={selectedField.dataKey}
                        onChange={(e) => updateTextField(selectedField.id, { dataKey: e.target.value })}
                        placeholder="Ex: Prenom, Nom, Fonction"
                        className="bg-[#000000]/70 border-[#ffa51f]/40 text-[#ffffff]"
                      />
                    </div>


                  {/* Text Customization */}
                  <div className="space-y-4 pt-4 border-t border-[#000000]">
                    <div className="space-y-2">
                      <Label className="text-[#ffffff]">Taille du texte</Label>
                      <Input
                        type="number"
                        value={selectedField.fontSize}
                        onChange={(e) => updateTextField(selectedField.id, { fontSize: parseInt(e.target.value) || 12 })}
                        min="8"
                        max="72"
                        className="bg-[#000000]/70 border-[#ffa51f]/40 text-[#ffffff]"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-[#ffffff]">Couleur du texte</Label>
                      <div className="flex gap-2">
                        <Input
                          type="color"
                          value={selectedField.color}
                          onChange={(e) => updateTextField(selectedField.id, { color: e.target.value })}
                          className="w-16 h-10 bg-[#000000]/70 border-[#ffa51f]/40"
                        />
                        <Input
                          type="text"
                          value={selectedField.color}
                          onChange={(e) => updateTextField(selectedField.id, { color: e.target.value })}
                          placeholder="#000000"
                          className="flex-1 bg-[#000000]/70 border-[#ffa51f]/40 text-[#ffffff]"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-[#ffffff]">Police</Label>
                      <select
                        value={selectedField.fontFamily}
                        onChange={(e) => updateTextField(selectedField.id, { fontFamily: e.target.value as FontFamily, fontWeight: "Regular" })}
                        className="w-full h-9 rounded-md border border-[#ffa51f]/40 bg-[#000000]/70 px-3 text-[#ffffff] text-sm focus:outline-none focus:ring-2 focus:ring-[#ffa51f]/70"
                      >
                        <option value="Montserrat">Montserrat</option>
                        <option value="Poppins">Poppins</option>
                        <option value="Roboto">Roboto</option>
                        <option value="Great Vibes">Great Vibes</option>
                      </select>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-[#ffffff]">Style</Label>
                      <select
                        value={selectedField.fontWeight}
                        onChange={(e) => updateTextField(selectedField.id, { fontWeight: e.target.value as FontWeight })}
                        className="w-full h-9 rounded-md border border-[#ffa51f]/40 bg-[#000000]/70 px-3 text-[#ffffff] text-sm focus:outline-none focus:ring-2 focus:ring-[#ffa51f]/70"
                        disabled={selectedField.fontFamily === "Great Vibes"}
                      >
                        {getAvailableWeights(selectedField.fontFamily).map(weight => (
                          <option key={weight} value={weight}>{weight}</option>
                        ))}
                      </select>
                      {selectedField.fontFamily === "Great Vibes" && (
                        <p className="text-xs text-[#ffffff]/60">
                          Great Vibes ne supporte que le style Regular
                        </p>
                      )}
                    </div>
                  </div>
                </CardContent>
              ) : (
                <CardContent>
                  <div className="text-center py-8">
                    <p className="text-[#ffffff]/60">
                      Sélectionnez un champ de texte pour le configurer
                    </p>
                  </div>
                </CardContent>
              )}
            </Card>

            {/* Bouton de génération */}
            <Button
              onClick={generateCertificates}
              disabled={!pdfFile || names.length === 0 || textFields.length === 0 || isGenerating}
              className="w-full bg-[#ffa51f] text-[#000000] hover:bg-[#ffa51f]/90 font-medium h-12 text-base"
            >
              {isGenerating ? (
                <>
                  <span className="animate-spin mr-2">⏳</span>
                  Génération en cours...
                </>
              ) : (
                <>
                  <Download className="w-5 h-5 mr-2" />
                  Générer les certificats
                </>
              )}
            </Button>
          </div>
        </div>
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
