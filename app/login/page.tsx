"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"
import { validateCredentials, setAuthSession } from "@/lib/auth"
import { Lock, User } from "lucide-react"
import { toast } from "sonner"

export default function LoginPage() {
  const router = useRouter()
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Simuler un délai pour l'UX
    await new Promise((resolve) => setTimeout(resolve, 500))

    if (validateCredentials(username, password)) {
      setAuthSession()
      // Définir un cookie pour le middleware
      document.cookie = "authenticated=true; path=/; max-age=86400" // 24h
      toast.success("Connexion réussie !")
      router.push("/dashboard")
    } else {
      toast.error("Identifiant ou mot de passe incorrect")
      setIsLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-[#000000] flex items-center justify-center px-6 py-20">
      {/* Background gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#000000]/70 via-transparent to-transparent" />

      <div className="relative z-10 w-full max-w-md">
        <Card className="bg-[#000000]/80 border-[#000000] backdrop-blur-md p-8">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#000000] border border-[#ffa51f] mb-4">
              <Lock className="w-8 h-8 text-[#ffa51f]" />
            </div>
            <h1 className="font-display text-3xl font-bold text-[#ffffff] mb-2">
              Accès restreint
            </h1>
            <p className="text-[#ffffff]/70 text-sm">
              Connectez-vous pour accéder à l'outil de génération
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="username" className="text-[#ffffff]">
                Identifiant
              </Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#ffa51f]" />
                <Input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Entrez votre identifiant"
                  className="pl-10 bg-[#000000]/70 border-[#ffa51f]/40 text-[#ffffff] placeholder:text-[#ffffff]/40"
                  required
                  disabled={isLoading}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-[#ffffff]">
                Mot de passe
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#ffa51f]" />
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Entrez votre mot de passe"
                  className="pl-10 bg-[#000000]/70 border-[#ffa51f]/40 text-[#ffffff] placeholder:text-[#ffffff]/40"
                  required
                  disabled={isLoading}
                />
              </div>
            </div>

            <Button
              type="submit"
              className="w-full bg-[#ffa51f] text-[#000000] hover:bg-[#ffa51f]/90 font-medium"
              disabled={isLoading}
            >
              {isLoading ? "Connexion..." : "Se connecter"}
            </Button>
          </form>

          <div className="mt-6 pt-6 border-t border-[#000000]">
            <p className="text-xs text-[#ffffff]/60 text-center">
              ⚠️ Accès réservé aux utilisateurs autorisés
            </p>
          </div>
        </Card>
      </div>
    </main>
  )
}
