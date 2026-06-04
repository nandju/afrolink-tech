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
  User
} from "lucide-react"
import { clearAuthSession } from "@/lib/auth"
import { cn } from "@/lib/utils"

const menuItems = [
  { href: "/dashboard", label: "Tableau de bord", icon: LayoutDashboard },
  { href: "/client/history", label: "Historique", icon: History },
  { href: "/client/credits", label: "Crédits", icon: CreditCard },
  { href: "/client/invoices", label: "Factures", icon: FileText },
  { href: "/client/settings", label: "Paramètres", icon: Settings },
  { href: "/client/support", label: "Support", icon: HelpCircle },
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
        "fixed left-0 top-0 z-40 h-screen border-r border-[#ffffff]/10 bg-[#0a0a0a] transition-all duration-300",
        isCollapsed ? "w-20" : "w-64"
      )}
    >
      <div className="flex h-full flex-col">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#ffffff]/10 p-4">
          {!isCollapsed && (
            <div className="flex items-center gap-2">
              <img src="/logo/icone_orange.png" alt="PROUV" className="h-8 w-8 rounded-lg bg-white p-1" />
              <span className="font-heading text-lg font-bold text-white">PROUV</span>
            </div>
          )}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="rounded-lg p-2 text-[#ffffff]/70 transition-colors hover:bg-[#ffffff]/10 hover:text-white"
          >
            {isCollapsed ? <ChevronRight className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
          </button>
        </div>

        {/* User Info */}
        <div className="border-b border-[#ffffff]/10 p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#ffa51f]/20">
              <User className="h-5 w-5 text-[#ffa51f]" />
            </div>
            {!isCollapsed && (
              <div className="flex-1 overflow-hidden">
                <p className="truncate text-sm font-semibold text-white">Utilisateur</p>
                <p className="truncate text-xs text-[#ffffff]/60">user@example.com</p>
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
                      "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all",
                      isActive
                        ? "bg-[#ffa51f] text-[#000000]"
                        : "text-[#ffffff]/70 hover:bg-[#ffffff]/10 hover:text-white",
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
        <div className="border-t border-[#ffffff]/10 p-3">
          <button
            onClick={handleLogout}
            className={cn(
              "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-[#ffffff]/70 transition-all hover:bg-red-500/10 hover:text-red-400",
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
