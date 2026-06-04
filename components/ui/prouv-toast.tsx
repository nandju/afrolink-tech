"use client"

import { CheckCircle2, XCircle, AlertCircle, Info, X } from "lucide-react"
import { useEffect, useState } from "react"

export type ToastType = "success" | "error" | "warning" | "info"

interface ToastProps {
  id: string
  type: ToastType
  title: string
  message?: string
  duration?: number
  onClose: (id: string) => void
}

const toastConfig = {
  success: {
    icon: CheckCircle2,
    bgColor: "bg-white",
    borderColor: "border-[#10B981]",
    iconColor: "text-[#10B981]",
    iconBg: "bg-[#10B981]/10",
  },
  error: {
    icon: XCircle,
    bgColor: "bg-white",
    borderColor: "border-[#EF4444]",
    iconColor: "text-[#EF4444]",
    iconBg: "bg-[#EF4444]/10",
  },
  warning: {
    icon: AlertCircle,
    bgColor: "bg-white",
    borderColor: "border-[#F59E0B]",
    iconColor: "text-[#F59E0B]",
    iconBg: "bg-[#F59E0B]/10",
  },
  info: {
    icon: Info,
    bgColor: "bg-white",
    borderColor: "border-[#12A2AC]",
    iconColor: "text-[#12A2AC]",
    iconBg: "bg-[#12A2AC]/10",
  },
}

export function ProuvToast({ id, type, title, message, duration = 4000, onClose }: ToastProps) {
  const [isExiting, setIsExiting] = useState(false)
  const config = toastConfig[type]
  const Icon = config.icon

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsExiting(true)
      setTimeout(() => onClose(id), 300)
    }, duration)

    return () => clearTimeout(timer)
  }, [id, duration, onClose])

  return (
    <div
      className={`flex items-start gap-3 rounded-xl border-l-4 ${config.borderColor} ${config.bgColor} p-4 shadow-lg transition-all duration-300 ${
        isExiting ? "translate-x-full opacity-0" : "translate-x-0 opacity-100"
      }`}
      style={{ minWidth: "320px", maxWidth: "420px" }}
    >
      <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${config.iconBg}`}>
        <Icon className={`h-5 w-5 ${config.iconColor}`} />
      </div>
      <div className="flex-1">
        <p className="font-semibold text-[#1E1E1E]">{title}</p>
        {message && <p className="mt-1 text-sm text-[#6B7280]">{message}</p>}
      </div>
      <button
        onClick={() => {
          setIsExiting(true)
          setTimeout(() => onClose(id), 300)
        }}
        className="shrink-0 text-[#6B7280] transition-colors hover:text-[#1E1E1E]"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  )
}

interface ToastContainerProps {
  toasts: Array<{
    id: string
    type: ToastType
    title: string
    message?: string
    duration?: number
  }>
  onClose: (id: string) => void
}

export function ToastContainer({ toasts, onClose }: ToastContainerProps) {
  return (
    <div className="fixed right-6 top-6 z-50 flex flex-col gap-3">
      {toasts.map((toast) => (
        <ProuvToast key={toast.id} {...toast} onClose={onClose} />
      ))}
    </div>
  )
}

// Hook for managing toasts
export function useProuvToast() {
  const [toasts, setToasts] = useState<Array<{
    id: string
    type: ToastType
    title: string
    message?: string
    duration?: number
  }>>([])

  const showToast = (type: ToastType, title: string, message?: string, duration?: number) => {
    const id = Date.now().toString()
    setToasts((prev) => [...prev, { id, type, title, message, duration }])
  }

  const closeToast = (id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id))
  }

  return {
    toasts,
    showToast,
    closeToast,
    success: (title: string, message?: string) => showToast("success", title, message),
    error: (title: string, message?: string) => showToast("error", title, message),
    warning: (title: string, message?: string) => showToast("warning", title, message),
    info: (title: string, message?: string) => showToast("info", title, message),
  }
}
