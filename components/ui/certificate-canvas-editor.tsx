"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import {
  Type,
  ImageIcon,
  Square,
  Circle,
  Minus,
  QrCode,
  Trash2,
  Copy,
  Lock,
  Unlock,
  Eye,
  EyeOff,
  ChevronUp,
  ChevronDown,
  Layers as LayersIcon,
  Settings2,
  RotateCw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { FontFamily, FontWeight } from "@/lib/fonts";
import { getAvailableWeights } from "@/lib/fonts";

export type CanvasObjectType = "text" | "image" | "rect" | "ellipse" | "line" | "qr";

export interface CanvasObject {
  id: string;
  type: CanvasObjectType;
  name: string;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  opacity: number;
  zIndex: number;
  visible: boolean;
  locked: boolean;
  // text
  dataKey?: string;
  fallbackText?: string;
  fontSize?: number;
  color?: string;
  fontFamily?: FontFamily;
  fontWeight?: FontWeight;
  textAlign?: "left" | "center" | "right";
  // image
  src?: string;
  // shape
  fill?: string;
  stroke?: string;
  strokeWidth?: number;
}

interface CertificateCanvasEditorProps {
  pdfUrl: string | null;
  backgroundImageUrl?: string | null;
  objects: CanvasObject[];
  onObjectsChange: (objects: CanvasObject[]) => void;
  availableDataKeys: string[];
  previewRecord?: Record<string, string>;
  className?: string;
}

const SNAP_THRESHOLD = 6;
const CANVAS_HEIGHT = 700;

let idCounter = 0;
const nextId = (prefix: string) => `${prefix}-${Date.now()}-${idCounter++}`;

type DragMode = "move" | "resize" | "rotate";

interface DragState {
  mode: DragMode;
  id: string;
  handle?: string;
  startClientX: number;
  startClientY: number;
  origin: CanvasObject;
  centerX: number;
  centerY: number;
}

export function CertificateCanvasEditor({
  pdfUrl,
  backgroundImageUrl,
  objects,
  onObjectsChange,
  availableDataKeys,
  previewRecord,
  className = "",
}: CertificateCanvasEditorProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const replaceImageInputRef = useRef<HTMLInputElement>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"properties" | "layers">("properties");
  const [guides, setGuides] = useState<{ v: number | null; h: number | null }>({ v: null, h: null });
  const dragStateRef = useRef<DragState | null>(null);

  const selected = objects.find((o) => o.id === selectedId) || null;

  const updateObject = (id: string, updates: Partial<CanvasObject>) => {
    onObjectsChange(objects.map((o) => (o.id === id ? { ...o, ...updates } : o)));
  };

  const removeObject = (id: string) => {
    onObjectsChange(objects.filter((o) => o.id !== id));
    if (selectedId === id) setSelectedId(null);
  };

  const duplicateObject = (id: string) => {
    const obj = objects.find((o) => o.id === id);
    if (!obj) return;
    const maxZ = Math.max(0, ...objects.map((o) => o.zIndex));
    const clone: CanvasObject = { ...obj, id: nextId(obj.type), x: obj.x + 20, y: obj.y + 20, zIndex: maxZ + 1, name: `${obj.name} (copie)` };
    onObjectsChange([...objects, clone]);
    setSelectedId(clone.id);
  };

  const bringForward = (id: string) => {
    const sorted = [...objects].sort((a, b) => a.zIndex - b.zIndex);
    const idx = sorted.findIndex((o) => o.id === id);
    if (idx < sorted.length - 1) {
      const a = sorted[idx];
      const b = sorted[idx + 1];
      updateObject(a.id, { zIndex: b.zIndex });
      updateObject(b.id, { zIndex: a.zIndex });
    }
  };

  const sendBackward = (id: string) => {
    const sorted = [...objects].sort((a, b) => a.zIndex - b.zIndex);
    const idx = sorted.findIndex((o) => o.id === id);
    if (idx > 0) {
      const a = sorted[idx];
      const b = sorted[idx - 1];
      updateObject(a.id, { zIndex: b.zIndex });
      updateObject(b.id, { zIndex: a.zIndex });
    }
  };

  const addObject = (type: CanvasObjectType) => {
    const maxZ = Math.max(0, ...objects.map((o) => o.zIndex));
    const centerX = (containerRef.current?.getBoundingClientRect().width || 500) / 2;
    const base = {
      id: nextId(type),
      zIndex: maxZ + 1,
      opacity: 1,
      rotation: 0,
      visible: true,
      locked: false,
    };
    let obj: CanvasObject;
    switch (type) {
      case "text":
        obj = {
          ...base,
          type: "text",
          name: "Nouveau texte",
          x: Math.max(0, centerX - 80),
          y: 300,
          width: 200,
          height: 42,
          dataKey: availableDataKeys[0] || "",
          fallbackText: "Texte exemple",
          fontSize: 28,
          color: "#1E1E1E",
          fontFamily: "Montserrat",
          fontWeight: "Bold",
          textAlign: "left",
        };
        break;
      case "image":
        obj = { ...base, type: "image", name: "Image", x: centerX - 60, y: 300, width: 120, height: 120, src: undefined };
        break;
      case "rect":
        obj = { ...base, type: "rect", name: "Rectangle", x: centerX - 75, y: 300, width: 150, height: 80, fill: "#D68C2D33", stroke: "#D68C2D", strokeWidth: 2 };
        break;
      case "ellipse":
        obj = { ...base, type: "ellipse", name: "Ellipse", x: centerX - 60, y: 300, width: 120, height: 120, fill: "#12A2AC33", stroke: "#12A2AC", strokeWidth: 2 };
        break;
      case "line":
        obj = { ...base, type: "line", name: "Ligne", x: centerX - 75, y: 300, width: 150, height: 2, stroke: "#1E1E1E", strokeWidth: 2, fill: "transparent" };
        break;
      case "qr":
        obj = { ...base, type: "qr", name: "QR Code", x: centerX - 50, y: 300, width: 100, height: 100 };
        break;
      default:
        return;
    }
    onObjectsChange([...objects, obj]);
    setSelectedId(obj.id);
    setActiveTab("properties");
  };

  const handleImageFile = (file: File, targetId?: string) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const src = e.target?.result as string;
      if (targetId) {
        updateObject(targetId, { src });
      } else {
        const maxZ = Math.max(0, ...objects.map((o) => o.zIndex));
        const obj: CanvasObject = {
          id: nextId("image"),
          type: "image",
          name: "Image",
          x: 150,
          y: 300,
          width: 140,
          height: 140,
          rotation: 0,
          opacity: 1,
          zIndex: maxZ + 1,
          visible: true,
          locked: false,
          src,
        };
        onObjectsChange([...objects, obj]);
        setSelectedId(obj.id);
      }
    };
    reader.readAsDataURL(file);
  };

  // ---- Drag / resize / rotate handling ----
  const startDrag = (e: React.MouseEvent, id: string, mode: DragMode, handle?: string) => {
    const obj = objects.find((o) => o.id === id);
    if (!obj || obj.locked) return;
    e.preventDefault();
    e.stopPropagation();
    setSelectedId(id);
    const centerX = obj.x + obj.width / 2;
    const centerY = obj.y + obj.height / 2;
    dragStateRef.current = {
      mode,
      id,
      handle,
      startClientX: e.clientX,
      startClientY: e.clientY,
      origin: obj,
      centerX,
      centerY,
    };
    window.addEventListener("mousemove", handleWindowMouseMove);
    window.addEventListener("mouseup", handleWindowMouseUp);
  };

  const computeSnappedPosition = useCallback(
    (candidate: { x: number; y: number; width: number; height: number }, id: string) => {
      const containerWidth = containerRef.current?.getBoundingClientRect().width || 0;
      const containerHeight = CANVAS_HEIGHT;
      let { x, y } = candidate;
      let vLine: number | null = null;
      let hLine: number | null = null;

      const candLeft = x;
      const candRight = x + candidate.width;
      const candCenterX = x + candidate.width / 2;
      const candTop = y;
      const candBottom = y + candidate.height;
      const candCenterY = y + candidate.height / 2;

      const vTargets: number[] = [0, containerWidth / 2, containerWidth];
      const hTargets: number[] = [0, containerHeight / 2, containerHeight];
      objects
        .filter((o) => o.id !== id && o.visible)
        .forEach((o) => {
          vTargets.push(o.x, o.x + o.width / 2, o.x + o.width);
          hTargets.push(o.y, o.y + o.height / 2, o.y + o.height);
        });

      for (const t of vTargets) {
        if (Math.abs(candCenterX - t) < SNAP_THRESHOLD) {
          x = t - candidate.width / 2;
          vLine = t;
          break;
        }
        if (Math.abs(candLeft - t) < SNAP_THRESHOLD) {
          x = t;
          vLine = t;
          break;
        }
        if (Math.abs(candRight - t) < SNAP_THRESHOLD) {
          x = t - candidate.width;
          vLine = t;
          break;
        }
      }
      for (const t of hTargets) {
        if (Math.abs(candCenterY - t) < SNAP_THRESHOLD) {
          y = t - candidate.height / 2;
          hLine = t;
          break;
        }
        if (Math.abs(candTop - t) < SNAP_THRESHOLD) {
          y = t;
          hLine = t;
          break;
        }
        if (Math.abs(candBottom - t) < SNAP_THRESHOLD) {
          y = t - candidate.height;
          hLine = t;
          break;
        }
      }

      return { x, y, vLine, hLine };
    },
    [objects]
  );

  const handleWindowMouseMove = useCallback(
    (e: MouseEvent) => {
      const drag = dragStateRef.current;
      if (!drag) return;
      const dx = e.clientX - drag.startClientX;
      const dy = e.clientY - drag.startClientY;
      const { origin } = drag;

      if (drag.mode === "move") {
        const snapped = computeSnappedPosition(
          { x: origin.x + dx, y: origin.y + dy, width: origin.width, height: origin.height },
          drag.id
        );
        setGuides({ v: snapped.vLine, h: snapped.hLine });
        updateObject(drag.id, { x: Math.round(snapped.x), y: Math.round(snapped.y) });
      } else if (drag.mode === "resize") {
        let { x, y, width, height } = origin;
        const handle = drag.handle || "se";
        if (handle.includes("e")) width = Math.max(20, origin.width + dx);
        if (handle.includes("s")) height = Math.max(16, origin.height + dy);
        if (handle.includes("w")) {
          width = Math.max(20, origin.width - dx);
          x = origin.x + (origin.width - width);
        }
        if (handle.includes("n")) {
          height = Math.max(16, origin.height - dy);
          y = origin.y + (origin.height - height);
        }
        const updates: Partial<CanvasObject> = { x, y, width, height };
        if (origin.type === "text") {
          updates.fontSize = Math.max(8, Math.round(height / 1.3));
        }
        updateObject(drag.id, updates);
      } else if (drag.mode === "rotate") {
        const angleRad = Math.atan2(e.clientY - drag.centerY - (containerRef.current?.getBoundingClientRect().top || 0), e.clientX - drag.centerX - (containerRef.current?.getBoundingClientRect().left || 0));
        let deg = (angleRad * 180) / Math.PI + 90;
        deg = Math.round(deg);
        if (deg < 0) deg += 360;
        updateObject(drag.id, { rotation: deg });
      }
    },
    [computeSnappedPosition]
  );

  const handleWindowMouseUp = useCallback(() => {
    dragStateRef.current = null;
    setGuides({ v: null, h: null });
    window.removeEventListener("mousemove", handleWindowMouseMove);
    window.removeEventListener("mouseup", handleWindowMouseUp);
  }, [handleWindowMouseMove]);

  useEffect(() => {
    return () => {
      window.removeEventListener("mousemove", handleWindowMouseMove);
      window.removeEventListener("mouseup", handleWindowMouseUp);
    };
  }, [handleWindowMouseMove, handleWindowMouseUp]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.key === "Delete" || e.key === "Backspace") && selectedId) {
        const target = e.target as HTMLElement;
        if (target.tagName === "INPUT" || target.tagName === "TEXTAREA") return;
        removeObject(selectedId);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [selectedId, objects]);

  const sortedForRender = [...objects].sort((a, b) => a.zIndex - b.zIndex);
  const sortedForLayers = [...objects].sort((a, b) => b.zIndex - a.zIndex);

  const resolveTextContent = (obj: CanvasObject) => {
    if (obj.dataKey && previewRecord && previewRecord[obj.dataKey]) return previewRecord[obj.dataKey];
    return obj.fallbackText || obj.name;
  };

  const handleMap: { key: string; cursor: string; style: React.CSSProperties }[] = [
    { key: "nw", cursor: "nwse-resize", style: { top: -6, left: -6 } },
    { key: "ne", cursor: "nesw-resize", style: { top: -6, right: -6 } },
    { key: "sw", cursor: "nesw-resize", style: { bottom: -6, left: -6 } },
    { key: "se", cursor: "nwse-resize", style: { bottom: -6, right: -6 } },
  ];

  return (
    <div className={`flex flex-col overflow-hidden rounded-3xl border border-[#E5E7EB] bg-white shadow-sm ${className}`}>
      {/* Top bar */}
      <div className="flex items-center justify-between bg-gradient-to-r from-[#D68C2D] to-[#12A2AC] px-6 py-3.5">
        <div className="flex items-center gap-2 text-white">
          <Settings2 className="size-4" />
          <span className="font-heading text-sm font-bold">Studio de création</span>
        </div>
        <span className="rounded-full bg-white/20 px-3 py-1 text-xs font-medium text-white backdrop-blur-sm">{objects.length} élément{objects.length > 1 ? "s" : ""}</span>
      </div>

      <div className="flex" style={{ height: CANVAS_HEIGHT + 32 }}>
        {/* Left icon rail (Canva-like) */}
        <div className="flex w-24 shrink-0 flex-col items-center gap-2 overflow-y-auto border-r border-[#E5E7EB] bg-[#FAFAFA] py-5">
          <RailButton icon={Type} label="Texte" onClick={() => addObject("text")} />
          <RailButton icon={ImageIcon} label="Image" onClick={() => imageInputRef.current?.click()} />
          <input ref={imageInputRef} type="file" accept="image/png,image/jpeg,image/svg+xml" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) handleImageFile(f); e.target.value = ""; }} />
          <RailButton icon={Square} label="Carré" onClick={() => addObject("rect")} />
          <RailButton icon={Circle} label="Cercle" onClick={() => addObject("ellipse")} />
          <RailButton icon={Minus} label="Ligne" onClick={() => addObject("line")} />
          <RailButton icon={QrCode} label="QR Code" onClick={() => addObject("qr")} />
          <div className="my-2 h-px w-10 bg-[#E5E7EB]" />
          <RailButton icon={LayersIcon} label="Calques" active={activeTab === "layers"} onClick={() => setActiveTab("layers")} />
        </div>

        {/* Canvas workspace */}
        <div className="flex flex-1 flex-col overflow-hidden bg-[#EFEFEA]">
          <div className="flex flex-1 items-center justify-center overflow-auto p-8">
            <div
              ref={containerRef}
              className="relative mx-auto overflow-hidden rounded-2xl bg-white shadow-2xl select-none ring-1 ring-black/5"
              style={{ height: CANVAS_HEIGHT, width: "min(100%, 880px)" }}
              onMouseDown={() => setSelectedId(null)}
            >
              {backgroundImageUrl ? (
                <img src={backgroundImageUrl} alt="Fond du certificat" className="pointer-events-none h-full w-full object-contain" draggable={false} />
              ) : pdfUrl ? (
                <iframe src={pdfUrl} className="pointer-events-none h-full w-full" title="PDF Preview" />
              ) : (
                <div className="flex h-full items-center justify-center text-[#6B7280]">Aucun modèle chargé</div>
              )}

              {/* Snap guides */}
              {guides.v !== null && <div className="pointer-events-none absolute top-0 bottom-0 w-px bg-[#12A2AC]" style={{ left: guides.v }} />}
              {guides.h !== null && <div className="pointer-events-none absolute left-0 right-0 h-px bg-[#12A2AC]" style={{ top: guides.h }} />}

              {/* Objects */}
              {sortedForRender.filter((o) => o.visible).map((obj) => {
            const isSelected = obj.id === selectedId;
            return (
              <div
                key={obj.id}
                className="absolute"
                style={{
                  left: obj.x,
                  top: obj.y,
                  width: obj.width,
                  height: obj.height,
                  opacity: obj.opacity,
                  transform: `rotate(${obj.rotation}deg)`,
                  transformOrigin: "center center",
                  cursor: obj.locked ? "not-allowed" : "move",
                }}
                onMouseDown={(e) => startDrag(e, obj.id, "move")}
              >
                {obj.type === "text" && (
                  <div
                    className="flex h-full w-full items-center whitespace-nowrap"
                    style={{
                      fontFamily: obj.fontFamily,
                      fontSize: obj.fontSize,
                      color: obj.color,
                      fontWeight: obj.fontWeight === "Bold" ? 700 : obj.fontWeight === "SemiBold" ? 600 : 400,
                      justifyContent: obj.textAlign === "center" ? "center" : obj.textAlign === "right" ? "flex-end" : "flex-start",
                    }}
                  >
                    {resolveTextContent(obj)}
                  </div>
                )}
                {obj.type === "image" && (
                  obj.src ? (
                    <img src={obj.src} alt={obj.name} className="h-full w-full object-contain" draggable={false} />
                  ) : (
                    <div className="flex h-full w-full flex-col items-center justify-center rounded-lg border-2 border-dashed border-[#D68C2D]/50 bg-[#D68C2D]/5 text-[#D68C2D]">
                      <ImageIcon className="size-6" />
                      <span className="mt-1 text-[10px] font-medium">Importer</span>
                    </div>
                  )
                )}
                {obj.type === "rect" && (
                  <div className="h-full w-full" style={{ backgroundColor: obj.fill, border: `${obj.strokeWidth}px solid ${obj.stroke}` }} />
                )}
                {obj.type === "ellipse" && (
                  <div className="h-full w-full rounded-full" style={{ backgroundColor: obj.fill, border: `${obj.strokeWidth}px solid ${obj.stroke}` }} />
                )}
                {obj.type === "line" && (
                  <div className="w-full" style={{ borderTop: `${obj.strokeWidth}px solid ${obj.stroke}`, marginTop: (obj.height || 2) / 2 }} />
                )}
                {obj.type === "qr" && (
                  <div className="flex h-full w-full flex-col items-center justify-center gap-1 rounded-lg border-2 border-dashed border-[#1E1E1E]/40 bg-white text-[#1E1E1E]">
                    <QrCode className="size-8" />
                    <span className="text-[9px] font-medium text-center leading-tight px-1">QR unique par certificat</span>
                  </div>
                )}

                {isSelected && !obj.locked && (
                  <>
                    <div className="pointer-events-none absolute inset-0 rounded-sm border-2 border-[#D68C2D]" />
                    {handleMap.map((h) => (
                      <div
                        key={h.key}
                        className="absolute z-10 h-3 w-3 rounded-full border-2 border-[#D68C2D] bg-white shadow"
                        style={{ ...h.style, cursor: h.cursor }}
                        onMouseDown={(e) => startDrag(e, obj.id, "resize", h.key)}
                      />
                    ))}
                    <div
                      className="absolute left-1/2 z-10 flex h-6 w-6 -translate-x-1/2 items-center justify-center rounded-full border-2 border-[#12A2AC] bg-white shadow"
                      style={{ top: -32, cursor: "grab" }}
                      onMouseDown={(e) => startDrag(e, obj.id, "rotate")}
                    >
                      <RotateCw className="size-3 text-[#12A2AC]" />
                    </div>
                  </>
                )}
              </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Side panel */}
        <div className="flex w-[360px] shrink-0 flex-col overflow-hidden border-l border-[#E5E7EB] bg-white">
          <div className="flex border-b border-[#E5E7EB]">
            <button type="button" onClick={() => setActiveTab("properties")} className={`flex-1 flex items-center justify-center gap-1.5 py-4 text-sm font-semibold transition-colors ${activeTab === "properties" ? "text-[#D68C2D] border-b-2 border-[#D68C2D] bg-[#D68C2D]/5" : "text-[#6B7280] hover:bg-[#FAFAFA]"}`}>
              <Settings2 className="size-4" />Propriétés
            </button>
            <button type="button" onClick={() => setActiveTab("layers")} className={`flex-1 flex items-center justify-center gap-1.5 py-4 text-sm font-semibold transition-colors ${activeTab === "layers" ? "text-[#D68C2D] border-b-2 border-[#D68C2D] bg-[#D68C2D]/5" : "text-[#6B7280] hover:bg-[#FAFAFA]"}`}>
              <LayersIcon className="size-4" />Calques ({objects.length})
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-5">
            {activeTab === "properties" && (
              selected ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Input value={selected.name} onChange={(e) => updateObject(selected.id, { name: e.target.value })} className="h-9 rounded-lg border-[#E5E7EB] font-semibold" />
                  </div>
                  <div className="flex gap-2">
                    <Button type="button" size="sm" variant="outline" className="flex-1 rounded-lg" onClick={() => duplicateObject(selected.id)}><Copy className="mr-1.5 size-3.5" />Dupliquer</Button>
                    <Button type="button" size="sm" variant="outline" className="flex-1 rounded-lg text-red-600 hover:bg-red-50" onClick={() => removeObject(selected.id)}><Trash2 className="mr-1.5 size-3.5" />Supprimer</Button>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div><Label className="text-xs text-[#6B7280]">X (px)</Label><Input type="number" value={Math.round(selected.x)} onChange={(e) => updateObject(selected.id, { x: parseInt(e.target.value) || 0 })} className="mt-1 h-9 rounded-lg border-[#E5E7EB]" /></div>
                    <div><Label className="text-xs text-[#6B7280]">Y (px)</Label><Input type="number" value={Math.round(selected.y)} onChange={(e) => updateObject(selected.id, { y: parseInt(e.target.value) || 0 })} className="mt-1 h-9 rounded-lg border-[#E5E7EB]" /></div>
                    <div><Label className="text-xs text-[#6B7280]">Largeur</Label><Input type="number" value={Math.round(selected.width)} onChange={(e) => updateObject(selected.id, { width: Math.max(10, parseInt(e.target.value) || 10) })} className="mt-1 h-9 rounded-lg border-[#E5E7EB]" /></div>
                    <div><Label className="text-xs text-[#6B7280]">Hauteur</Label><Input type="number" value={Math.round(selected.height)} onChange={(e) => updateObject(selected.id, { height: Math.max(10, parseInt(e.target.value) || 10) })} className="mt-1 h-9 rounded-lg border-[#E5E7EB]" /></div>
                  </div>

                  <div>
                    <Label className="text-xs text-[#6B7280]">Rotation ({Math.round(selected.rotation)}°)</Label>
                    <input type="range" min={0} max={360} value={selected.rotation} onChange={(e) => updateObject(selected.id, { rotation: parseInt(e.target.value) })} className="mt-1.5 w-full accent-[#D68C2D]" />
                  </div>
                  <div>
                    <Label className="text-xs text-[#6B7280]">Opacité ({Math.round(selected.opacity * 100)}%)</Label>
                    <input type="range" min={0} max={100} value={Math.round(selected.opacity * 100)} onChange={(e) => updateObject(selected.id, { opacity: parseInt(e.target.value) / 100 })} className="mt-1.5 w-full accent-[#D68C2D]" />
                  </div>

                  {selected.type === "text" && (
                    <div className="space-y-3 rounded-xl border border-[#E5E7EB] bg-[#FAFAFA] p-4">
                      <p className="text-xs font-semibold text-[#1E1E1E]">Contenu dynamique</p>
                      <select value={selected.dataKey || ""} onChange={(e) => updateObject(selected.id, { dataKey: e.target.value })} className="h-9 w-full rounded-lg border border-[#E5E7EB] bg-white px-2 text-sm">
                        <option value="">Texte fixe</option>
                        {availableDataKeys.map((k) => <option key={k} value={k}>{k}</option>)}
                      </select>
                      <Input value={selected.fallbackText || ""} onChange={(e) => updateObject(selected.id, { fallbackText: e.target.value })} placeholder="Texte affiché / exemple" className="h-9 rounded-lg border-[#E5E7EB]" />
                      <div className="grid grid-cols-2 gap-3">
                        <div><Label className="text-xs text-[#6B7280]">Taille</Label><Input type="number" value={selected.fontSize} onChange={(e) => updateObject(selected.id, { fontSize: parseInt(e.target.value) || 12 })} className="mt-1 h-9 rounded-lg border-[#E5E7EB]" /></div>
                        <div><Label className="text-xs text-[#6B7280]">Couleur</Label><Input type="color" value={selected.color} onChange={(e) => updateObject(selected.id, { color: e.target.value })} className="mt-1 h-9 rounded-lg border-[#E5E7EB]" /></div>
                      </div>
                      <select value={selected.fontFamily} onChange={(e) => updateObject(selected.id, { fontFamily: e.target.value as FontFamily, fontWeight: "Regular" })} className="h-9 w-full rounded-lg border border-[#E5E7EB] bg-white px-2 text-sm">
                        <option value="Montserrat">Montserrat</option>
                        <option value="Poppins">Poppins</option>
                        <option value="Roboto">Roboto</option>
                        <option value="Great Vibes">Great Vibes</option>
                      </select>
                      <select value={selected.fontWeight} onChange={(e) => updateObject(selected.id, { fontWeight: e.target.value as FontWeight })} disabled={selected.fontFamily === "Great Vibes"} className="h-9 w-full rounded-lg border border-[#E5E7EB] bg-white px-2 text-sm disabled:opacity-50">
                        {getAvailableWeights(selected.fontFamily as FontFamily).map((w) => <option key={w} value={w}>{w}</option>)}
                      </select>
                      <div className="flex gap-2">
                        {(["left", "center", "right"] as const).map((align) => (
                          <button key={align} type="button" onClick={() => updateObject(selected.id, { textAlign: align })} className={`flex-1 rounded-lg border py-1.5 text-xs font-medium ${selected.textAlign === align ? "border-[#D68C2D] bg-[#D68C2D]/10 text-[#D68C2D]" : "border-[#E5E7EB] text-[#6B7280]"}`}>{align}</button>
                        ))}
                      </div>
                    </div>
                  )}

                  {selected.type === "image" && (
                    <div className="space-y-3 rounded-xl border border-[#E5E7EB] bg-[#FAFAFA] p-4">
                      <Button type="button" size="sm" variant="outline" className="w-full rounded-lg" onClick={() => replaceImageInputRef.current?.click()}>Remplacer l'image</Button>
                      <input ref={replaceImageInputRef} type="file" accept="image/png,image/jpeg,image/svg+xml" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) handleImageFile(f, selected.id); e.target.value = ""; }} />
                    </div>
                  )}

                  {(selected.type === "rect" || selected.type === "ellipse" || selected.type === "line") && (
                    <div className="space-y-3 rounded-xl border border-[#E5E7EB] bg-[#FAFAFA] p-4">
                      {selected.type !== "line" && (
                        <div><Label className="text-xs text-[#6B7280]">Remplissage</Label><Input type="color" value={(selected.fill || "#D68C2D").slice(0, 7)} onChange={(e) => updateObject(selected.id, { fill: e.target.value })} className="mt-1 h-9 rounded-lg border-[#E5E7EB]" /></div>
                      )}
                      <div><Label className="text-xs text-[#6B7280]">Bordure</Label><Input type="color" value={selected.stroke} onChange={(e) => updateObject(selected.id, { stroke: e.target.value })} className="mt-1 h-9 rounded-lg border-[#E5E7EB]" /></div>
                      <div><Label className="text-xs text-[#6B7280]">Épaisseur</Label><Input type="number" value={selected.strokeWidth} onChange={(e) => updateObject(selected.id, { strokeWidth: parseInt(e.target.value) || 1 })} className="mt-1 h-9 rounded-lg border-[#E5E7EB]" /></div>
                    </div>
                  )}

                  {selected.type === "qr" && (
                    <p className="rounded-xl border border-[#E5E7EB] bg-[#FAFAFA] p-4 text-xs text-[#6B7280]">Un QR Code unique sera généré automatiquement pour chaque certificat lors du lancement de la campagne, permettant la vérification et/ou la récupération.</p>
                  )}
                </div>
              ) : (
                <div className="flex h-full flex-col items-center justify-center gap-2 text-center text-sm text-[#6B7280]">
                  <Settings2 className="size-8 text-[#E5E7EB]" />
                  Sélectionnez un élément sur le certificat pour modifier ses propriétés.
                </div>
              )
            )}

            {activeTab === "layers" && (
              <div className="space-y-1.5">
                {sortedForLayers.length === 0 && <p className="text-center text-sm text-[#6B7280] py-8">Aucun calque. Ajoutez un élément depuis la barre d'outils.</p>}
                {sortedForLayers.map((obj) => (
                  <div key={obj.id} onClick={() => setSelectedId(obj.id)} className={`flex items-center gap-2 rounded-lg border p-2 cursor-pointer transition-colors ${selectedId === obj.id ? "border-[#D68C2D] bg-[#D68C2D]/5" : "border-[#E5E7EB] hover:bg-[#FAFAFA]"}`}>
                    <span className="flex-1 truncate text-sm text-[#1E1E1E]">{obj.name}</span>
                    <button type="button" onClick={(e) => { e.stopPropagation(); bringForward(obj.id); }} className="text-[#6B7280] hover:text-[#D68C2D]"><ChevronUp className="size-4" /></button>
                    <button type="button" onClick={(e) => { e.stopPropagation(); sendBackward(obj.id); }} className="text-[#6B7280] hover:text-[#D68C2D]"><ChevronDown className="size-4" /></button>
                    <button type="button" onClick={(e) => { e.stopPropagation(); updateObject(obj.id, { visible: !obj.visible }); }} className="text-[#6B7280] hover:text-[#D68C2D]">{obj.visible ? <Eye className="size-4" /> : <EyeOff className="size-4" />}</button>
                    <button type="button" onClick={(e) => { e.stopPropagation(); updateObject(obj.id, { locked: !obj.locked }); }} className="text-[#6B7280] hover:text-[#D68C2D]">{obj.locked ? <Lock className="size-4" /> : <Unlock className="size-4" />}</button>
                    <button type="button" onClick={(e) => { e.stopPropagation(); removeObject(obj.id); }} className="text-red-400 hover:text-red-600"><Trash2 className="size-4" /></button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function RailButton({
  icon: Icon,
  label,
  onClick,
  active = false,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  onClick: () => void;
  active?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex w-[74px] flex-col items-center gap-1 rounded-xl py-2.5 text-[11px] font-medium transition-colors ${
        active ? "bg-[#D68C2D]/10 text-[#D68C2D]" : "text-[#6B7280] hover:bg-[#D68C2D]/10 hover:text-[#D68C2D]"
      }`}
    >
      <Icon className="size-5" />
      {label}
    </button>
  );
}
