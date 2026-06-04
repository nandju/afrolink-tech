"use client"

import { useRef, useState, useEffect } from "react"
import { Move } from "lucide-react"

interface TextField {
  id: string
  name: string
  x: number
  y: number
  fontSize: number
  color: string
  fontFamily?: string
  fontWeight?: string
}

interface InteractivePdfPreviewProps {
  pdfUrl: string | null
  textFields: TextField[]
  selectedFieldId: string | null
  onFieldMove: (fieldId: string, x: number, y: number) => void
  onFieldSelect: (fieldId: string) => void
  className?: string
}

export function InteractivePdfPreview({
  pdfUrl,
  textFields,
  selectedFieldId,
  onFieldMove,
  onFieldSelect,
  className = "",
}: InteractivePdfPreviewProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [dragFieldId, setDragFieldId] = useState<string | null>(null)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 })

  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect()
        setContainerSize({ width: rect.width, height: rect.height })
      }
    }

    updateSize()
    window.addEventListener("resize", updateSize)
    return () => window.removeEventListener("resize", updateSize)
  }, [])

  const handleMouseDown = (e: React.MouseEvent, fieldId: string) => {
    e.preventDefault()
    e.stopPropagation()
    
    const field = textFields.find(f => f.id === fieldId)
    if (!field) return

    setIsDragging(true)
    setDragFieldId(fieldId)
    onFieldSelect(fieldId)

    const rect = containerRef.current?.getBoundingClientRect()
    if (rect) {
      const clickX = e.clientX - rect.left
      const clickY = e.clientY - rect.top
      setDragOffset({
        x: clickX - field.x,
        y: clickY - field.y,
      })
    }
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !dragFieldId || !containerRef.current) return

    const rect = containerRef.current.getBoundingClientRect()
    const x = Math.max(0, Math.min(e.clientX - rect.left - dragOffset.x, rect.width - 50))
    const y = Math.max(0, Math.min(e.clientY - rect.top - dragOffset.y, rect.height - 30))

    onFieldMove(dragFieldId, Math.round(x), Math.round(y))
  }

  const handleMouseUp = () => {
    setIsDragging(false)
    setDragFieldId(null)
  }

  useEffect(() => {
    if (isDragging) {
      const handleGlobalMouseUp = () => {
        setIsDragging(false)
        setDragFieldId(null)
      }
      window.addEventListener("mouseup", handleGlobalMouseUp)
      return () => window.removeEventListener("mouseup", handleGlobalMouseUp)
    }
  }, [isDragging])

  if (!pdfUrl) {
    return (
      <div className={`flex h-[700px] items-center justify-center rounded-2xl border border-[#E5E7EB] bg-[#FAFAFA] text-[#6B7280] ${className}`}>
        Aucun PDF chargé
      </div>
    )
  }

  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden rounded-2xl border border-[#E5E7EB] bg-white shadow-sm ${className}`}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      style={{ cursor: isDragging ? "grabbing" : "default" }}
    >
      {/* PDF iframe */}
      <iframe
        ref={iframeRef}
        src={pdfUrl}
        className="h-[700px] w-full rounded-xl pointer-events-none"
        title="PDF Preview"
      />

      {/* Draggable field markers */}
      <div className="absolute inset-0 pointer-events-none">
        {textFields.map((field) => {
          const isSelected = field.id === selectedFieldId
          const isDraggingThis = isDragging && dragFieldId === field.id

          return (
            <div
              key={field.id}
              className="pointer-events-auto absolute transition-opacity"
              style={{
                left: `${field.x}px`,
                top: `${field.y}px`,
                opacity: isDraggingThis ? 0.8 : 1,
              }}
              onMouseDown={(e) => handleMouseDown(e, field.id)}
            >
              {/* Field marker */}
              <div
                className={`group flex items-center gap-2 rounded-lg border-2 px-3 py-1.5 shadow-lg transition-all ${
                  isSelected
                    ? "border-[#D68C2D] bg-[#D68C2D] text-white"
                    : "border-[#12A2AC] bg-white text-[#1E1E1E] hover:border-[#D68C2D] hover:bg-[#D68C2D]/10"
                }`}
                style={{ cursor: isDraggingThis ? "grabbing" : "grab" }}
              >
                <Move className={`h-4 w-4 ${isSelected ? "text-white" : "text-[#12A2AC]"}`} />
                <span
                  className="font-semibold whitespace-nowrap"
                  style={{
                    fontFamily: field.fontFamily || "Montserrat",
                    fontSize: `${field.fontSize || 24}px`,
                    color: field.color || "#000000",
                    fontWeight: field.fontWeight === "Bold" ? 700 : field.fontWeight === "SemiBold" ? 600 : 400,
                  }}
                >
                  KOUADIO JEAN-MARC
                </span>
              </div>

              {/* Position indicator */}
              {isSelected && (
                <div className="absolute -bottom-8 left-0 rounded-md bg-[#1E1E1E] px-2 py-1 text-xs text-white shadow-md">
                  X: {field.x} • Y: {field.y}
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Drag instruction overlay */}
      {textFields.length > 0 && !isDragging && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full border border-[#E5E7EB] bg-white/95 px-4 py-2 text-xs font-medium text-[#6B7280] shadow-lg backdrop-blur-sm">
          💡 Cliquez et glissez les champs pour les positionner
        </div>
      )}
    </div>
  )
}
