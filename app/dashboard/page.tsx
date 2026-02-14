"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { moveText, PDFDocument, rgb } from "pdf-lib";
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
import { Textarea } from "@/components/ui/textarea";
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
  Move,
  Settings,
  Info,
  RefreshCw,
} from "lucide-react";
import { toast } from "sonner";
import { clearAuthSession } from "@/lib/auth";

type NameItem = {
  id: string;
  name: string;
  isEditing?: boolean;
};

type PositionPreset = {
  label: string;
  x: number;
  y: number;
  icon: React.ReactNode;
};

export default function DashboardPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const excelInputRef = useRef<HTMLInputElement>(null);
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [pdfPreview, setPdfPreview] = useState<string | null>(null);
  const [names, setNames] = useState<NameItem[]>([]);
  const [newName, setNewName] = useState("");
  const [positionMode, setPositionMode] = useState<"preset" | "custom">(
    "preset",
  );
  const [selectedPreset, setSelectedPreset] = useState<string>("center");
  const [customPosition, setCustomPosition] = useState({ x: 300, y: 400 });
  const [textSize, setTextSize] = useState(24);
  const [textColor, setTextColor] = useState("#000000");
  const [fontFamily, setFontFamily] = useState("Helvetica");
  const [isGenerating, setIsGenerating] = useState(false);

  // Fonction pour décrire la position approximative
  const getPositionDescription = (x: number, y: number) => {
    // Supposons un PDF standard de 612x792 points (US Letter)
    const pdfWidth = 612;
    const pdfHeight = 792;

    const xPercent = (x / pdfWidth) * 100;
    const yPercent = (y / pdfHeight) * 100;

    let horizontal = "";
    let vertical = "";

    // Position horizontale
    if (xPercent < 25) {
      horizontal = "à gauche";
    } else if (xPercent < 75) {
      horizontal = "au centre";
    } else {
      horizontal = "à droite";
    }

    // Position verticale
    if (yPercent < 25) {
      vertical = "en haut";
    } else if (yPercent < 75) {
      vertical = "au centre";
    } else {
      vertical = "en bas";
    }

    // Description combinée
    if (xPercent >= 25 && xPercent < 75 && yPercent >= 25 && yPercent < 75) {
      return "Position : Centre du document";
    } else if (xPercent < 25 && yPercent < 25) {
      return "Position : Haut gauche";
    } else if (xPercent >= 75 && yPercent < 25) {
      return "Position : Haut droite";
    } else if (xPercent < 25 && yPercent >= 75) {
      return "Position : Bas gauche";
    } else if (xPercent >= 75 && yPercent >= 75) {
      return "Position : Bas droite";
    } else {
      return `Position : ${vertical} ${horizontal} (X: ${x}px, Y: ${y}px)`;
    }
  };

  // Fonction pour obtenir l'indicateur de position
  const getPositionIndicator = () => {
    if (positionMode === "preset" && selectedPreset in positionPresets) {
      const preset = positionPresets[selectedPreset];
      return getPositionDescription(preset.x, preset.y);
    }
    return getPositionDescription(customPosition.x, customPosition.y);
  };

  // Vérifier l'authentification au chargement
  useEffect(() => {
    if (typeof window !== "undefined") {
      const authenticated = sessionStorage.getItem("authenticated") === "true";
      if (!authenticated) {
        router.push("/login");
      }
    }
  }, [router]);

  const positionPresets: Record<string, PositionPreset> = {
    "top-left": {
      label: "Haut",
      x: 0,
      y: -25,
      icon: <ArrowUp className="w-4 h-4" />,
    },
    
    "top-right": {
      label: "Droite",
      x: 25,
      y: 0,
      icon: <ArrowRight className="w-4 h-4" />,
    },"top-center": {
      label: "Bas",
      x: 0,
      y: 25,
      icon: <ArrowDown className="w-4 h-4" />,
    },
    "center-left": {
      label: "Gauche",
      x: -25,
      y: 0,
      icon: <ArrowLeft className="w-4 h-4" />,
    },
    "center": {
      label: "Rafraichir",
      x: 0,
      y: 0,
      icon: <RefreshCw className="w-4 h-4" />,
    }
  };

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
    if (!newName.trim()) {
      toast.error("Veuillez entrer un nom");
      return;
    }

    const newItem: NameItem = {
      id: Date.now().toString(),
      name: newName.trim(),
    };
    setNames([...names, newItem]);
    setNewName("");
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
      if (file.name.endsWith(".csv")) {
        // Traitement CSV
        Papa.parse(file, {
          header: true,
          complete: (results) => {
            const importedNames: NameItem[] = [];
            results.data.forEach((row: any, index: number) => {
              const name = Object.values(row)[0] as string;
              if (name && typeof name === "string" && name.trim()) {
                importedNames.push({
                  id: `excel-${Date.now()}-${index}`,
                  name: name.trim(),
                });
              }
            });
            setNames([...names, ...importedNames]);
            toast.success(`${importedNames.length} nom(s) importé(s)`);
          },
          error: (error) => {
            toast.error(`Erreur lors de l'import CSV: ${error.message}`);
          },
        });
      } else {
        // Traitement Excel
        const arrayBuffer = await file.arrayBuffer();
        const workbook = XLSX.read(arrayBuffer, { type: "array" });
        const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
        const data = XLSX.utils.sheet_to_json(firstSheet);

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

        setNames([...names, ...importedNames]);
        toast.success(`${importedNames.length} nom(s) importé(s)`);
      }
    } catch (error) {
      toast.error("Erreur lors de l'import du fichier");
      console.error(error);
    }
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
const [newPdfName, setNewPdfName] = useState<any>();
const [initialX, setInitialX] = useState(500);
const [initialY, setInitialY] = useState(500);
  const MoveText = async (px: number, py: number) => {
    if (!pdfFile) {
      toast.error("Veuillez d'abord uploader un PDF modèle");
      return;
    }

   

    try {
      // const zip = new JSZip();
      const pdfBytes = await pdfFile.arrayBuffer();
      const DefaultText = "Exemple de texte pour le positionnement";
      setInitialX(initialX + px);
      setInitialY(initialY + py);
      let x = initialX;
      let y = initialY;
      const colorRgb = { r: 0, g: 0, b: 0 };
      const pdfFontName = "Helvetica";
      const pdfDoc = await PDFDocument.load(pdfBytes);
      const pages = pdfDoc.getPages();
      const firstPage = pages[0];
      const { width, height } = firstPage.getSize();
      const selectedFont = await pdfDoc.embedFont(pdfFontName);

      firstPage.drawText(DefaultText, {
          x: x,
          y: height - y, // Inverser Y car pdf-lib utilise le bas comme origine
          size: textSize,
          font: selectedFont,
          color: rgb(colorRgb.r, colorRgb.g, colorRgb.b),
        });
      const pdfBytesModified:any = await pdfDoc.save();
      setNewPdfName(`preview_${Date.now()}.pdf`);
      const blob = new Blob([pdfBytesModified], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      setPdfPreview(url);
    } catch (error) {
      console.error(error);
      toast.error("Erreur lors de la modification du texte du certificat");
    }
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

    setIsGenerating(true);

    try {
      const zip = new JSZip();
      const pdfBytes = await pdfFile.arrayBuffer();

      // Déterminer la position
      let x = customPosition.x;
      let y = customPosition.y;
      if (positionMode === "preset" && selectedPreset in positionPresets) {
        x = initialX;
        y = initialY;
      }

      for (const nameItem of names) {
        const pdfDoc = await PDFDocument.load(pdfBytes);
        const pages = pdfDoc.getPages();
        const firstPage = pages[0];
        const { width, height } = firstPage.getSize();

        // Convertir la couleur hex en RGB
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

        const colorRgb = hexToRgb(textColor);

        // Mapper les polices demandées aux polices PDF standard
        const fontMap: Record<string, string> = {
          'Helvetica': "Helvetica",
          "Helvetica-Bold": "Helvetica-Bold",
          "Helvetica-Italic": "Helvetica-Oblique",
          "Helvetica-BoldItalic": "Helvetica-BoldOblique",
          "Times New Roman": "Times-Roman",
          "Times-Bold": "Times-Bold",
          "Times-Italic": "Times-Italic",
          "Times-BoldItalic": "Times-BoldItalic",
          'Georgia': "Times-Roman",
          'Garamond': "Times-Roman",
          'Montserrat': "Helvetica",
          'Poppins': "Helvetica",
          'Roboto': "Helvetica",
          "Great Vibes": "Times-Italic",
          'Allura': "Times-Italic",
          'Courier': "Courier",
          "Courier-Bold": "Courier-Bold",
        };

        const pdfFontName = fontMap[fontFamily] || "Helvetica";
        const selectedFont = await pdfDoc.embedFont(pdfFontName);

        // Dessiner le texte sur le PDF
        firstPage.drawText(nameItem.name, {
          x: x,
          y: height - y, // Inverser Y car pdf-lib utilise le bas comme origine
          size: textSize,
          font: selectedFont,
          color: rgb(colorRgb.r, colorRgb.g, colorRgb.b),
        });

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

            {/* Étape 2: Ajout des noms */}
            <Card className="bg-[#000000]/80 border-[#000000]">
              <CardHeader>
                <CardTitle className="text-[#ffffff]">
                  Étape 2 : Choix du mode d'ajout des noms
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
                    <div className="flex gap-2">
                      <Input
                        value={newName}
                        onChange={(e) => setNewName(e.target.value)}
                        onKeyPress={(e) => e.key === "Enter" && handleAddName()}
                        placeholder="Nom & Prénoms"
                        className="bg-[#000000]/70 border-[#ffa51f]/40 text-[#ffffff]"
                      />
                      <Button
                        onClick={handleAddName}
                        className="bg-[#ffa51f] text-[#000000] hover:bg-[#ffa51f]/90"
                      >
                        <Plus className="w-4 h-4" />
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
                        Format attendu : une colonne avec les noms
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
                  Configuration de position
                </CardTitle>
                <CardDescription className="text-[#ffffff]/70">
                  Définissez où placer le nom sur le certificat
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <Tabs
                  value={positionMode}
                  onValueChange={(v) =>
                    setPositionMode(v as "preset" | "custom")
                  }
                >
                  <TabsList className="w-full bg-[#000000]/80 border-[#ffa51f]/40">
                    <TabsTrigger
                      value="preset"
                      className="flex-1 data-[state=active]:bg-[#ffa51f] data-[state=active]:text-[#000000]"
                    >
                      Positions rapides
                    </TabsTrigger>
                    <TabsTrigger
                      value="custom"
                      className="flex-1 data-[state=active]:bg-[#ffa51f] data-[state=active]:text-[#000000]"
                    >
                      Personnalisée
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="preset" className="space-y-4 mt-4">
                    <div className="grid grid-cols-2 gap-2">
                      {Object.entries(positionPresets).map(([key, preset]) => (
                        <Button
                          key={key}
                          variant={
                            selectedPreset === key ? "default" : "outline"
                          }
                          onClick={() => {setSelectedPreset(key), MoveText(preset.x, preset.y)}}
                          className={`h-auto py-3 flex flex-col items-center gap-2 ${
                            selectedPreset === key
                              ? "bg-zinc-100 text-zinc-900"
                              : "border-zinc-700 text-zinc-300 hover:bg-zinc-800"
                          }`}
                        >
                          {preset.icon}
                          <span className="text-xs">{preset.label}</span>
                        </Button>
                      ))}
                    </div>
                  </TabsContent>

                  <TabsContent value="custom" className="space-y-4 mt-4">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label className="text-[#ffffff]">Position X</Label>
                        <Input
                          type="number"
                          value={customPosition.x}
                          onChange={(e) =>
                            setCustomPosition({
                              ...customPosition,
                              x: parseInt(e.target.value) || 0,
                            })
                          }
                          className="bg-[#000000]/70 border-[#ffa51f]/40 text-[#ffffff]"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-[#ffffff]">Position Y</Label>
                        <Input
                          type="number"
                          value={customPosition.y}
                          onChange={(e) =>
                            setCustomPosition({
                              ...customPosition,
                              y: parseInt(e.target.value) || 0,
                            })
                          }
                          className="bg-[#000000]/70 border-[#ffa51f]/40 text-[#ffffff]"
                        />
                      </div>

                      {/* Indicateur de position */}
                      <div className="p-3 bg-[#000000]/70 rounded-lg border border-[#ffa51f]/40">
                        <p className="text-sm font-medium text-[#ffffff] mb-1">
                          📍 Position actuelle
                        </p>
                        <p className="text-xs text-[#ffffff]/70">
                          {getPositionDescription(
                            customPosition.x,
                            customPosition.y,
                          )}
                        </p>
                        <div className="mt-2 text-xs text-[#ffffff]/60">
                          Coordonnées : X = {customPosition.x}px, Y ={" "}
                          {customPosition.y}px
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>

                <div className="space-y-4 pt-4 border-t border-[#000000]">
                  <div className="space-y-2">
                    <Label className="text-[#ffffff]">Taille du texte</Label>
                    <Input
                      type="number"
                      value={textSize}
                      onChange={(e) =>
                        setTextSize(parseInt(e.target.value) || 12)
                      }
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
                        value={textColor}
                        onChange={(e) => setTextColor(e.target.value)}
                        className="w-16 h-10 bg-[#000000]/70 border-[#ffa51f]/40"
                      />
                      <Input
                        type="text"
                        value={textColor}
                        onChange={(e) => setTextColor(e.target.value)}
                        placeholder="#000000"
                        className="flex-1 bg-[#000000]/70 border-[#ffa51f]/40 text-[#ffffff]"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-[#ffffff]">Police</Label>
                    <select
                      value={fontFamily}
                      onChange={(e) => setFontFamily(e.target.value)}
                      className="w-full h-9 rounded-md border border-[#ffa51f]/40 bg-[#000000]/70 px-3 text-[#ffffff] text-sm focus:outline-none focus:ring-2 focus:ring-[#ffa51f]/70"
                    >
                      <optgroup label="Sans-serif">
                        <option value="Helvetica">Helvetica</option>
                        <option value="Helvetica-Bold">Helvetica Bold</option>
                        <option value="Montserrat">Montserrat</option>
                        <option value="Poppins">Poppins</option>
                        <option value="Roboto">Roboto</option>
                      </optgroup>
                      <optgroup label="Serif">
                        <option value="Times New Roman">Times New Roman</option>
                        <option value="Times-Bold">Times Bold</option>
                        <option value="Georgia">Georgia</option>
                        <option value="Garamond">Garamond</option>
                      </optgroup>
                      <optgroup label="Script">
                        <option value="Great Vibes">Great Vibes</option>
                        <option value="Allura">Allura</option>
                      </optgroup>
                      <optgroup label="Monospace">
                        <option value="Courier">Courier</option>
                        <option value="Courier-Bold">Courier Bold</option>
                      </optgroup>
                    </select>
                    <p className="text-xs text-[#ffffff]/60">
                      Note : Certaines polices sont mappées aux polices PDF
                      standard pour compatibilité
                    </p>
                  </div>
                </div>

                <div className="pt-4 border-t border-[#000000]">
                  <div className="flex items-start gap-3 p-4 bg-[#000000]/70 rounded-lg border border-[#ffa51f]/40">
                    <Info className="w-5 h-5 text-[#ffa51f] mt-0.5 shrink-0" />
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-[#ffffff]">
                        Information sur le placement
                      </p>
                      <p className="text-xs text-[#ffffff]/70 leading-relaxed mb-2">
                        Les informations seront placées en fonction des
                        coordonnées définies. Vous pouvez ajuster la position
                        pour un rendu plus précis sur votre certificat.
                      </p>
                      {positionMode === "preset" && (
                        <div className="mt-2 p-2 bg-[#000000]/80 rounded border border-[#ffa51f]/40">
                          <p className="text-xs text-[#ffffff]/70">
                            <span className="font-medium text-[#ffffff]">
                              Position sélectionnée :
                            </span>{" "}
                            {getPositionIndicator()}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Bouton de génération */}
            <Button
              onClick={generateCertificates}
              disabled={!pdfFile || names.length === 0 || isGenerating}
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
