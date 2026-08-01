"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { 
  LayoutDashboard, 
  History, 
  CreditCard, 
  FileText, 
  Settings, 
  HelpCircle, 
  LogOut,
  ChevronLeft,
  ChevronRight,
  User,
  Plus,
  Receipt,
} from "lucide-react"
import { clearAuthSession } from "@/lib/auth"
import { cn } from "@/lib/utils"

const menuItems = [
  { href: "/client/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/dashboard", label: "Créer une campagne", icon: Plus },
  { href: "/client/history", label: "Historique", icon: History },
  { href: "/client/credits", label: "Crédits", icon: CreditCard },
  { href: "/client/invoices", label: "Factures", icon: Receipt },
  { href: "/client/support", label: "Support", icon: HelpCircle },
  { href: "/client/settings", label: "Paramètres", icon: Settings },
]

export function ClientSidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const pathname = usePathname()
  const router = useRouter()

  const handleLogout = () => {
    clearAuthSession()
    document.cookie = "authenticated=; path=/; max-age=0"
    router.push("/login")
  }

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 z-40 h-screen border-r border-[#E5E7EB] bg-white transition-all duration-300",
        isCollapsed ? "w-20" : "w-64"
      )}
    >
      <div className="flex h-full flex-col">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#E5E7EB] p-4">
          {!isCollapsed && (
            <div className="flex items-center gap-2">
              <img src="/logo/icone_orange.png" alt="PROUV" className="h-8 w-8 rounded-lg" />
              <span className="font-heading text-lg font-bold text-[#1E1E1E]">PROUV</span>
            </div>
          )}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="rounded-lg p-2 text-[#6B7280] transition-colors hover:bg-[#FAFAFA] hover:text-[#1E1E1E]"
          >
            {isCollapsed ? <ChevronRight className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
          </button>
        </div>

        {/* User Info */}
        <div className="border-b border-[#E5E7EB] p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-[#D68C2D] to-[#12A2AC]">
              <User className="h-5 w-5 text-white" />
            </div>
            {!isCollapsed && (
              <div className="flex-1 overflow-hidden">
                <p className="truncate text-sm font-semibold text-[#1E1E1E]">Utilisateur</p>
                <p className="truncate text-xs text-[#6B7280]">user@example.com</p>
              </div>
            )}
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-3">
          <ul className="space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href
              
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all",
                      isActive
                        ? "bg-[#D68C2D] text-white shadow-md"
                        : "text-[#6B7280] hover:bg-[#FAFAFA] hover:text-[#1E1E1E]",
                      isCollapsed && "justify-center"
                    )}
                  >
                    <Icon className="h-5 w-5 shrink-0" />
                    {!isCollapsed && <span>{item.label}</span>}
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>

        {/* Footer */}
        <div className="border-t border-[#E5E7EB] p-3">
          <button
            onClick={handleLogout}
            className={cn(
              "flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-[#6B7280] transition-all hover:bg-red-50 hover:text-red-600",
              isCollapsed && "justify-center"
            )}
          >
            <LogOut className="h-5 w-5 shrink-0" />
            {!isCollapsed && <span>Déconnexion</span>}
          </button>
        </div>
      </div>
    </aside>
  )
}
