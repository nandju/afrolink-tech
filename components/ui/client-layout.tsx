"use client"

import { useState, type ReactNode } from "react"
import { ClientSidebar } from "@/components/ui/client-sidebar"
import { cn } from "@/lib/utils"

export function ClientLayout({ children, className }: { children: ReactNode; className?: string }) {
  const [isCollapsed, setIsCollapsed] = useState(false)

  return (
    <div className="flex min-h-screen bg-[#FAFAFA]">
      <ClientSidebar onCollapsedChange={setIsCollapsed} />
      <main
        className={cn(
          "flex-1 p-8 pt-20 lg:pt-8 transition-all duration-300",
          isCollapsed ? "lg:ml-20" : "lg:ml-64",
          className
        )}
      >
        {children}
      </main>
    </div>
  )
}
