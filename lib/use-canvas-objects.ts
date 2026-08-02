"use client";

import { useState, useCallback, useRef } from "react";
import type { CanvasObject, CanvasObjectType } from "@/components/ui/certificate-canvas-editor";
import { CANVAS_WIDTH, CANVAS_HEIGHT } from "@/components/ui/certificate-canvas-editor";
import type { FontFamily, FontWeight } from "@/lib/fonts";

let idCounter = 0;
const nextId = (prefix: string) => `${prefix}-${Date.now()}-${idCounter++}`;

export interface CanvasObjectsApi {
  objects: CanvasObject[];
  setObjects: (objects: CanvasObject[]) => void;
  selectedId: string | null;
  setSelectedId: (id: string | null) => void;
  selected: CanvasObject | null;
  addObject: (type: CanvasObjectType, availableDataKeys?: string[]) => CanvasObject;
  updateObject: (id: string, updates: Partial<CanvasObject>) => void;
  removeObject: (id: string) => void;
  duplicateObject: (id: string) => void;
  bringForward: (id: string) => void;
  sendBackward: (id: string) => void;
  toggleVisible: (id: string) => void;
  toggleLock: (id: string) => void;
  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;
}

export function useCanvasObjects(initialObjects: CanvasObject[]): CanvasObjectsApi {
  const [objects, setObjectsState] = useState<CanvasObject[]>(initialObjects);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  // Undo/redo history
  const historyRef = useRef<CanvasObject[][]>([initialObjects]);
  const historyIndexRef = useRef(0);
  const [historyVersion, setHistoryVersion] = useState(0);

  const setObjects = useCallback((next: CanvasObject[]) => {
    setObjectsState(next);
    // Push to history (truncate any redo entries)
    const newHistory = historyRef.current.slice(0, historyIndexRef.current + 1);
    newHistory.push(next);
    // Cap history at 50 entries
    if (newHistory.length > 50) newHistory.shift();
    historyRef.current = newHistory;
    historyIndexRef.current = newHistory.length - 1;
    setHistoryVersion((v) => v + 1);
  }, []);

  const updateObject = useCallback((id: string, updates: Partial<CanvasObject>) => {
    setObjectsState((prev) => {
      const next = prev.map((o) => (o.id === id ? { ...o, ...updates } : o));
      // Push to history
      const newHistory = historyRef.current.slice(0, historyIndexRef.current + 1);
      newHistory.push(next);
      if (newHistory.length > 50) newHistory.shift();
      historyRef.current = newHistory;
      historyIndexRef.current = newHistory.length - 1;
      setHistoryVersion((v) => v + 1);
      return next;
    });
  }, []);

  const addObject = useCallback((type: CanvasObjectType, availableDataKeys?: string[]): CanvasObject => {
    const maxZ = Math.max(0, ...objects.map((o) => o.zIndex));
    const centerX = CANVAS_WIDTH / 2;
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
          y: 250,
          width: 200,
          height: 42,
          dataKey: availableDataKeys?.[0] || "",
          fallbackText: "Texte exemple",
          fontSize: 28,
          color: "#1E1E1E",
          fontFamily: "Montserrat" as FontFamily,
          fontWeight: "Bold" as FontWeight,
          textAlign: "left",
        };
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
        obj = { ...base, type: "text", name: "Objet", x: 0, y: 0, width: 100, height: 40 };
    }
    setObjects([...objects, obj]);
    setSelectedId(obj.id);
    return obj;
  }, [objects, setObjects]);

  const removeObject = useCallback((id: string) => {
    setObjects(objects.filter((o) => o.id !== id));
    if (selectedId === id) setSelectedId(null);
  }, [objects, selectedId, setObjects]);

  const duplicateObject = useCallback((id: string) => {
    const obj = objects.find((o) => o.id === id);
    if (!obj) return;
    const maxZ = Math.max(0, ...objects.map((o) => o.zIndex));
    const clone: CanvasObject = {
      ...obj,
      id: nextId(obj.type),
      x: obj.x + 20,
      y: obj.y + 20,
      zIndex: maxZ + 1,
      name: `${obj.name} (copie)`,
    };
    setObjects([...objects, clone]);
    setSelectedId(clone.id);
  }, [objects, setObjects]);

  const bringForward = useCallback((id: string) => {
    const sorted = [...objects].sort((a, b) => a.zIndex - b.zIndex);
    const idx = sorted.findIndex((o) => o.id === id);
    if (idx < sorted.length - 1) {
      const a = sorted[idx];
      const b = sorted[idx + 1];
      const next = objects.map((o) => {
        if (o.id === a.id) return { ...o, zIndex: b.zIndex };
        if (o.id === b.id) return { ...o, zIndex: a.zIndex };
        return o;
      });
      setObjects(next);
    }
  }, [objects, setObjects]);

  const sendBackward = useCallback((id: string) => {
    const sorted = [...objects].sort((a, b) => a.zIndex - b.zIndex);
    const idx = sorted.findIndex((o) => o.id === id);
    if (idx > 0) {
      const a = sorted[idx];
      const b = sorted[idx - 1];
      const next = objects.map((o) => {
        if (o.id === a.id) return { ...o, zIndex: b.zIndex };
        if (o.id === b.id) return { ...o, zIndex: a.zIndex };
        return o;
      });
      setObjects(next);
    }
  }, [objects, setObjects]);

  const toggleVisible = useCallback((id: string) => {
    const obj = objects.find((o) => o.id === id);
    if (obj) updateObject(id, { visible: !obj.visible });
  }, [objects, updateObject]);

  const toggleLock = useCallback((id: string) => {
    const obj = objects.find((o) => o.id === id);
    if (obj) updateObject(id, { locked: !obj.locked });
  }, [objects, updateObject]);

  const undo = useCallback(() => {
    if (historyIndexRef.current > 0) {
      historyIndexRef.current--;
      setObjectsState(historyRef.current[historyIndexRef.current]);
      setHistoryVersion((v) => v + 1);
    }
  }, []);

  const redo = useCallback(() => {
    if (historyIndexRef.current < historyRef.current.length - 1) {
      historyIndexRef.current++;
      setObjectsState(historyRef.current[historyIndexRef.current]);
      setHistoryVersion((v) => v + 1);
    }
  }, []);

  const selected = objects.find((o) => o.id === selectedId) || null;

  return {
    objects,
    setObjects,
    selectedId,
    setSelectedId,
    selected,
    addObject,
    updateObject,
    removeObject,
    duplicateObject,
    bringForward,
    sendBackward,
    toggleVisible,
    toggleLock,
    undo,
    redo,
    canUndo: historyIndexRef.current > 0,
    canRedo: historyIndexRef.current < historyRef.current.length - 1,
  };
}
