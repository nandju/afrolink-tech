"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import { Stage, Layer, Rect, Text, Image as KonvaImage, Ellipse, Line as KonvaLine, Group, Transformer } from "react-konva";
import type Konva from "konva";
import useImage from "use-image";
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

export const SNAP_THRESHOLD = 6;
export const CANVAS_WIDTH = 842;
export const CANVAS_HEIGHT = 595;

let idCounter = 0;
const nextId = (prefix: string) => `${prefix}-${Date.now()}-${idCounter++}`;

// ---- Background image component ----

function BackgroundImage({ url }: { url: string }) {
  const [img] = useImage(url, "anonymous");
  if (!img) return null;
  // Compute object-cover crop
  const imgRatio = img.width / img.height;
  const canvasRatio = CANVAS_WIDTH / CANVAS_HEIGHT;
  let drawW: number, drawH: number, drawX: number, drawY: number;
  if (imgRatio > canvasRatio) {
    drawH = CANVAS_HEIGHT;
    drawW = CANVAS_HEIGHT * imgRatio;
    drawX = (CANVAS_WIDTH - drawW) / 2;
    drawY = 0;
  } else {
    drawW = CANVAS_WIDTH;
    drawH = CANVAS_WIDTH / imgRatio;
    drawX = 0;
    drawY = (CANVAS_HEIGHT - drawH) / 2;
  }
  return <KonvaImage image={img} x={drawX} y={drawY} width={drawW} height={drawH} listening={false} />;
}

// ---- Main component ----

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
  const stageRef = useRef<Konva.Stage>(null);
  const transformerRef = useRef<Konva.Transformer>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const replaceImageInputRef = useRef<HTMLInputElement>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"properties" | "layers">("properties");
  const [guides, setGuides] = useState<{ v: number | null; h: number | null }>({ v: null, h: null });
  const [stageScale, setStageScale] = useState(1);
  const [stagePos, setStagePos] = useState({ x: 0, y: 0 });

  // Compute scale to fit canvas in container
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const updateScale = () => {
      const availW = container.clientWidth - 64; // padding
      const availH = container.clientHeight - 64;
      const scaleX = availW / CANVAS_WIDTH;
      const scaleY = availH / CANVAS_HEIGHT;
      const scale = Math.min(scaleX, scaleY, 1);
      setStageScale(scale);
      // Center the stage
      setStagePos({
        x: (container.clientWidth - CANVAS_WIDTH * scale) / 2,
        y: (container.clientHeight - CANVAS_HEIGHT * scale) / 2,
      });
    };
    updateScale();
    const ro = new ResizeObserver(updateScale);
    ro.observe(container);
    return () => ro.disconnect();
  }, []);

  const selected = objects.find((o) => o.id === selectedId) || null;

  const updateObject = useCallback((id: string, updates: Partial<CanvasObject>) => {
    onObjectsChange(objects.map((o) => (o.id === id ? { ...o, ...updates } : o)));
  }, [objects, onObjectsChange]);

  const removeObject = useCallback((id: string) => {
    onObjectsChange(objects.filter((o) => o.id !== id));
    if (selectedId === id) setSelectedId(null);
  }, [objects, onObjectsChange, selectedId]);

  const duplicateObject = useCallback((id: string) => {
    const obj = objects.find((o) => o.id === id);
    if (!obj) return;
    const maxZ = Math.max(0, ...objects.map((o) => o.zIndex));
    const clone: CanvasObject = { ...obj, id: nextId(obj.type), x: obj.x + 20, y: obj.y + 20, zIndex: maxZ + 1, name: `${obj.name} (copie)` };
    onObjectsChange([...objects, clone]);
    setSelectedId(clone.id);
  }, [objects, onObjectsChange]);

  const bringForward = useCallback((id: string) => {
    const sorted = [...objects].sort((a, b) => a.zIndex - b.zIndex);
    const idx = sorted.findIndex((o) => o.id === id);
    if (idx < sorted.length - 1) {
      const a = sorted[idx];
      const b = sorted[idx + 1];
      onObjectsChange(objects.map((o) => o.id === a.id ? { ...o, zIndex: b.zIndex } : o.id === b.id ? { ...o, zIndex: a.zIndex } : o));
    }
  }, [objects, onObjectsChange]);

  const sendBackward = useCallback((id: string) => {
    const sorted = [...objects].sort((a, b) => a.zIndex - b.zIndex);
    const idx = sorted.findIndex((o) => o.id === id);
    if (idx > 0) {
      const a = sorted[idx];
      const b = sorted[idx - 1];
      onObjectsChange(objects.map((o) => o.id === a.id ? { ...o, zIndex: b.zIndex } : o.id === b.id ? { ...o, zIndex: a.zIndex } : o));
    }
  }, [objects, onObjectsChange]);

  const addObject = useCallback((type: CanvasObjectType) => {
    const maxZ = Math.max(0, ...objects.map((o) => o.zIndex));
    const centerX = CANVAS_WIDTH / 2;
    const base = { id: nextId(type), zIndex: maxZ + 1, opacity: 1, rotation: 0, visible: true, locked: false };
    let obj: CanvasObject;
    switch (type) {
      case "text":
        obj = { ...base, type: "text", name: "Nouveau texte", x: Math.max(0, centerX - 80), y: 250, width: 200, height: 42, dataKey: availableDataKeys[0] || "", fallbackText: "Texte exemple", fontSize: 28, color: "#1E1E1E", fontFamily: "Montserrat", fontWeight: "Bold", textAlign: "left" };
        break;
      case "image":
        obj = { ...base, type: "image", name: "Image", x: centerX - 60, y: 250, width: 120, height: 120, src: undefined };
        break;
      case "rect":
        obj = { ...base, type: "rect", name: "Rectangle", x: centerX - 75, y: 250, width: 150, height: 80, fill: "#D68C2D33", stroke: "#D68C2D", strokeWidth: 2 };
        break;
      case "ellipse":
        obj = { ...base, type: "ellipse", name: "Ellipse", x: centerX - 60, y: 250, width: 120, height: 120, fill: "#12A2AC33", stroke: "#12A2AC", strokeWidth: 2 };
        break;
      case "line":
        obj = { ...base, type: "line", name: "Ligne", x: centerX - 75, y: 250, width: 150, height: 2, stroke: "#1E1E1E", strokeWidth: 2, fill: "transparent" };
        break;
      case "qr":
        obj = { ...base, type: "qr", name: "QR Code", x: centerX - 50, y: 250, width: 100, height: 100 };
        break;
      default:
        return;
    }
    onObjectsChange([...objects, obj]);
    setSelectedId(obj.id);
    setActiveTab("properties");
  }, [objects, onObjectsChange, availableDataKeys]);

  const handleImageFile = (file: File, targetId?: string) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const src = e.target?.result as string;
      if (targetId) {
        updateObject(targetId, { src });
      } else {
        const maxZ = Math.max(0, ...objects.map((o) => o.zIndex));
        const obj: CanvasObject = { id: nextId("image"), type: "image", name: "Image", x: 150, y: 250, width: 140, height: 140, rotation: 0, opacity: 1, zIndex: maxZ + 1, visible: true, locked: false, src };
        onObjectsChange([...objects, obj]);
        setSelectedId(obj.id);
      }
    };
    reader.readAsDataURL(file);
  };

  // ---- Snapping logic ----
  const computeSnappedPosition = useCallback(
    (node: Konva.Node, obj: CanvasObject): { x: number; y: number; vLine: number | null; hLine: number | null } => {
      const x = node.x();
      const y = node.y();
      const w = obj.width;
      const h = obj.height;
      let snappedX = x;
      let snappedY = y;
      let vLine: number | null = null;
      let hLine: number | null = null;

      const vTargets: number[] = [0, CANVAS_WIDTH / 2, CANVAS_WIDTH];
      const hTargets: number[] = [0, CANVAS_HEIGHT / 2, CANVAS_HEIGHT];
      objects
        .filter((o) => o.id !== obj.id && o.visible)
        .forEach((o) => {
          vTargets.push(o.x, o.x + o.width / 2, o.x + o.width);
          hTargets.push(o.y, o.y + o.height / 2, o.y + o.height);
        });

      const candLeft = x;
      const candRight = x + w;
      const candCenterX = x + w / 2;
      for (const t of vTargets) {
        if (Math.abs(candCenterX - t) < SNAP_THRESHOLD) { snappedX = t - w / 2; vLine = t; break; }
        if (Math.abs(candLeft - t) < SNAP_THRESHOLD) { snappedX = t; vLine = t; break; }
        if (Math.abs(candRight - t) < SNAP_THRESHOLD) { snappedX = t - w; vLine = t; break; }
      }

      const candTop = y;
      const candBottom = y + h;
      const candCenterY = y + h / 2;
      for (const t of hTargets) {
        if (Math.abs(candCenterY - t) < SNAP_THRESHOLD) { snappedY = t - h / 2; hLine = t; break; }
        if (Math.abs(candTop - t) < SNAP_THRESHOLD) { snappedY = t; hLine = t; break; }
        if (Math.abs(candBottom - t) < SNAP_THRESHOLD) { snappedY = t - h; hLine = t; break; }
      }

      return { x: Math.round(snappedX), y: Math.round(snappedY), vLine, hLine };
    },
    [objects]
  );

  const handleDragMove = useCallback((e: Konva.KonvaEventObject<DragEvent>, obj: CanvasObject) => {
    const node = e.target;
    const snapped = computeSnappedPosition(node, obj);
    node.x(snapped.x);
    node.y(snapped.y);
    setGuides({ v: snapped.vLine, h: snapped.hLine });
  }, [computeSnappedPosition]);

  const handleDragEnd = useCallback((obj: CanvasObject, e: Konva.KonvaEventObject<DragEvent>) => {
    setGuides({ v: null, h: null });
    updateObject(obj.id, { x: Math.round(e.target.x()), y: Math.round(e.target.y()) });
  }, [updateObject]);

  // Attach transformer to selected node
  useEffect(() => {
    const transformer = transformerRef.current;
    const stage = stageRef.current;
    if (!transformer || !stage) return;
    if (selectedId) {
      const node = stage.findOne(`#${selectedId}`);
      if (node) {
        transformer.nodes([node]);
        transformer.getLayer()?.batchDraw();
      }
    } else {
      transformer.nodes([]);
      transformer.getLayer()?.batchDraw();
    }
  }, [selectedId, objects]);

  // Keyboard shortcuts
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
  }, [selectedId, removeObject]);

  const sortedForRender = [...objects].sort((a, b) => a.zIndex - b.zIndex);
  const sortedForLayers = [...objects].sort((a, b) => b.zIndex - a.zIndex);

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
        {/* Left icon rail */}
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

        {/* Canvas workspace — Konva Stage */}
        <div ref={containerRef} className="relative flex flex-1 flex-col overflow-hidden bg-[#EFEFEA]">
          {/* PDF background overlay (DOM iframe, since Konva can't render PDFs) */}
          {pdfUrl && (
            <iframe
              src={pdfUrl}
              className="pointer-events-none absolute rounded-2xl shadow-2xl ring-1 ring-black/5"
              style={{
                width: CANVAS_WIDTH,
                height: CANVAS_HEIGHT,
                transform: `translate(${stagePos.x}px, ${stagePos.y}px) scale(${stageScale})`,
                transformOrigin: "top left",
              }}
              title="PDF Preview"
            />
          )}
          <Stage
            ref={stageRef}
            width={CANVAS_WIDTH}
            height={CANVAS_HEIGHT}
            scaleX={stageScale}
            scaleY={stageScale}
            x={stagePos.x}
            y={stagePos.y}
            onMouseDown={(e) => {
              if (e.target === e.target.getStage()) setSelectedId(null);
            }}
            style={{ width: "100%", height: "100%" }}
          >
            {/* Background layer */}
            <Layer listening={false}>
              {!pdfUrl && <Rect x={0} y={0} width={CANVAS_WIDTH} height={CANVAS_HEIGHT} fill="white" />}
              {backgroundImageUrl && <BackgroundImage url={backgroundImageUrl} />}
            </Layer>

            {/* Objects layer */}
            <Layer>
              {sortedForRender.map((obj) => {
                if (!obj.visible) return null;
                const isSelected = obj.id === selectedId;
                const onSelect = () => setSelectedId(obj.id);
                const onChange = (updates: Partial<CanvasObject>) => updateObject(obj.id, updates);
                const onDragMove = (e: Konva.KonvaEventObject<DragEvent>) => handleDragMove(e, obj);
                const onDragEndCb = (e: Konva.KonvaEventObject<DragEvent>) => handleDragEnd(obj, e);

                if (obj.type === "text") {
                  const content = (obj.dataKey && previewRecord && previewRecord[obj.dataKey]) || obj.fallbackText || obj.name;
                  const fontStyle = obj.fontWeight === "Bold" ? "bold" : obj.fontWeight === "SemiBold" ? "600" : "normal";
                  return (
                    <Text
                      key={obj.id}
                      id={obj.id}
                      x={obj.x}
                      y={obj.y}
                      width={obj.width}
                      height={obj.height}
                      text={content}
                      fontSize={obj.fontSize || 24}
                      fontFamily={obj.fontFamily || "Montserrat"}
                      fontStyle={fontStyle}
                      fill={obj.color || "#000000"}
                      align={obj.textAlign || "left"}
                      verticalAlign="middle"
                      rotation={obj.rotation}
                      opacity={obj.opacity}
                      draggable={!obj.locked}
                      onClick={onSelect}
                      onTap={onSelect}
                      onDragMove={onDragMove}
                      onDragEnd={onDragEndCb}
                      onTransformEnd={() => {
                        const node = stageRef.current?.findOne(`#${obj.id}`) as Konva.Text | undefined;
                        if (!node) return;
                        const scaleX = node.scaleX();
                        onChange({
                          x: Math.round(node.x()),
                          y: Math.round(node.y()),
                          width: Math.max(20, Math.round(node.width() * scaleX)),
                          rotation: Math.round(node.rotation()),
                          fontSize: Math.max(8, Math.round((obj.fontSize || 24) * scaleX)),
                        });
                        node.scaleX(1);
                      }}
                    />
                  );
                }
                if (obj.type === "image" && obj.src) {
                  return (
                    <KonvaImageShape
                      key={obj.id}
                      obj={obj}
                      onSelect={onSelect}
                      onChange={onChange}
                      onDragMove={onDragMove}
                      onDragEnd={onDragEndCb}
                      stageRef={stageRef}
                    />
                  );
                }
                if (obj.type === "rect") {
                  return (
                    <Rect
                      key={obj.id}
                      id={obj.id}
                      x={obj.x}
                      y={obj.y}
                      width={obj.width}
                      height={obj.height}
                      fill={obj.fill || undefined}
                      stroke={obj.stroke || undefined}
                      strokeWidth={obj.strokeWidth || 0}
                      rotation={obj.rotation}
                      opacity={obj.opacity}
                      draggable={!obj.locked}
                      onClick={onSelect}
                      onTap={onSelect}
                      onDragMove={onDragMove}
                      onDragEnd={onDragEndCb}
                      onTransformEnd={() => {
                        const node = stageRef.current?.findOne(`#${obj.id}`) as Konva.Rect | undefined;
                        if (!node) return;
                        const sx = node.scaleX();
                        const sy = node.scaleY();
                        onChange({
                          x: Math.round(node.x()),
                          y: Math.round(node.y()),
                          width: Math.max(10, Math.round(node.width() * sx)),
                          height: Math.max(10, Math.round(node.height() * sy)),
                          rotation: Math.round(node.rotation()),
                        });
                        node.scaleX(1);
                        node.scaleY(1);
                      }}
                    />
                  );
                }
                if (obj.type === "ellipse") {
                  return (
                    <Ellipse
                      key={obj.id}
                      id={obj.id}
                      x={obj.x + obj.width / 2}
                      y={obj.y + obj.height / 2}
                      radiusX={obj.width / 2}
                      radiusY={obj.height / 2}
                      fill={obj.fill || undefined}
                      stroke={obj.stroke || undefined}
                      strokeWidth={obj.strokeWidth || 0}
                      rotation={obj.rotation}
                      opacity={obj.opacity}
                      draggable={!obj.locked}
                      onClick={onSelect}
                      onTap={onSelect}
                      onDragMove={onDragMove}
                      onDragEnd={(e) => {
                        setGuides({ v: null, h: null });
                        const x = e.target.x();
                        const y = e.target.y();
                        onChange({ x: Math.round(x - obj.width / 2), y: Math.round(y - obj.height / 2) });
                      }}
                      onTransformEnd={() => {
                        const node = stageRef.current?.findOne(`#${obj.id}`) as Konva.Ellipse | undefined;
                        if (!node) return;
                        const sx = node.scaleX();
                        const sy = node.scaleY();
                        const newW = Math.max(10, Math.round(obj.width * sx));
                        const newH = Math.max(10, Math.round(obj.height * sy));
                        onChange({
                          x: Math.round(node.x() - newW / 2),
                          y: Math.round(node.y() - newH / 2),
                          width: newW,
                          height: newH,
                          rotation: Math.round(node.rotation()),
                        });
                        node.scaleX(1);
                        node.scaleY(1);
                      }}
                    />
                  );
                }
                if (obj.type === "line") {
                  return (
                    <KonvaLine
                      key={obj.id}
                      id={obj.id}
                      points={[obj.x, obj.y, obj.x + obj.width, obj.y]}
                      stroke={obj.stroke || "#1E1E1E"}
                      strokeWidth={obj.strokeWidth || 2}
                      rotation={obj.rotation}
                      opacity={obj.opacity}
                      draggable={!obj.locked}
                      onClick={onSelect}
                      onTap={onSelect}
                      onDragMove={onDragMove}
                      onDragEnd={onDragEndCb}
                      onTransformEnd={() => {
                        const node = stageRef.current?.findOne(`#${obj.id}`) as Konva.Line | undefined;
                        if (!node) return;
                        onChange({ x: Math.round(node.x()), y: Math.round(node.y()), rotation: Math.round(node.rotation()) });
                      }}
                    />
                  );
                }
                if (obj.type === "qr") {
                  return (
                    <Group
                      key={obj.id}
                      id={obj.id}
                      x={obj.x}
                      y={obj.y}
                      rotation={obj.rotation}
                      opacity={obj.opacity}
                      draggable={!obj.locked}
                      onClick={onSelect}
                      onTap={onSelect}
                      onDragMove={onDragMove}
                      onDragEnd={onDragEndCb}
                      onTransformEnd={() => {
                        const node = stageRef.current?.findOne(`#${obj.id}`) as Konva.Group | undefined;
                        if (!node) return;
                        const sx = node.scaleX();
                        const sy = node.scaleY();
                        onChange({
                          x: Math.round(node.x()),
                          y: Math.round(node.y()),
                          width: Math.max(20, Math.round(obj.width * sx)),
                          height: Math.max(20, Math.round(obj.height * sy)),
                          rotation: Math.round(node.rotation()),
                        });
                        node.scaleX(1);
                        node.scaleY(1);
                      }}
                    >
                      <Rect width={obj.width} height={obj.height} fill="white" stroke="#1E1E1E" strokeWidth={2} dash={[4, 4]} />
                      <Text text="QR" width={obj.width} height={obj.height} align="center" verticalAlign="middle" fontSize={Math.min(obj.width, obj.height) / 3} fontFamily="Montserrat" fill="#1E1E1E" />
                    </Group>
                  );
                }
                return null;
              })}

              {/* Snap guides */}
              {guides.v !== null && (
                <KonvaLine points={[guides.v, 0, guides.v, CANVAS_HEIGHT]} stroke="#12A2AC" strokeWidth={1 / stageScale} listening={false} />
              )}
              {guides.h !== null && (
                <KonvaLine points={[0, guides.h, CANVAS_WIDTH, guides.h]} stroke="#12A2AC" strokeWidth={1 / stageScale} listening={false} />
              )}

              {/* Transformer */}
              <Transformer
                ref={transformerRef}
                rotateEnabled={true}
                enabledAnchors={["top-left", "top-right", "bottom-left", "bottom-right"]}
                borderStroke="#D68C2D"
                anchorStroke="#D68C2D"
                anchorFill="white"
                anchorSize={8}
                rotateAnchorOffset={24}
                boundBoxFunc={(oldBox, newBox) => {
                  if (newBox.width < 10 || newBox.height < 10) return oldBox;
                  return newBox;
                }}
              />
            </Layer>
          </Stage>
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

// Helper component for Konva images (needs use-image hook)
function KonvaImageShape({ obj, onSelect, onChange, onDragMove, onDragEnd, stageRef }: {
  obj: CanvasObject;
  onSelect: () => void;
  onChange: (updates: Partial<CanvasObject>) => void;
  onDragMove: (e: Konva.KonvaEventObject<DragEvent>) => void;
  onDragEnd: (e: Konva.KonvaEventObject<DragEvent>) => void;
  stageRef: React.RefObject<Konva.Stage | null>;
}) {
  const imgRef = useRef<Konva.Image>(null);
  const [img] = useImage(obj.src || "", "anonymous");
  return (
    <KonvaImage
      ref={imgRef}
      id={obj.id}
      x={obj.x}
      y={obj.y}
      width={obj.width}
      height={obj.height}
      image={img}
      rotation={obj.rotation}
      opacity={obj.opacity}
      draggable={!obj.locked}
      onClick={onSelect}
      onTap={onSelect}
      onDragMove={onDragMove}
      onDragEnd={onDragEnd}
      onTransformEnd={() => {
        const node = stageRef.current?.findOne(`#${obj.id}`) as Konva.Image | undefined;
        if (!node) return;
        const sx = node.scaleX();
        const sy = node.scaleY();
        onChange({
          x: Math.round(node.x()),
          y: Math.round(node.y()),
          width: Math.max(20, Math.round(node.width() * sx)),
          height: Math.max(20, Math.round(node.height() * sy)),
          rotation: Math.round(node.rotation()),
        });
        node.scaleX(1);
        node.scaleY(1);
      }}
    />
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
