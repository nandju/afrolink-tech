"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"
import { validateCredentials, setAuthSession } from "@/lib/auth"
import { ArrowRight, FileText, Lock, Sparkles, User } from "lucide-react"
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
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#000000] px-6 py-16">
      {/* Background gradient overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_28%_64%,rgba(255,165,31,0.22),transparent_30%),radial-gradient(circle_at_66%_40%,rgba(255,255,255,0.08),transparent_28%),linear-gradient(180deg,rgba(0,0,0,0.2),rgba(0,0,0,0.95))]" />

      <div className="relative z-10 grid w-full max-w-6xl items-center gap-10 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="relative hidden min-h-[620px] overflow-hidden rounded-[2rem] border border-[#ffffff]/10 bg-[#080808] shadow-[0_35px_120px_rgba(0,0,0,0.65)] lg:block">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_48%_62%,rgba(255,165,31,0.45),transparent_22%),radial-gradient(circle_at_50%_48%,rgba(255,255,255,0.16),transparent_18%),linear-gradient(180deg,#111827_0%,#050505_62%,#000000_100%)]" />
          <div className="absolute inset-x-0 bottom-0 h-[48%] bg-[radial-gradient(ellipse_at_center,rgba(255,165,31,0.28),transparent_56%)]" />
          <div className="absolute bottom-0 left-0 right-0 h-[42%]">
            <div className="absolute bottom-0 left-[8%] h-36 w-44 rounded-[55%] bg-[#ffa51f]/55 blur-xl" />
            <div className="absolute bottom-8 left-[28%] h-44 w-56 rounded-[55%] bg-[#f4a460]/45 blur-2xl" />
            <div className="absolute bottom-4 right-[10%] h-40 w-52 rounded-[55%] bg-[#ffffff]/18 blur-2xl" />
            <div className="absolute bottom-[26%] left-[18%] h-24 w-44 rounded-[50%] bg-[#2f1c10]" />
            <div className="absolute bottom-[31%] left-[30%] h-32 w-48 rounded-[50%] bg-[#8b4a1f]" />
            <div className="absolute bottom-[26%] right-[24%] h-24 w-40 rounded-[50%] bg-[#5f351c]" />
          </div>
          <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent,rgba(0,0,0,0.24)),radial-gradient(circle_at_50%_50%,transparent,rgba(0,0,0,0.34))]" />

          <div className="relative z-10 flex h-full flex-col justify-between p-8">
            <div className="inline-flex w-fit items-center gap-2 rounded-full border border-[#ffffff]/10 bg-[#000000]/30 px-4 py-2 backdrop-blur-xl">
              <span className="font-display text-lg font-semibold text-[#ffffff]">AfroCertify</span>
              <span className="rounded-md border border-[#ffa51f]/35 px-1.5 py-0.5 text-xs font-semibold text-[#ffa51f]">AL</span>
            </div>

            <div className="max-w-sm">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#ffa51f]/20 bg-[#ffa51f]/10 px-3 py-1.5 text-xs font-medium text-[#ffffff]/80 backdrop-blur-xl">
                <Sparkles className="size-3.5 text-[#ffa51f]" />
                Génération de certificats PDF
              </div>
              <h2 className="font-display text-4xl font-bold tracking-[-0.05em] text-[#ffffff]">
                Un espace sécurisé pour vos certificats.
              </h2>
              <p className="mt-4 text-sm leading-relaxed text-[#ffffff]/60">
                Importez vos modèles, configurez vos données et générez vos certificats depuis un tableau de bord protégé.
              </p>
            </div>
          </div>
        </div>

        <Card className="mx-auto w-full max-w-md border-[#ffffff]/10 bg-[#070707]/72 p-6 shadow-[0_30px_100px_rgba(0,0,0,0.55)] backdrop-blur-2xl sm:p-8">
          <div className="mb-8">
            <div className="mb-8 flex items-center gap-3 lg:hidden">
              <div className="flex size-10 items-center justify-center rounded-full border border-[#ffa51f]/25 bg-[#ffa51f]/10">
                <FileText className="size-5 text-[#ffa51f]" />
              </div>
              <span className="font-display text-xl font-semibold text-[#ffffff]">AfroCertify</span>
            </div>

            <div className="mb-5 inline-flex items-center justify-center rounded-full border border-[#ffa51f]/25 bg-[#ffa51f]/10 p-3">
              <Lock className="size-6 text-[#ffa51f]" />
            </div>
            <h1 className="font-display text-4xl font-bold tracking-[-0.05em] text-[#ffffff]">
              Accès restreint
            </h1>
            <p className="mt-3 text-sm leading-relaxed text-[#ffffff]/62">
              Connectez-vous pour accéder à l'outil de génération
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="username" className="text-sm text-[#ffffff]/82">
                Identifiant
              </Label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 size-5 -translate-y-1/2 text-[#ffa51f]" />
                <Input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Entrez votre identifiant"
                  className="h-12 rounded-2xl border-[#ffffff]/12 bg-[#000000]/55 pl-12 text-[#ffffff] placeholder:text-[#ffffff]/35 focus-visible:border-[#ffa51f]/70 focus-visible:ring-[#ffa51f]/25"
                  required
                  disabled={isLoading}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm text-[#ffffff]/82">
                Mot de passe
              </Label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 size-5 -translate-y-1/2 text-[#ffa51f]" />
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Entrez votre mot de passe"
                  className="h-12 rounded-2xl border-[#ffffff]/12 bg-[#000000]/55 pl-12 text-[#ffffff] placeholder:text-[#ffffff]/35 focus-visible:border-[#ffa51f]/70 focus-visible:ring-[#ffa51f]/25"
                  required
                  disabled={isLoading}
                />
              </div>
            </div>

            <Button
              type="submit"
              className="group h-12 w-full rounded-2xl bg-[#ffffff] font-semibold text-[#000000] transition-all duration-300 hover:bg-[#ffa51f]"
              disabled={isLoading}
            >
              <span>{isLoading ? "Connexion..." : "Se connecter"}</span>
              {!isLoading && <ArrowRight className="ml-2 size-4 transition-transform duration-300 group-hover:translate-x-1" />}
            </Button>
          </form>

          <div className="mt-6 border-t border-[#ffffff]/10 pt-6">
            <p className="text-center text-xs text-[#ffffff]/55">
              ⚠️ Accès réservé aux utilisateurs autorisés
            </p>
          </div>
        </Card>
      </div>
    </main>
  )
}
